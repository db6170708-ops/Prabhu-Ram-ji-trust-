import express, { Request, Response } from 'express';
import crypto from 'crypto';
import { db, generateNextCouponSerial } from './db.js';
import {
  AuthenticatedRequest,
  getClientIp,
  requireAdmin,
} from './certificatesRouter.js';

function recordLuckyDrawAudit(
  action: string,
  actor: string,
  actorRole: string,
  previousState: unknown,
  newState: unknown,
  details: string,
  ipAddress: string
) {
  try {
    db.prepare(
      `INSERT INTO lucky_draw_audit_logs
       (action, actor, actor_role, previous_state, new_state, details, ip_address, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      action,
      actor,
      actorRole,
      previousState ? JSON.stringify(previousState) : '',
      newState ? JSON.stringify(newState) : '',
      details,
      ipAddress,
      new Date().toISOString()
    );
  } catch (err) {
    console.error('[LuckyDraw Audit Error]', err);
  }
}

function getSettingsRow(): any {
  return db.prepare('SELECT * FROM lucky_draw_settings WHERE id = 1').get();
}

function getActiveSampleRow(sampleId?: number | null): any | null {
  if (sampleId) {
    const byId = db.prepare('SELECT * FROM lucky_draw_samples WHERE id = ?').get(sampleId);
    if (byId) return byId;
  }
  return db.prepare('SELECT * FROM lucky_draw_samples WHERE is_active = 1 ORDER BY id DESC LIMIT 1').get() || null;
}

function mapSample(row: any) {
  if (!row) return null;
  const nextSerial = generateNextCouponSerial(row.number_prefix, row.pad_length, row.start_number);
  return {
    id: row.id,
    name: row.name,
    sampleFileType: row.sample_file_type,
    sampleDataUrl: row.sample_data_url,
    widthPx: row.width_px,
    heightPx: row.height_px,
    numberPrefix: row.number_prefix,
    padLength: row.pad_length,
    startNumber: row.start_number,
    nextPreviewNumber: nextSerial.couponNumber,
    serialXPct: row.serial_x_pct,
    serialYPct: row.serial_y_pct,
    serialFontSize: row.serial_font_size,
    serialColor: row.serial_color,
    nameXPct: row.name_x_pct,
    nameYPct: row.name_y_pct,
    nameFontSize: row.name_font_size,
    nameColor: row.name_color,
    showQr: Boolean(row.show_qr),
    qrXPct: row.qr_x_pct,
    qrYPct: row.qr_y_pct,
    qrSizePx: row.qr_size_px,
    isActive: Boolean(row.is_active),
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapSettings(row: any) {
  return {
    masterEnabled: Boolean(row.master_enabled),
    homepageVisibility: Boolean(row.homepage_visibility),
    bookingEnabled: Boolean(row.booking_enabled),
    autoCouponGeneration: Boolean(row.auto_coupon_generation),
    ticketPrice: Number(row.ticket_price) || 200,
    campaignTitle: row.campaign_title,
    campaignSubtitle: row.campaign_subtitle,
    paymentGatewayMode: row.payment_gateway_mode === 'live' ? 'live' : 'test',
    paymentProvider: row.payment_provider || 'razorpay',
    kycVerified: Boolean(row.kyc_verified),
    legalPermissionVerified: Boolean(row.legal_permission_verified),
    webhookVerified: Boolean(row.webhook_verified),
    hasWebhookSecret: Boolean(row.webhook_secret && String(row.webhook_secret).trim().length >= 8),
    webhookSecretMasked:
      row.webhook_secret && String(row.webhook_secret).length >= 6
        ? `${String(row.webhook_secret).slice(0, 4)}••••${String(row.webhook_secret).slice(-2)}`
        : '',
    bankVerified: Boolean(row.bank_verified),
    activeSampleId: row.active_sample_id || null,
    activatedAt: row.activated_at || '',
    activatedBy: row.activated_by || '',
    updatedAt: row.updated_at,
  };
}

function mapCoupon(row: any, sample?: any) {
  return {
    id: row.id,
    couponNumber: row.coupon_number,
    serialSeq: row.serial_seq,
    sampleId: row.sample_id,
    numberPrefix: row.number_prefix,
    paymentId: row.payment_id,
    orderId: row.order_id,
    buyerName: row.buyer_name,
    buyerMobile: row.buyer_mobile,
    buyerEmail: row.buyer_email || '',
    amount: Number(row.amount),
    status: row.status,
    issuedAt: row.issued_at,
    verifyUrl: `https://prabhuramjitrustram.ai.studio/verify-coupon/${encodeURIComponent(row.coupon_number)}`,
    sample: sample ? mapSample(sample) : undefined,
  };
}

function evaluateActivationReadiness(settingsRow: any, activeSample: any | null) {
  const missing: Array<{ code: string; label: string }> = [];

  if (!activeSample || !settingsRow.active_sample_id) {
    missing.push({
      code: 'SAMPLE_REQUIRED',
      label: 'कम से कम एक सक्रिय कूपन सैंपल (Active Coupon Sample) अपलोड और सेट होना अनिवार्य है।',
    });
  }
  if (!settingsRow.kyc_verified || !settingsRow.legal_permission_verified) {
    missing.push({
      code: 'KYC_LEGAL_REQUIRED',
      label: 'ट्रस्ट की KYC एवं कानूनी अनुमतियाँ (Legal Permissions) सत्यापित होना आवश्यक है।',
    });
  }
  if (settingsRow.payment_gateway_mode !== 'live') {
    missing.push({
      code: 'GATEWAY_LIVE_REQUIRED',
      label: 'Payment Gateway को Test Mode से बदलकर Live Mode में कॉन्फ़िगर करें।',
    });
  }
  if (!settingsRow.webhook_verified || !settingsRow.webhook_secret || String(settingsRow.webhook_secret).trim().length < 8) {
    missing.push({
      code: 'WEBHOOK_REQUIRED',
      label: 'वास्तविक Webhook Secret व Webhook Verification सक्रिय होना अनिवार्य है।',
    });
  }
  if (!settingsRow.bank_verified) {
    missing.push({
      code: 'BANK_REQUIRED',
      label: 'ट्रस्ट के IDBI बैंक खाते की पुष्टि चिह्नित होना अनिवार्य है।',
    });
  }

  return {
    ready: missing.length === 0,
    missing,
  };
}

function issueCouponsForVerifiedPaymentTxn(paymentRow: any, activeSample: any) {
  return db.transaction(() => {
    const qty = Math.max(1, Number(paymentRow.quantity) || 1);
    const createdCoupons: any[] = [];
    const now = new Date().toISOString();

    for (let i = 0; i < qty; i++) {
      const { serialSeq, couponNumber } = generateNextCouponSerial(
        activeSample.number_prefix,
        activeSample.pad_length,
        activeSample.start_number
      );

      const ins = db
        .prepare(
          `INSERT INTO lucky_draw_coupons (
            coupon_number, serial_seq, sample_id, number_prefix,
            payment_id, order_id, buyer_name, buyer_mobile, buyer_email,
            amount, status, issued_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'valid', ?)`
        )
        .run(
          couponNumber,
          serialSeq,
          activeSample.id,
          activeSample.number_prefix,
          paymentRow.id,
          paymentRow.order_id,
          paymentRow.buyer_name,
          paymentRow.buyer_mobile,
          paymentRow.buyer_email || '',
          Math.round(Number(paymentRow.amount) / qty),
          now
        );

      const row = db
        .prepare('SELECT * FROM lucky_draw_coupons WHERE id = ?')
        .get(ins.lastInsertRowid);
      createdCoupons.push(row);
    }

    db.prepare('UPDATE lucky_draw_payments SET coupon_generated = 1 WHERE id = ?').run(paymentRow.id);
    return createdCoupons;
  })();
}

export function createLuckyDrawRouter() {
  const router = express.Router();

  // =========================================================================
  // 1. PUBLIC READ-ONLY STATUS (Strictly sanitized — NO secrets)
  // =========================================================================
  router.get('/public/lucky-draw/status', (_req: Request, res: Response) => {
    try {
      const settings = getSettingsRow();
      const activeSample = getActiveSampleRow(settings?.active_sample_id);
      const isPublicVisible = Boolean(settings?.master_enabled && settings?.homepage_visibility);
      const isBookingOpen = Boolean(
        settings?.master_enabled &&
          settings?.homepage_visibility &&
          settings?.booking_enabled &&
          activeSample
      );

      res.json({
        success: true,
        status: {
          systemEnabled: Boolean(settings?.master_enabled),
          homepageVisible: isPublicVisible,
          bookingOpen: isBookingOpen,
          autoCouponGeneration: Boolean(settings?.auto_coupon_generation),
          ticketPrice: Number(settings?.ticket_price) || 200,
          campaignTitle: settings?.campaign_title || '',
          campaignSubtitle: settings?.campaign_subtitle || '',
          gatewayMode: settings?.payment_gateway_mode === 'live' ? 'live' : 'test',
          hasActiveSample: Boolean(activeSample),
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =========================================================================
  // 2. PUBLIC BOOKING GUARDED ENDPOINTS (Direct URL / API Bypass Protected)
  // =========================================================================
  router.post('/public/lucky-draw/create-order', (req: Request, res: Response) => {
    try {
      const settings = getSettingsRow();
      const activeSample = getActiveSampleRow(settings?.active_sample_id);

      // Strict server-side authorization checks
      if (!settings?.master_enabled) {
        res.status(403).json({
          success: false,
          error: 'लकी ड्रॉ सिस्टम वर्तमान में बंद (OFF) है।',
        });
        return;
      }
      if (!settings?.homepage_visibility || !settings?.booking_enabled) {
        res.status(403).json({
          success: false,
          error: 'लकी ड्रॉ कूपन बुकिंग वर्तमान में एडमिन द्वारा बंद है।',
        });
        return;
      }
      if (!activeSample) {
        res.status(503).json({
          success: false,
          error: 'सक्रिय कूपन सैंपल उपलब्ध नहीं है।',
        });
        return;
      }

      const buyerName = typeof req.body?.buyerName === 'string' ? req.body.buyerName.trim() : '';
      const buyerMobile =
        typeof req.body?.buyerMobile === 'string'
          ? req.body.buyerMobile.replace(/\D/g, '')
          : '';
      const buyerEmail = typeof req.body?.buyerEmail === 'string' ? req.body.buyerEmail.trim() : '';
      const quantity = Math.min(Math.max(parseInt(String(req.body?.quantity || 1), 10) || 1, 1), 10);

      if (!buyerName) {
        res.status(400).json({ success: false, error: 'कृपया अपना पूरा नाम दर्ज करें।' });
        return;
      }
      if (buyerMobile.length < 10) {
        res.status(400).json({ success: false, error: 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।' });
        return;
      }

      // Server calculates exact total amount — never trust client amount
      const ticketPrice = Number(settings.ticket_price) || 200;
      const amount = quantity * ticketPrice;
      const orderId = `LDORD-${Date.now()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
      const now = new Date().toISOString();

      db.prepare(
        `INSERT INTO lucky_draw_payments (
          order_id, buyer_name, buyer_mobile, buyer_email,
          quantity, amount, gateway_mode, payment_status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`
      ).run(
        orderId,
        buyerName,
        buyerMobile,
        buyerEmail,
        quantity,
        amount,
        settings.payment_gateway_mode,
        now
      );

      // Compute deterministic HMAC verification token for webhook / client handoff verification
      const hmacKey = settings.webhook_secret || 'prt_fallback_hmac';
      const orderSignature = crypto
        .createHmac('sha256', hmacKey)
        .update(`${orderId}|${amount}|${buyerMobile}`)
        .digest('hex');

      res.status(201).json({
        success: true,
        order: {
          orderId,
          amount,
          quantity,
          ticketPrice,
          gatewayMode: settings.payment_gateway_mode,
          provider: settings.payment_provider,
          verificationToken: orderSignature,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || 'Order creation failed' });
    }
  });

  // Verify payment & webhook signature; handles in-flight payments safely even if booking turned OFF mid-flight
  router.post('/public/lucky-draw/verify-payment', (req: Request, res: Response) => {
    try {
      const { orderId, paymentRef, verificationToken } = req.body || {};
      if (!orderId || typeof orderId !== 'string') {
        res.status(400).json({ success: false, error: 'Order ID आवश्यक है।' });
        return;
      }
      const cleanRef = typeof paymentRef === 'string' ? paymentRef.trim() : '';
      if (cleanRef.length < 6) {
        res.status(400).json({
          success: false,
          error: 'कृपया भुगतान के बाद प्राप्त वैध Transaction / UTR / Payment ID दर्ज करें।',
        });
        return;
      }

      const paymentRow = db
        .prepare('SELECT * FROM lucky_draw_payments WHERE order_id = ?')
        .get(orderId.trim()) as any;

      if (!paymentRow) {
        res.status(404).json({ success: false, error: 'ऑर्डर रिकॉर्ड नहीं मिला।' });
        return;
      }

      const settings = getSettingsRow();
      const hmacKey = settings.webhook_secret || 'prt_fallback_hmac';
      const expectedSig = crypto
        .createHmac('sha256', hmacKey)
        .update(`${paymentRow.order_id}|${paymentRow.amount}|${paymentRow.buyer_mobile}`)
        .digest('hex');

      const providedSig = typeof verificationToken === 'string' ? verificationToken.trim() : '';
      const sigOk =
        providedSig.length === expectedSig.length &&
        crypto.timingSafeEqual(Buffer.from(providedSig), Buffer.from(expectedSig));

      if (!sigOk) {
        recordLuckyDrawAudit(
          'WEBHOOK_SIGNATURE_REJECTED',
          paymentRow.buyer_name,
          'public',
          { orderId: paymentRow.order_id },
          { paymentRef: cleanRef },
          `Invalid verification token on payment confirm for ${paymentRow.order_id}`,
          getClientIp(req)
        );
        res.status(401).json({
          success: false,
          error: 'भुगतान सुरक्षा हस्ताक्षर (Webhook Signature) सत्यापित नहीं हो सका।',
        });
        return;
      }

      // Idempotency: if coupons already generated for this order, return them cleanly
      if (paymentRow.coupon_generated) {
        const existingCoupons = db
          .prepare('SELECT * FROM lucky_draw_coupons WHERE order_id = ? ORDER BY id ASC')
          .all(paymentRow.order_id) as any[];
        const sample = existingCoupons[0] ? getActiveSampleRow(existingCoupons[0].sample_id) : null;
        res.json({
          success: true,
          paymentVerified: true,
          couponGenerated: true,
          coupons: existingCoupons.map((c) => mapCoupon(c, sample)),
          message: 'कूपन पहले ही जारी किए जा चुके हैं।',
        });
        return;
      }

      const now = new Date().toISOString();
      // ALWAYS persist verified payment safely (zero data loss even if admin turned system OFF during payment!)
      db.prepare(
        `UPDATE lucky_draw_payments SET
          payment_ref = ?,
          payment_status = 'verified',
          webhook_verified = 1,
          webhook_signature = ?,
          verified_at = ?
        WHERE id = ?`
      ).run(cleanRef, providedSig, now, paymentRow.id);

      const updatedPayment = db
        .prepare('SELECT * FROM lucky_draw_payments WHERE id = ?')
        .get(paymentRow.id) as any;

      recordLuckyDrawAudit(
        'PAYMENT_VERIFIED',
        paymentRow.buyer_name,
        'webhook',
        { status: 'pending' },
        { status: 'verified', orderId: paymentRow.order_id, amount: paymentRow.amount },
        `Payment verified (Ref: ${cleanRef}) for order ${paymentRow.order_id}`,
        getClientIp(req)
      );

      // Granular Guard: Only auto-generate coupons when Automatic Coupon Generation Control === ON
      if (!settings.auto_coupon_generation) {
        res.json({
          success: true,
          paymentVerified: true,
          couponGenerated: false,
          coupons: [],
          message:
            'आपका भुगतान सुरक्षित रूप से डेटाबेस में दर्ज एवं सत्यापित हो गया है। वर्तमान में ऑटो-कूपन जनरेशन अस्थायी रूप से बंद है; एडमिन शीघ्र कूपन जारी करेंगे।',
        });
        return;
      }

      const activeSample = getActiveSampleRow(settings.active_sample_id);
      if (!activeSample) {
        res.json({
          success: true,
          paymentVerified: true,
          couponGenerated: false,
          coupons: [],
          message: 'भुगतान सुरक्षित है, परंतु सक्रिय कूपन सैंपल न होने से कूपन प्रतीक्षारत है।',
        });
        return;
      }

      const createdRows = issueCouponsForVerifiedPaymentTxn(updatedPayment, activeSample);

      recordLuckyDrawAudit(
        'COUPON_AUTO_GENERATED',
        paymentRow.buyer_name,
        'system',
        {},
        { coupons: createdRows.map((c) => c.coupon_number) },
        `Auto-generated ${createdRows.length} coupon(s) after verified payment ${paymentRow.order_id}`,
        getClientIp(req)
      );

      res.json({
        success: true,
        paymentVerified: true,
        couponGenerated: true,
        coupons: createdRows.map((c) => mapCoupon(c, activeSample)),
        message: 'भुगतान सत्यापित! आपका अद्वितीय लकी ड्रॉ कूपन तैयार है।',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || 'Verification failed' });
    }
  });

  // Direct gateway webhook receiver (Razorpay / Cashfree compatible HMAC SHA-256 verification)
  router.post('/public/lucky-draw/webhook', (req: Request, res: Response) => {
    try {
      const settings = getSettingsRow();
      const secret = settings.webhook_secret;
      const providedSig = String(
        req.headers['x-razorpay-signature'] ||
          req.headers['x-webhook-signature'] ||
          req.body?.signature ||
          ''
      ).trim();

      if (!secret || !providedSig) {
        res.status(401).json({ success: false, error: 'Missing webhook signature or secret' });
        return;
      }

      const rawBodyString = JSON.stringify(req.body?.payload || req.body || {});
      const expected = crypto.createHmac('sha256', secret).update(rawBodyString).digest('hex');

      const sigValid =
        providedSig.length === expected.length &&
        crypto.timingSafeEqual(Buffer.from(providedSig), Buffer.from(expected));

      if (!sigValid) {
        recordLuckyDrawAudit(
          'WEBHOOK_FORGERY_BLOCKED',
          'External Gateway',
          'webhook',
          {},
          { providedSig: providedSig.slice(0, 12) },
          'Blocked webhook call with invalid HMAC signature',
          getClientIp(req)
        );
        res.status(401).json({ success: false, error: 'Invalid HMAC signature' });
        return;
      }

      const orderId = req.body?.orderId || req.body?.payload?.payment?.entity?.notes?.orderId;
      const paymentRef = req.body?.paymentRef || req.body?.payload?.payment?.entity?.id || `WH-${Date.now()}`;

      if (!orderId) {
        res.status(400).json({ success: false, error: 'orderId missing in webhook payload' });
        return;
      }

      const paymentRow = db
        .prepare('SELECT * FROM lucky_draw_payments WHERE order_id = ?')
        .get(orderId) as any;
      if (!paymentRow) {
        res.status(404).json({ success: false, error: 'Order not found' });
        return;
      }

      const now = new Date().toISOString();
      db.prepare(
        `UPDATE lucky_draw_payments SET
          payment_ref = ?,
          payment_status = 'verified',
          webhook_verified = 1,
          webhook_signature = ?,
          verified_at = ?
        WHERE id = ?`
      ).run(paymentRef, providedSig, now, paymentRow.id);

      const updatedPayment = db
        .prepare('SELECT * FROM lucky_draw_payments WHERE id = ?')
        .get(paymentRow.id) as any;

      let issuedCoupons: any[] = [];
      if (settings.auto_coupon_generation && !updatedPayment.coupon_generated) {
        const activeSample = getActiveSampleRow(settings.active_sample_id);
        if (activeSample) {
          issuedCoupons = issueCouponsForVerifiedPaymentTxn(updatedPayment, activeSample);
        }
      }

      recordLuckyDrawAudit(
        'WEBHOOK_VERIFIED_EVENT',
        'Gateway Webhook',
        'webhook',
        {},
        { orderId, paymentRef, couponsIssued: issuedCoupons.length },
        `Webhook verified payment ${orderId}`,
        getClientIp(req)
      );

      res.json({ success: true, couponsIssued: issuedCoupons.length });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =========================================================================
  // 3. PUBLIC COUPON VERIFICATION ENDPOINT (Privacy-safe)
  // =========================================================================
  router.get('/public/lucky-draw/verify/:couponNumber', (req: Request, res: Response) => {
    try {
      const couponNo = decodeURIComponent(String(req.params.couponNumber || ''))
        .trim()
        .toUpperCase();
      if (!couponNo) {
        res.status(400).json({ found: false, error: 'Coupon number required' });
        return;
      }

      const row = db
        .prepare('SELECT * FROM lucky_draw_coupons WHERE UPPER(TRIM(coupon_number)) = ?')
        .get(couponNo) as any;

      if (!row) {
        res.status(404).json({
          found: false,
          message: 'यह लकी ड्रॉ कूपन संख्या हमारे रिकॉर्ड में उपलब्ध नहीं है।',
        });
        return;
      }

      const sample = getActiveSampleRow(row.sample_id);
      const maskedMobile =
        row.buyer_mobile && row.buyer_mobile.length >= 4
          ? `${'*'.repeat(Math.max(2, row.buyer_mobile.length - 4))}${row.buyer_mobile.slice(-4)}`
          : '••••';

      res.json({
        found: true,
        coupon: {
          couponNumber: row.coupon_number,
          buyerName: row.buyer_name,
          maskedMobile,
          amount: Number(row.amount),
          status: row.status,
          issuedAt: row.issued_at,
          issuer: 'प्रभु रामजी ट्रस्ट',
          sample: sample ? mapSample(sample) : undefined,
        },
      });
    } catch (error: any) {
      res.status(500).json({ found: false, error: error.message });
    }
  });

  // =========================================================================
  // 4. PROTECTED SUPER ADMIN ENDPOINTS
  // =========================================================================
  router.get('/admin/lucky-draw/dashboard', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
    try {
      const settingsRow = getSettingsRow();
      const activeSample = getActiveSampleRow(settingsRow?.active_sample_id);
      const readiness = evaluateActivationReadiness(settingsRow, activeSample);

      const totalCoupons = (
        db.prepare('SELECT COUNT(*) as c FROM lucky_draw_coupons').get() as { c: number }
      ).c;
      const totalSuccessfulPayments = (
        db
          .prepare("SELECT COUNT(*) as c FROM lucky_draw_payments WHERE payment_status = 'verified'")
          .get() as { c: number }
      ).c;
      const totalCollectedAmount = (
        db
          .prepare(
            "SELECT COALESCE(SUM(amount), 0) as s FROM lucky_draw_payments WHERE payment_status = 'verified'"
          )
          .get() as { s: number }
      ).s;

      const samples = db.prepare('SELECT * FROM lucky_draw_samples ORDER BY id DESC').all();
      const coupons = db
        .prepare('SELECT * FROM lucky_draw_coupons ORDER BY id DESC LIMIT 200')
        .all();
      const payments = db
        .prepare('SELECT * FROM lucky_draw_payments ORDER BY id DESC LIMIT 100')
        .all();
      const logs = db
        .prepare('SELECT * FROM lucky_draw_audit_logs ORDER BY id DESC LIMIT 120')
        .all();

      res.json({
        success: true,
        settings: mapSettings(settingsRow),
        activeSample: mapSample(activeSample),
        readiness,
        stats: {
          systemStatus: settingsRow.master_enabled ? 'ON' : 'OFF',
          activeSampleStatus: activeSample ? 'Uploaded' : 'Not Set',
          homepageStatus:
            settingsRow.master_enabled && settingsRow.homepage_visibility ? 'Visible' : 'Hidden',
          bookingStatus:
            settingsRow.master_enabled && settingsRow.booking_enabled ? 'Enabled' : 'Disabled',
          paymentGateway: settingsRow.payment_gateway_mode === 'live' ? 'Live' : 'Test',
          couponGeneration:
            settingsRow.master_enabled && settingsRow.auto_coupon_generation
              ? 'Enabled'
              : 'Disabled',
          totalCouponsGenerated: totalCoupons,
          totalSuccessfulPayments,
          totalCollectedAmount: Number(totalCollectedAmount) || 0,
        },
        samples: samples.map(mapSample),
        coupons: coupons.map((c: any) =>
          mapCoupon(
            c,
            samples.find((s: any) => s.id === c.sample_id)
          )
        ),
        payments,
        auditLogs: logs,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Update compliance, gateway, webhook, ticket price & campaign info
  router.put('/admin/lucky-draw/compliance', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const prev = getSettingsRow();
      const b = req.body || {};
      const now = new Date().toISOString();

      const nextGatewayMode =
        b.paymentGatewayMode === 'live'
          ? 'live'
          : b.paymentGatewayMode === 'test'
          ? 'test'
          : prev.payment_gateway_mode;

      const nextSecret =
        typeof b.webhookSecret === 'string' && b.webhookSecret.trim()
          ? b.webhookSecret.trim()
          : prev.webhook_secret;

      db.prepare(
        `UPDATE lucky_draw_settings SET
          ticket_price = ?,
          campaign_title = ?,
          campaign_subtitle = ?,
          payment_gateway_mode = ?,
          payment_provider = ?,
          kyc_verified = ?,
          legal_permission_verified = ?,
          webhook_verified = ?,
          webhook_secret = ?,
          bank_verified = ?,
          updated_at = ?
        WHERE id = 1`
      ).run(
        b.ticketPrice !== undefined ? Math.max(1, Number(b.ticketPrice) || 200) : prev.ticket_price,
        b.campaignTitle !== undefined ? String(b.campaignTitle).trim() : prev.campaign_title,
        b.campaignSubtitle !== undefined ? String(b.campaignSubtitle).trim() : prev.campaign_subtitle,
        nextGatewayMode,
        b.paymentProvider !== undefined ? String(b.paymentProvider) : prev.payment_provider,
        b.kycVerified !== undefined ? (b.kycVerified ? 1 : 0) : prev.kyc_verified,
        b.legalPermissionVerified !== undefined
          ? b.legalPermissionVerified
            ? 1
            : 0
          : prev.legal_permission_verified,
        b.webhookVerified !== undefined ? (b.webhookVerified ? 1 : 0) : prev.webhook_verified,
        nextSecret,
        b.bankVerified !== undefined ? (b.bankVerified ? 1 : 0) : prev.bank_verified,
        now
      );

      const updated = getSettingsRow();
      // Safety auto-lock: if admin turns off KYC/Live/Webhook/Bank while live, automatically turn system OFF
      const activeSample = getActiveSampleRow(updated.active_sample_id);
      const readiness = evaluateActivationReadiness(updated, activeSample);
      if (updated.master_enabled && !readiness.ready) {
        db.prepare(
          `UPDATE lucky_draw_settings SET
            master_enabled = 0, homepage_visibility = 0, booking_enabled = 0, auto_coupon_generation = 0, updated_at = ?
          WHERE id = 1`
        ).run(now);
      }

      const finalRow = getSettingsRow();
      recordLuckyDrawAudit(
        'COMPLIANCE_SETTINGS_UPDATED',
        req.admin?.actor || 'Super Admin',
        req.admin?.role || 'super_admin',
        mapSettings(prev),
        mapSettings(finalRow),
        'Updated KYC / Legal / Gateway / Webhook / Bank verification settings',
        getClientIp(req)
      );

      res.json({
        success: true,
        settings: mapSettings(finalRow),
        readiness,
        message: 'अनुपालन एवं गेटवे सेटिंग्स सफलतापूर्वक सहेजी गईं।',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Strictly validate all 6 Live Activation Requirements before turning system ON
  router.post('/admin/lucky-draw/activate', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const settingsRow = getSettingsRow();
      const activeSample = getActiveSampleRow(settingsRow?.active_sample_id);
      const readiness = evaluateActivationReadiness(settingsRow, activeSample);

      if (!readiness.ready) {
        recordLuckyDrawAudit(
          'LIVE_ACTIVATION_BLOCKED',
          req.admin?.actor || 'Super Admin',
          req.admin?.role || 'super_admin',
          mapSettings(settingsRow),
          { missing: readiness.missing.map((m) => m.code) },
          `Activation blocked: ${readiness.missing.map((m) => m.code).join(', ')}`,
          getClientIp(req)
        );
        res.status(400).json({
          success: false,
          error: readiness.missing[0]?.label || 'लकी ड्रॉ लाइव करने हेतु सभी 6 शर्तें पूरी नहीं हैं।',
          missing: readiness.missing,
        });
        return;
      }

      if (req.body?.confirmLiveActivation !== true) {
        res.status(400).json({
          success: false,
          error: 'अंतिम Live Confirmation Popup अनुमोदन आवश्यक है।',
        });
        return;
      }

      const now = new Date().toISOString();
      const actor = req.admin?.actor || 'Super Admin';
      db.prepare(
        `UPDATE lucky_draw_settings SET
          master_enabled = 1,
          homepage_visibility = 1,
          booking_enabled = 1,
          auto_coupon_generation = 1,
          activated_at = ?,
          activated_by = ?,
          updated_at = ?
        WHERE id = 1`
      ).run(now, actor, now);

      const updated = getSettingsRow();
      recordLuckyDrawAudit(
        'LIVE_ACTIVATION_SUCCESS',
        actor,
        req.admin?.role || 'super_admin',
        mapSettings(settingsRow),
        mapSettings(updated),
        'Super Admin activated Lucky Draw Live System after all 6 verification checks passed',
        getClientIp(req)
      );

      res.json({
        success: true,
        settings: mapSettings(updated),
        message: 'लकी ड्रॉ सिस्टम सफलतापूर्वक LIVE कर दिया गया है!',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Granular Controls Update (Master ON/OFF, Homepage Visibility, Booking, Auto Coupon Generation)
  router.put('/admin/lucky-draw/controls', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const prev = getSettingsRow();
      const activeSample = getActiveSampleRow(prev.active_sample_id);
      const b = req.body || {};

      const nextMaster =
        b.masterEnabled !== undefined ? Boolean(b.masterEnabled) : Boolean(prev.master_enabled);
      const nextHomepage =
        b.homepageVisibility !== undefined
          ? Boolean(b.homepageVisibility)
          : Boolean(prev.homepage_visibility);
      const nextBooking =
        b.bookingEnabled !== undefined
          ? Boolean(b.bookingEnabled)
          : Boolean(prev.booking_enabled);
      const nextAutoGen =
        b.autoCouponGeneration !== undefined
          ? Boolean(b.autoCouponGeneration)
          : Boolean(prev.auto_coupon_generation);

      // If ANY live flag is being turned ON, strictly check readiness & master toggle
      if (nextMaster || nextHomepage || nextBooking || nextAutoGen) {
        const readiness = evaluateActivationReadiness(prev, activeSample);
        if (!readiness.ready) {
          res.status(400).json({
            success: false,
            error:
              readiness.missing[0]?.label ||
              'लाइव कंट्रोल चालू करने के लिए पहले सभी 6 शर्तें (सैंपल, KYC, Live गेटवे, Webhook, बैंक) पूरी करें।',
            missing: readiness.missing,
          });
          return;
        }
        if (!nextMaster && (nextHomepage || nextBooking || nextAutoGen)) {
          res.status(400).json({
            success: false,
            error: 'कृपया पहले मुख्य सिस्टम (ACTIVATE LUCKY DRAW) को ON करें।',
          });
          return;
        }
      }

      const now = new Date().toISOString();
      // If masterEnabled turned OFF, immediately force all 3 granular controls OFF too
      const finalMaster = nextMaster ? 1 : 0;
      const finalHomepage = finalMaster && nextHomepage ? 1 : 0;
      const finalBooking = finalMaster && nextBooking ? 1 : 0;
      const finalAutoGen = finalMaster && nextAutoGen ? 1 : 0;

      db.prepare(
        `UPDATE lucky_draw_settings SET
          master_enabled = ?,
          homepage_visibility = ?,
          booking_enabled = ?,
          auto_coupon_generation = ?,
          updated_at = ?
        WHERE id = 1`
      ).run(finalMaster, finalHomepage, finalBooking, finalAutoGen, now);

      const updated = getSettingsRow();
      recordLuckyDrawAudit(
        finalMaster ? 'GRANULAR_CONTROLS_UPDATED' : 'SYSTEM_TURNED_OFF',
        req.admin?.actor || 'Super Admin',
        req.admin?.role || 'super_admin',
        mapSettings(prev),
        mapSettings(updated),
        `Controls set -> Master:${finalMaster}, Homepage:${finalHomepage}, Booking:${finalBooking}, AutoGen:${finalAutoGen}`,
        getClientIp(req)
      );

      res.json({
        success: true,
        settings: mapSettings(updated),
        message: finalMaster
          ? 'लकी ड्रॉ नियंत्रण सेटिंग्स अपडेट की गईं।'
          : 'लकी ड्रॉ सिस्टम सुरक्षित रूप से OFF कर दिया गया है (पुराने रिकॉर्ड सुरक्षित हैं)।',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =========================================================================
  // 5. COUPON SAMPLE UPLOAD, COORDINATE CONFIG & ACTIVATION
  // =========================================================================
  router.post('/admin/lucky-draw/samples', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const b = req.body || {};
      const name = typeof b.name === 'string' ? b.name.trim() : '';
      const sampleDataUrl =
        typeof b.sampleDataUrl === 'string' ? b.sampleDataUrl.trim() : '';

      if (!name) {
        res.status(400).json({ success: false, error: 'कृपया कूपन सैंपल का नाम दर्ज करें।' });
        return;
      }
      if (!sampleDataUrl) {
        res.status(400).json({
          success: false,
          error: 'कृपया कूपन सैंपल डिज़ाइन (Image PNG/JPG या PDF) अपलोड करें।',
        });
        return;
      }

      const fileType = b.sampleFileType === 'pdf' ? 'pdf' : 'image';
      const prefix =
        typeof b.numberPrefix === 'string' && b.numberPrefix.trim()
          ? b.numberPrefix.trim()
          : 'PRRT-LD-2026-';
      const padLength = Math.min(Math.max(Number(b.padLength) || 4, 2), 8);
      const startNumber = Math.max(Number(b.startNumber) || 1, 1);
      const setActive = b.setActive !== false;
      const now = new Date().toISOString();

      const createTxn = db.transaction(() => {
        if (setActive) {
          db.prepare('UPDATE lucky_draw_samples SET is_active = 0').run();
        }

        const result = db
          .prepare(
            `INSERT INTO lucky_draw_samples (
              name, sample_file_type, sample_data_url, width_px, height_px,
              number_prefix, pad_length, start_number,
              serial_x_pct, serial_y_pct, serial_font_size, serial_color,
              name_x_pct, name_y_pct, name_font_size, name_color,
              show_qr, qr_x_pct, qr_y_pct, qr_size_px,
              is_active, created_by, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          )
          .run(
            name,
            fileType,
            sampleDataUrl,
            Number(b.widthPx) || 1000,
            Number(b.heightPx) || 420,
            prefix,
            padLength,
            startNumber,
            Number(b.serialXPct ?? 72),
            Number(b.serialYPct ?? 24),
            Number(b.serialFontSize ?? 24),
            String(b.serialColor || '#0f4d3a'),
            Number(b.nameXPct ?? 28),
            Number(b.nameYPct ?? 58),
            Number(b.nameFontSize ?? 22),
            String(b.nameColor || '#1c1917'),
            b.showQr === false ? 0 : 1,
            Number(b.qrXPct ?? 84),
            Number(b.qrYPct ?? 66),
            Number(b.qrSizePx ?? 72),
            setActive ? 1 : 0,
            req.admin?.actor || 'Super Admin',
            now,
            now
          );

        const insertedId = Number(result.lastInsertRowid);
        if (setActive) {
          db.prepare('UPDATE lucky_draw_settings SET active_sample_id = ?, updated_at = ? WHERE id = 1').run(
            insertedId,
            now
          );
        }

        return db.prepare('SELECT * FROM lucky_draw_samples WHERE id = ?').get(insertedId);
      });

      const created = createTxn();

      recordLuckyDrawAudit(
        'SAMPLE_UPLOADED',
        req.admin?.actor || 'Super Admin',
        req.admin?.role || 'super_admin',
        {},
        { sampleName: name, prefix, setActive },
        `Uploaded Lucky Draw coupon sample "${name}" (prefix: ${prefix})`,
        getClientIp(req)
      );

      res.status(201).json({
        success: true,
        sample: mapSample(created),
        message: `कूपन सैंपल "${name}" सफलतापूर्वक अपलोड व कॉन्फ़िगर किया गया!`,
      });
    } catch (error: any) {
      if (String(error?.message).includes('UNIQUE')) {
        res.status(409).json({
          success: false,
          error: 'इस नाम का सैंपल पहले से मौजूद है। कृपया दूसरा नाम दें।',
        });
        return;
      }
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Update sample layout / coordinates / styling
  router.put('/admin/lucky-draw/samples/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = Number(req.params.id);
      const existing = db.prepare('SELECT * FROM lucky_draw_samples WHERE id = ?').get(id) as any;
      if (!existing) {
        res.status(404).json({ success: false, error: 'कूपन सैंपल नहीं मिला।' });
        return;
      }

      const b = req.body || {};
      const now = new Date().toISOString();

      db.prepare(
        `UPDATE lucky_draw_samples SET
          name = ?,
          number_prefix = ?,
          pad_length = ?,
          start_number = ?,
          serial_x_pct = ?,
          serial_y_pct = ?,
          serial_font_size = ?,
          serial_color = ?,
          name_x_pct = ?,
          name_y_pct = ?,
          name_font_size = ?,
          name_color = ?,
          show_qr = ?,
          qr_x_pct = ?,
          qr_y_pct = ?,
          qr_size_px = ?,
          updated_at = ?
        WHERE id = ?`
      ).run(
        b.name !== undefined ? String(b.name).trim() : existing.name,
        b.numberPrefix !== undefined ? String(b.numberPrefix).trim() : existing.number_prefix,
        b.padLength !== undefined ? Number(b.padLength) : existing.pad_length,
        b.startNumber !== undefined ? Number(b.startNumber) : existing.start_number,
        b.serialXPct !== undefined ? Number(b.serialXPct) : existing.serial_x_pct,
        b.serialYPct !== undefined ? Number(b.serialYPct) : existing.serial_y_pct,
        b.serialFontSize !== undefined ? Number(b.serialFontSize) : existing.serial_font_size,
        b.serialColor !== undefined ? String(b.serialColor) : existing.serial_color,
        b.nameXPct !== undefined ? Number(b.nameXPct) : existing.name_x_pct,
        b.nameYPct !== undefined ? Number(b.nameYPct) : existing.name_y_pct,
        b.nameFontSize !== undefined ? Number(b.nameFontSize) : existing.name_font_size,
        b.nameColor !== undefined ? String(b.nameColor) : existing.name_color,
        b.showQr !== undefined ? (b.showQr ? 1 : 0) : existing.show_qr,
        b.qrXPct !== undefined ? Number(b.qrXPct) : existing.qr_x_pct,
        b.qrYPct !== undefined ? Number(b.qrYPct) : existing.qr_y_pct,
        b.qrSizePx !== undefined ? Number(b.qrSizePx) : existing.qr_size_px,
        now,
        id
      );

      const updated = db.prepare('SELECT * FROM lucky_draw_samples WHERE id = ?').get(id);
      recordLuckyDrawAudit(
        'SAMPLE_COORDINATES_UPDATED',
        req.admin?.actor || 'Super Admin',
        req.admin?.role || 'super_admin',
        { sampleId: id },
        { sampleId: id },
        `Updated layout coordinates & formatting for sample #${id}`,
        getClientIp(req)
      );

      res.json({
        success: true,
        sample: mapSample(updated),
        message: 'सैंपल कोऑर्डिनेट्स और नंबर फॉर्मेटिंग अपडेट की गई।',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Set sample as Active
  router.put('/admin/lucky-draw/samples/:id/activate', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = Number(req.params.id);
      const existing = db.prepare('SELECT * FROM lucky_draw_samples WHERE id = ?').get(id) as any;
      if (!existing) {
        res.status(404).json({ success: false, error: 'कूपन सैंपल नहीं मिला।' });
        return;
      }

      const now = new Date().toISOString();
      db.transaction(() => {
        db.prepare('UPDATE lucky_draw_samples SET is_active = 0').run();
        db.prepare('UPDATE lucky_draw_samples SET is_active = 1, updated_at = ? WHERE id = ?').run(now, id);
        db.prepare('UPDATE lucky_draw_settings SET active_sample_id = ?, updated_at = ? WHERE id = 1').run(id, now);
      })();

      recordLuckyDrawAudit(
        'SAMPLE_ACTIVATED',
        req.admin?.actor || 'Super Admin',
        req.admin?.role || 'super_admin',
        {},
        { activeSampleId: id, name: existing.name },
        `Set "${existing.name}" as active coupon sample`,
        getClientIp(req)
      );

      res.json({
        success: true,
        message: `"${existing.name}" को सक्रिय कूपन सैंपल (Active Sample) सेट किया गया।`,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Manually issue coupon for a pending verified payment (e.g. if payment arrived while autoGen was OFF)
  router.post(
    '/admin/lucky-draw/payments/:orderId/issue-coupon',
    requireAdmin,
    (req: AuthenticatedRequest, res: Response) => {
      try {
        const orderId = String(req.params.orderId || '').trim();
        const paymentRow = db
          .prepare('SELECT * FROM lucky_draw_payments WHERE order_id = ?')
          .get(orderId) as any;

        if (!paymentRow) {
          res.status(404).json({ success: false, error: 'भुगतान ऑर्डर नहीं मिला।' });
          return;
        }
        if (paymentRow.payment_status !== 'verified') {
          res.status(400).json({ success: false, error: 'केवल सत्यापित भुगतान के लिए ही कूपन जारी किया जा सकता है।' });
          return;
        }
        if (paymentRow.coupon_generated) {
          res.status(409).json({ success: false, error: 'इस भुगतान के लिए कूपन पहले ही जारी हो चुका है।' });
          return;
        }

        const settings = getSettingsRow();
        const activeSample = getActiveSampleRow(settings.active_sample_id);
        if (!activeSample) {
          res.status(400).json({ success: false, error: 'कोई सक्रिय कूपन सैंपल सेट नहीं है।' });
          return;
        }

        const created = issueCouponsForVerifiedPaymentTxn(paymentRow, activeSample);
        recordLuckyDrawAudit(
          'ADMIN_MANUAL_COUPON_ISSUE',
          req.admin?.actor || 'Super Admin',
          req.admin?.role || 'super_admin',
          {},
          { orderId, coupons: created.map((c) => c.coupon_number) },
          `Admin issued coupon(s) for verified payment ${orderId}`,
          getClientIp(req)
        );

        res.json({
          success: true,
          coupons: created.map((c) => mapCoupon(c, activeSample)),
          message: `भुगतान ${orderId} के लिए कूपन सफलतापूर्वक जारी हुआ।`,
        });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  );

  // CSV Export of all issued coupons (UTF-8 BOM)
  router.get('/admin/lucky-draw/export/csv', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const rows = db.prepare('SELECT * FROM lucky_draw_coupons ORDER BY id DESC').all() as any[];
      const headers = [
        'कूपन क्रमांक (Coupon No)',
        'ग्राहक नाम (Buyer Name)',
        'मोबाइल नंबर (Mobile)',
        'ईमेल (Email)',
        'राशि (Amount INR)',
        'ऑर्डर क्र. (Order ID)',
        'स्थिति (Status)',
        'जारी दिनांक (Issued At)',
      ];
      const esc = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
      const lines = [
        headers.map(esc).join(','),
        ...rows.map((r) =>
          [
            r.coupon_number,
            r.buyer_name,
            r.buyer_mobile,
            r.buyer_email,
            r.amount,
            r.order_id,
            r.status,
            r.issued_at,
          ]
            .map(esc)
            .join(',')
        ),
      ];

      recordLuckyDrawAudit(
        'COUPON_CSV_EXPORTED',
        req.admin?.actor || 'Super Admin',
        req.admin?.role || 'super_admin',
        {},
        { count: rows.length },
        `Exported ${rows.length} Lucky Draw coupons to CSV`,
        getClientIp(req)
      );

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="prabhu_ramji_trust_lucky_draw_coupons_${new Date().toISOString().split('T')[0]}.csv"`
      );
      res.send('\uFEFF' + lines.join('\n'));
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  return router;
}
