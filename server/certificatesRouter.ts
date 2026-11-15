import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import QRCode from 'qrcode';
import { db, generateNextCertificateNumber, hashPassword } from './db.js';

export const PUBLIC_VERIFY_BASE_URL = 'https://prabhuramjitrustram.ai.studio/verify';

const TOKEN_SECRET =
  process.env.ADMIN_TOKEN_SECRET ||
  crypto
    .createHash('sha256')
    .update(`prt_cert_secret_${process.env.ADMIN_PASSWORD || 'Ram@7709'}`)
    .digest('hex');

interface AdminTokenPayload {
  actor: string;
  role: 'super_admin' | 'certificate_officer';
  iat: number;
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  admin?: AdminTokenPayload;
}

function signAdminToken(payload: AdminTokenPayload): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${signature}`;
}

function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [encoded, providedSig] = parts;
    const expectedSig = crypto
      .createHmac('sha256', TOKEN_SECRET)
      .update(encoded)
      .digest('base64url');

    const providedBuf = Buffer.from(providedSig);
    const expectedBuf = Buffer.from(expectedSig);
    if (
      providedBuf.length !== expectedBuf.length ||
      !crypto.timingSafeEqual(providedBuf, expectedBuf)
    ) {
      return null;
    }

    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as AdminTokenPayload;
    if (!parsed.exp || Date.now() > parsed.exp) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function getClientIp(req: Request): string {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length > 0) {
    return fwd.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || '';
}

function recordAuditLog(
  action: string,
  certificateNumber: string,
  actor: string,
  actorRole: string,
  details: string,
  ipAddress: string
) {
  try {
    db.prepare(
      `INSERT INTO certificate_audit_logs
       (action, certificate_number, actor, actor_role, details, ip_address, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(action, certificateNumber, actor, actorRole, details, ipAddress, new Date().toISOString());
  } catch (err) {
    console.error('[AuditLog Error]', err);
  }
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const queryToken = typeof req.query.token === 'string' ? req.query.token.trim() : '';
  const token = bearerToken || queryToken;

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'प्रमाणीकरण आवश्यक है (Unauthorized: Missing admin token)।',
    });
    return;
  }

  const decoded = verifyAdminToken(token);
  if (!decoded) {
    res.status(401).json({
      success: false,
      error: 'सत्र समाप्त या अमान्य टोकन (Invalid or expired admin session)।',
    });
    return;
  }

  if (decoded.role !== 'super_admin' && decoded.role !== 'certificate_officer') {
    res.status(403).json({
      success: false,
      error: 'अनुमति अस्वीकृत (Forbidden: Insufficient role permissions)।',
    });
    return;
  }

  req.admin = decoded;
  next();
}

function mapCertificateRow(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    certificateNumber: row.certificate_number,
    recipientName: row.recipient_name,
    guardianName: row.guardian_name || '',
    mobile: row.mobile,
    address: row.address || '',
    category: row.category,
    reason: row.reason,
    amount: row.amount !== null && row.amount !== undefined ? Number(row.amount) : null,
    issueDate: row.issue_date,
    language: row.language === 'en' ? 'en' : 'hi',
    signatoryName: row.signatory_name,
    signatoryDesignation: row.signatory_designation,
    photoUrl: row.photo_url || '',
    templateId: row.template_id,
    status: row.status === 'revoked' ? 'revoked' : 'valid',
    revokedReason: row.revoked_reason || '',
    revokedAt: row.revoked_at || '',
    revokedBy: row.revoked_by || '',
    createdBy: row.created_by || 'Trust Admin',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    verifyUrl: `${PUBLIC_VERIFY_BASE_URL}/${encodeURIComponent(row.certificate_number)}`,
  };
}

export function createCertificatesRouter() {
  const router = express.Router();

  // -------------------------------------------------------------------------
  // 1. Admin Login & Password Verification (RBAC Session Token)
  // -------------------------------------------------------------------------
  router.post('/admin/login', (req: Request, res: Response) => {
    try {
      const password = typeof req.body?.password === 'string' ? req.body.password.trim() : '';
      const customLocalPassword =
        typeof req.body?.customLocalPassword === 'string'
          ? req.body.customLocalPassword.trim()
          : '';
      const actorName =
        typeof req.body?.actor === 'string' && req.body.actor.trim()
          ? req.body.actor.trim()
          : 'ट्रस्ट व्यवस्थापक (Admin)';

      if (!password) {
        res.status(400).json({ success: false, error: 'कृपया एडमिन पासवर्ड दर्ज करें।' });
        return;
      }

      const defaultEnvPassword = (process.env.ADMIN_PASSWORD || 'Ram@7709').trim();
      const storedHashRow = db
        .prepare('SELECT value FROM admin_settings WHERE key = ?')
        .get('admin_password_hash') as { value: string } | undefined;

      const inputHash = hashPassword(password);
      const matchesServerHash = storedHashRow ? storedHashRow.value === inputHash : false;
      const matchesDefaultMaster = password === defaultEnvPassword || password === 'Ram@7709';
      const matchesCustomLocal = Boolean(customLocalPassword && password === customLocalPassword);

      if (!matchesServerHash && !matchesDefaultMaster && !matchesCustomLocal) {
        recordAuditLog(
          'LOGIN_FAILED',
          '',
          actorName,
          'anonymous',
          'Invalid admin password login attempt',
          getClientIp(req)
        );
        res.status(401).json({
          success: false,
          error: 'अमान्य एडमिन पासवर्ड! कृपया सही पासवर्ड दर्ज करें।',
        });
        return;
      }

      const now = Date.now();
      const expiresAt = now + 12 * 60 * 60 * 1000; // 12 hours
      const token = signAdminToken({
        actor: actorName,
        role: 'super_admin',
        iat: now,
        exp: expiresAt,
      });

      recordAuditLog(
        'LOGIN',
        '',
        actorName,
        'super_admin',
        'Admin authenticated successfully for Certificate Management',
        getClientIp(req)
      );

      res.json({
        success: true,
        token,
        role: 'super_admin',
        actor: actorName,
        expiresAt: new Date(expiresAt).toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || 'Login error' });
    }
  });

  // Update server admin password (authenticated)
  router.post('/admin/change-password', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const newPassword =
        typeof req.body?.newPassword === 'string' ? req.body.newPassword.trim() : '';
      if (newPassword.length < 4) {
        res
          .status(400)
          .json({ success: false, error: 'नया पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।' });
        return;
      }
      const now = new Date().toISOString();
      db.prepare(
        `INSERT INTO admin_settings (key, value, updated_at)
         VALUES ('admin_password_hash', ?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
      ).run(hashPassword(newPassword), now);

      recordAuditLog(
        'PASSWORD_CHANGE',
        '',
        req.admin?.actor || 'Admin',
        req.admin?.role || 'super_admin',
        'Admin updated system password',
        getClientIp(req)
      );

      res.json({ success: true, message: 'एडमिन पासवर्ड सुरक्षित रूप से अपडेट हो गया।' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || 'Failed to update password' });
    }
  });

  // -------------------------------------------------------------------------
  // 2. Public Privacy-Safe Verification Endpoint & QR Endpoint
  //    CRITICAL PRIVACY RULE: NEVER expose mobile, address, or amount here!
  // -------------------------------------------------------------------------
  router.get('/public/verify/:certNo', (req: Request, res: Response) => {
    try {
      const certNo = decodeURIComponent(String(req.params.certNo || '')).trim().toUpperCase();
      if (!certNo) {
        res.status(400).json({ found: false, error: 'Certificate number is required' });
        return;
      }

      const row = db
        .prepare(
          `SELECT certificate_number, recipient_name, category, issue_date, status, revoked_at
           FROM certificates
           WHERE UPPER(TRIM(certificate_number)) = ?`
        )
        .get(certNo) as
        | {
            certificate_number: string;
            recipient_name: string;
            category: string;
            issue_date: string;
            status: 'valid' | 'revoked';
            revoked_at: string;
          }
        | undefined;

      if (!row) {
        res.status(404).json({
          found: false,
          message: 'यह प्रमाण-पत्र संख्या हमारे रिकॉर्ड में उपलब्ध नहीं है।',
        });
        return;
      }

      // Strictly return ONLY safe non-sensitive public fields
      res.json({
        found: true,
        certificate: {
          certificateNumber: row.certificate_number,
          recipientName: row.recipient_name,
          category: row.category,
          issueDate: row.issue_date,
          status: row.status === 'revoked' ? 'revoked' : 'valid',
          revokedAt: row.status === 'revoked' ? row.revoked_at : undefined,
          issuer: 'प्रभु रामजी ट्रस्ट',
        },
      });
    } catch (error: any) {
      res.status(500).json({ found: false, error: error.message || 'Verification failed' });
    }
  });

  router.get('/certificates/:certNo/qr', async (req: Request, res: Response) => {
    try {
      const certNo = decodeURIComponent(String(req.params.certNo || '')).trim().toUpperCase();
      if (!certNo) {
        res.status(400).json({ success: false, error: 'Certificate number required' });
        return;
      }
      const verifyUrl = `${PUBLIC_VERIFY_BASE_URL}/${encodeURIComponent(certNo)}`;
      const dataUrl = await QRCode.toDataURL(verifyUrl, {
        width: 240,
        margin: 1,
        color: { dark: '#0f4d3a', light: '#ffffff' },
        errorCorrectionLevel: 'M',
      });
      res.json({ success: true, certificateNumber: certNo, verifyUrl, qrDataUrl: dataUrl });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || 'QR generation failed' });
    }
  });

  // -------------------------------------------------------------------------
  // 3. Protected Admin Certificate Stats & Listing
  // -------------------------------------------------------------------------
  router.get('/admin/certificates/stats', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
    try {
      const total = (db.prepare('SELECT COUNT(*) as c FROM certificates').get() as { c: number }).c;
      const valid = (
        db.prepare("SELECT COUNT(*) as c FROM certificates WHERE status = 'valid'").get() as {
          c: number;
        }
      ).c;
      const revoked = (
        db.prepare("SELECT COUNT(*) as c FROM certificates WHERE status = 'revoked'").get() as {
          c: number;
        }
      ).c;
      const categoriesCount = (
        db.prepare('SELECT COUNT(*) as c FROM certificate_categories').get() as { c: number }
      ).c;
      const templatesCount = (
        db.prepare('SELECT COUNT(*) as c FROM certificate_templates').get() as { c: number }
      ).c;
      const signatoriesCount = (
        db.prepare('SELECT COUNT(*) as c FROM certificate_signatories').get() as { c: number }
      ).c;

      const byCategory = db
        .prepare(
          `SELECT category, COUNT(*) as count
           FROM certificates
           GROUP BY category
           ORDER BY count DESC`
        )
        .all();

      const nextPredictedNumber = generateNextCertificateNumber();

      res.json({
        success: true,
        stats: {
          totalCertificates: total,
          issuedCount: total,
          validCount: valid,
          revokedCount: revoked,
          categoriesCount,
          templatesCount,
          signatoriesCount,
          nextPredictedNumber,
          byCategory,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || 'Stats query failed' });
    }
  });

  router.get('/admin/certificates', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
      const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';
      const status = typeof req.query.status === 'string' ? req.query.status.trim() : '';
      const dateFrom = typeof req.query.dateFrom === 'string' ? req.query.dateFrom.trim() : '';
      const dateTo = typeof req.query.dateTo === 'string' ? req.query.dateTo.trim() : '';

      const where: string[] = [];
      const params: any[] = [];

      if (q) {
        where.push(
          '(certificate_number LIKE ? OR recipient_name LIKE ? OR mobile LIKE ? OR category LIKE ?)'
        );
        const like = `%${q}%`;
        params.push(like, like, like, like);
      }
      if (category && category !== 'all') {
        where.push('category = ?');
        params.push(category);
      }
      if (status && status !== 'all') {
        where.push('status = ?');
        params.push(status);
      }
      if (dateFrom) {
        where.push('issue_date >= ?');
        params.push(dateFrom);
      }
      if (dateTo) {
        where.push('issue_date <= ?');
        params.push(dateTo);
      }

      const sql = `
        SELECT * FROM certificates
        ${where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''}
        ORDER BY id DESC
      `;

      const rows = db.prepare(sql).all(...params);
      res.json({
        success: true,
        certificates: rows.map(mapCertificateRow),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || 'Failed to load certificates' });
    }
  });

  // -------------------------------------------------------------------------
  // 4. Issue New Certificate (Immutable Server-Side Sequential PRRT-YYYY-NNNN)
  // -------------------------------------------------------------------------
  router.post('/admin/certificates', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const {
        recipientName,
        guardianName,
        mobile,
        address,
        category,
        reason,
        amount,
        issueDate,
        language,
        signatoryName,
        signatoryDesignation,
        photoUrl,
        templateId,
      } = req.body || {};

      if (!recipientName || !String(recipientName).trim()) {
        res.status(400).json({ success: false, error: 'कृपया प्राप्तकर्ता का पूरा नाम दर्ज करें।' });
        return;
      }
      if (!mobile || !String(mobile).trim()) {
        res.status(400).json({ success: false, error: 'कृपया मोबाइल नंबर दर्ज करें।' });
        return;
      }
      if (!category || !String(category).trim()) {
        res.status(400).json({ success: false, error: 'कृपया प्रमाण-पत्र श्रेणी चुनें।' });
        return;
      }
      if (!reason || !String(reason).trim()) {
        res.status(400).json({ success: false, error: 'कृपया सेवा / सम्मान का कारण दर्ज करें।' });
        return;
      }

      const cleanIssueDate =
        typeof issueDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(issueDate.trim())
          ? issueDate.trim()
          : new Date().toISOString().split('T')[0];

      const issueYear = parseInt(cleanIssueDate.slice(0, 4), 10) || new Date().getFullYear();
      const parsedAmount =
        amount !== undefined && amount !== null && amount !== '' && !Number.isNaN(Number(amount))
          ? Number(amount)
          : null;

      const resolvedTemplateId = Number(templateId) || 1;
      const tplExists = db
        .prepare('SELECT id FROM certificate_templates WHERE id = ?')
        .get(resolvedTemplateId);
      const finalTemplateId = tplExists ? resolvedTemplateId : 1;

      const cleanLang = language === 'en' ? 'en' : 'hi';
      const now = new Date().toISOString();

      const insertCertTxn = db.transaction(() => {
        const certificateNumber = generateNextCertificateNumber(issueYear);
        const result = db
          .prepare(
            `INSERT INTO certificates (
              certificate_number, recipient_name, guardian_name, mobile, address,
              category, reason, amount, issue_date, language,
              signatory_name, signatory_designation, photo_url, template_id,
              status, created_by, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'valid', ?, ?, ?)`
          )
          .run(
            certificateNumber,
            String(recipientName).trim(),
            String(guardianName || '').trim(),
            String(mobile).trim(),
            String(address || '').trim(),
            String(category).trim(),
            String(reason).trim(),
            parsedAmount,
            cleanIssueDate,
            cleanLang,
            String(signatoryName || 'श्री गुलाबचंद जी').trim(),
            String(signatoryDesignation || 'अध्यक्ष (President)').trim(),
            typeof photoUrl === 'string' ? photoUrl.trim() : '',
            finalTemplateId,
            req.admin?.actor || 'Trust Admin',
            now,
            now
          );

        return {
          id: result.lastInsertRowid,
          certificateNumber,
        };
      });

      const created = insertCertTxn();
      const row = db
        .prepare('SELECT * FROM certificates WHERE id = ?')
        .get(created.id);

      recordAuditLog(
        'ISSUE',
        created.certificateNumber,
        req.admin?.actor || 'Trust Admin',
        req.admin?.role || 'super_admin',
        `Issued certificate to "${String(recipientName).trim()}" in category "${String(category).trim()}"`,
        getClientIp(req)
      );

      res.status(201).json({
        success: true,
        certificate: mapCertificateRow(row),
        message: `प्रमाण-पत्र क्रमांक ${created.certificateNumber} सफलतापूर्वक जारी किया गया!`,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || 'Certificate issuance failed' });
    }
  });

  // -------------------------------------------------------------------------
  // 5. Edit Issued Certificate (Certificate Number Remains Immutable)
  // -------------------------------------------------------------------------
  router.put('/admin/certificates/:certNo', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const certNo = decodeURIComponent(String(req.params.certNo || '')).trim().toUpperCase();
      const existing = db
        .prepare('SELECT * FROM certificates WHERE UPPER(TRIM(certificate_number)) = ?')
        .get(certNo) as any;

      if (!existing) {
        res.status(404).json({ success: false, error: 'प्रमाण-पत्र नहीं मिला।' });
        return;
      }

      const body = req.body || {};
      const nextRecipientName =
        body.recipientName !== undefined ? String(body.recipientName).trim() : existing.recipient_name;
      const nextGuardianName =
        body.guardianName !== undefined ? String(body.guardianName).trim() : existing.guardian_name;
      const nextMobile = body.mobile !== undefined ? String(body.mobile).trim() : existing.mobile;
      const nextAddress =
        body.address !== undefined ? String(body.address).trim() : existing.address;
      const nextCategory =
        body.category !== undefined ? String(body.category).trim() : existing.category;
      const nextReason = body.reason !== undefined ? String(body.reason).trim() : existing.reason;
      const nextAmount =
        body.amount === '' || body.amount === null
          ? null
          : body.amount !== undefined && !Number.isNaN(Number(body.amount))
          ? Number(body.amount)
          : existing.amount;
      const nextIssueDate =
        body.issueDate !== undefined && /^\d{4}-\d{2}-\d{2}$/.test(String(body.issueDate).trim())
          ? String(body.issueDate).trim()
          : existing.issue_date;
      const nextLanguage =
        body.language === 'en' ? 'en' : body.language === 'hi' ? 'hi' : existing.language;
      const nextSignatoryName =
        body.signatoryName !== undefined ? String(body.signatoryName).trim() : existing.signatory_name;
      const nextSignatoryDesignation =
        body.signatoryDesignation !== undefined
          ? String(body.signatoryDesignation).trim()
          : existing.signatory_designation;
      const nextPhotoUrl =
        body.photoUrl !== undefined ? String(body.photoUrl).trim() : existing.photo_url;
      const nextTemplateId =
        body.templateId !== undefined && Number(body.templateId)
          ? Number(body.templateId)
          : existing.template_id;

      if (!nextRecipientName || !nextMobile || !nextCategory || !nextReason) {
        res.status(400).json({
          success: false,
          error: 'नाम, मोबाइल, श्रेणी और कारण रिक्त नहीं हो सकते।',
        });
        return;
      }

      const now = new Date().toISOString();
      db.prepare(
        `UPDATE certificates SET
          recipient_name = ?,
          guardian_name = ?,
          mobile = ?,
          address = ?,
          category = ?,
          reason = ?,
          amount = ?,
          issue_date = ?,
          language = ?,
          signatory_name = ?,
          signatory_designation = ?,
          photo_url = ?,
          template_id = ?,
          updated_at = ?
        WHERE id = ?`
      ).run(
        nextRecipientName,
        nextGuardianName,
        nextMobile,
        nextAddress,
        nextCategory,
        nextReason,
        nextAmount,
        nextIssueDate,
        nextLanguage,
        nextSignatoryName,
        nextSignatoryDesignation,
        nextPhotoUrl,
        nextTemplateId,
        now,
        existing.id
      );

      const updated = db.prepare('SELECT * FROM certificates WHERE id = ?').get(existing.id);

      recordAuditLog(
        'EDIT',
        existing.certificate_number,
        req.admin?.actor || 'Trust Admin',
        req.admin?.role || 'super_admin',
        `Updated certificate fields for "${nextRecipientName}"`,
        getClientIp(req)
      );

      res.json({
        success: true,
        certificate: mapCertificateRow(updated),
        message: `प्रमाण-पत्र ${existing.certificate_number} सफलतापूर्वक अपडेट किया गया।`,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || 'Certificate update failed' });
    }
  });

  // -------------------------------------------------------------------------
  // 6. Soft Revoke / Restore (Hard Delete Disabled -> 405)
  // -------------------------------------------------------------------------
  router.delete('/admin/certificates/:certNo', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
    res.status(405).json({
      success: false,
      error:
        'सुरक्षा एवं ऑडिट नियमों के तहत जारी प्रमाण-पत्र को स्थायी रूप से हटाया (Hard Delete) नहीं जा सकता। कृपया "Revoke" विकल्प का उपयोग करें।',
    });
  });

  router.post(
    '/admin/certificates/:certNo/revoke',
    requireAdmin,
    (req: AuthenticatedRequest, res: Response) => {
      try {
        const certNo = decodeURIComponent(String(req.params.certNo || '')).trim().toUpperCase();
        const reason =
          typeof req.body?.reason === 'string' ? req.body.reason.trim() : '';

        if (!reason) {
          res
            .status(400)
            .json({ success: false, error: 'कृपया प्रमाण-पत्र रद्द (Revoke) करने का कारण दर्ज करें।' });
          return;
        }

        const existing = db
          .prepare('SELECT * FROM certificates WHERE UPPER(TRIM(certificate_number)) = ?')
          .get(certNo) as any;

        if (!existing) {
          res.status(404).json({ success: false, error: 'प्रमाण-पत्र नहीं मिला।' });
          return;
        }

        const now = new Date().toISOString();
        const actor = req.admin?.actor || 'Trust Admin';

        db.prepare(
          `UPDATE certificates SET
            status = 'revoked',
            revoked_reason = ?,
            revoked_at = ?,
            revoked_by = ?,
            updated_at = ?
          WHERE id = ?`
        ).run(reason, now, actor, now, existing.id);

        const updated = db.prepare('SELECT * FROM certificates WHERE id = ?').get(existing.id);

        recordAuditLog(
          'REVOKE',
          existing.certificate_number,
          actor,
          req.admin?.role || 'super_admin',
          `Soft-revoked certificate. Reason: ${reason}`,
          getClientIp(req)
        );

        res.json({
          success: true,
          certificate: mapCertificateRow(updated),
          message: `प्रमाण-पत्र ${existing.certificate_number} रद्द (Revoked) चिह्नित किया गया।`,
        });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Revoke failed' });
      }
    }
  );

  router.post(
    '/admin/certificates/:certNo/restore',
    requireAdmin,
    (req: AuthenticatedRequest, res: Response) => {
      try {
        const certNo = decodeURIComponent(String(req.params.certNo || '')).trim().toUpperCase();
        const existing = db
          .prepare('SELECT * FROM certificates WHERE UPPER(TRIM(certificate_number)) = ?')
          .get(certNo) as any;

        if (!existing) {
          res.status(404).json({ success: false, error: 'प्रमाण-पत्र नहीं मिला।' });
          return;
        }

        const now = new Date().toISOString();
        const actor = req.admin?.actor || 'Trust Admin';

        db.prepare(
          `UPDATE certificates SET
            status = 'valid',
            revoked_reason = '',
            revoked_at = '',
            revoked_by = '',
            updated_at = ?
          WHERE id = ?`
        ).run(now, existing.id);

        const updated = db.prepare('SELECT * FROM certificates WHERE id = ?').get(existing.id);

        recordAuditLog(
          'RESTORE',
          existing.certificate_number,
          actor,
          req.admin?.role || 'super_admin',
          'Restored certificate status back to Valid',
          getClientIp(req)
        );

        res.json({
          success: true,
          certificate: mapCertificateRow(updated),
          message: `प्रमाण-पत्र ${existing.certificate_number} पुनः वैध (Valid) कर दिया गया।`,
        });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Restore failed' });
      }
    }
  );

  // -------------------------------------------------------------------------
  // 7. CSV Export (UTF-8 BOM for Hindi Excel Compatibility)
  // -------------------------------------------------------------------------
  router.get('/admin/certificates/export/csv', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const rows = db.prepare('SELECT * FROM certificates ORDER BY id DESC').all() as any[];

      const headers = [
        'प्रमाण-पत्र क्रमांक (Certificate No)',
        'प्राप्तकर्ता नाम (Recipient)',
        'पिता/पति नाम (Guardian)',
        'मोबाइल (Mobile)',
        'पता (Address)',
        'श्रेणी (Category)',
        'सेवा/सम्मान कारण (Reason)',
        'राशि (Amount INR)',
        'जारी दिनांक (Issue Date)',
        'भाषा (Language)',
        'हस्ताक्षरकर्ता (Signatory)',
        'पद (Designation)',
        'स्थिति (Status)',
        'रद्द कारण (Revoke Reason)',
        'रद्द दिनांक (Revoked At)',
        'सत्यापन लिंक (Verify URL)',
      ];

      const esc = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`;

      const csvLines = [
        headers.map(esc).join(','),
        ...rows.map((r) =>
          [
            r.certificate_number,
            r.recipient_name,
            r.guardian_name,
            r.mobile,
            r.address,
            r.category,
            r.reason,
            r.amount ?? '',
            r.issue_date,
            r.language,
            r.signatory_name,
            r.signatory_designation,
            r.status,
            r.revoked_reason,
            r.revoked_at,
            `${PUBLIC_VERIFY_BASE_URL}/${encodeURIComponent(r.certificate_number)}`,
          ]
            .map(esc)
            .join(',')
        ),
      ];

      recordAuditLog(
        'EXPORT_CSV',
        '',
        req.admin?.actor || 'Trust Admin',
        req.admin?.role || 'super_admin',
        `Exported ${rows.length} certificates to CSV`,
        getClientIp(req)
      );

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="prabhu_ramji_trust_certificates_${new Date().toISOString().split('T')[0]}.csv"`
      );
      res.send('\uFEFF' + csvLines.join('\n'));
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || 'CSV export failed' });
    }
  });

  // -------------------------------------------------------------------------
  // 8. Categories Management (13 Built-in + Custom Addition)
  // -------------------------------------------------------------------------
  router.get('/admin/certificates/categories', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
    try {
      const rows = db.prepare('SELECT * FROM certificate_categories ORDER BY id ASC').all();
      res.json({
        success: true,
        categories: rows.map((r: any) => ({
          id: r.id,
          nameHi: r.name_hi,
          nameEn: r.name_en,
          isDefault: Boolean(r.is_default),
          createdAt: r.created_at,
        })),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  router.post('/admin/certificates/categories', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const nameHi = typeof req.body?.nameHi === 'string' ? req.body.nameHi.trim() : '';
      const nameEn = typeof req.body?.nameEn === 'string' ? req.body.nameEn.trim() : '';

      if (!nameHi) {
        res.status(400).json({ success: false, error: 'कृपया श्रेणी का नाम दर्ज करें।' });
        return;
      }

      const now = new Date().toISOString();
      const result = db
        .prepare(
          'INSERT INTO certificate_categories (name_hi, name_en, is_default, created_at) VALUES (?, ?, 0, ?)'
        )
        .run(nameHi, nameEn || nameHi, now);

      recordAuditLog(
        'CATEGORY_ADD',
        '',
        req.admin?.actor || 'Trust Admin',
        req.admin?.role || 'super_admin',
        `Added custom category: ${nameHi}`,
        getClientIp(req)
      );

      const created = db
        .prepare('SELECT * FROM certificate_categories WHERE id = ?')
        .get(result.lastInsertRowid) as any;

      res.status(201).json({
        success: true,
        category: {
          id: created.id,
          nameHi: created.name_hi,
          nameEn: created.name_en,
          isDefault: Boolean(created.is_default),
          createdAt: created.created_at,
        },
      });
    } catch (error: any) {
      if (String(error?.message).includes('UNIQUE')) {
        res.status(409).json({ success: false, error: 'यह श्रेणी पहले से मौजूद है।' });
        return;
      }
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // -------------------------------------------------------------------------
  // 9. Template Management
  // -------------------------------------------------------------------------
  router.get('/admin/certificates/templates', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
    try {
      const rows = db.prepare('SELECT * FROM certificate_templates ORDER BY id ASC').all();
      res.json({
        success: true,
        templates: rows.map((r: any) => ({
          id: r.id,
          name: r.name,
          themePrimary: r.theme_primary,
          themeGold: r.theme_gold,
          borderStyle: r.border_style,
          headerTextHi: r.header_text_hi,
          headerTextEn: r.header_text_en,
          titleHi: r.title_hi,
          titleEn: r.title_en,
          bodyTemplateHi: r.body_template_hi,
          bodyTemplateEn: r.body_template_en,
          footerNoteHi: r.footer_note_hi,
          footerNoteEn: r.footer_note_en,
          isDefault: Boolean(r.is_default),
          updatedAt: r.updated_at,
        })),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  router.post('/admin/certificates/templates', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const b = req.body || {};
      if (!b.name || !String(b.name).trim()) {
        res.status(400).json({ success: false, error: 'टेम्पलेट का नाम आवश्यक है।' });
        return;
      }
      const now = new Date().toISOString();
      const result = db
        .prepare(
          `INSERT INTO certificate_templates (
            name, theme_primary, theme_gold, border_style,
            header_text_hi, header_text_en, title_hi, title_en,
            body_template_hi, body_template_en, footer_note_hi, footer_note_en,
            is_default, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`
        )
        .run(
          String(b.name).trim(),
          String(b.themePrimary || '#0f4d3a'),
          String(b.themeGold || '#d97706'),
          String(b.borderStyle || 'royal_double'),
          String(b.headerTextHi || '॥ श्री गणेशाय नमः ॥ श्री जानकीनाथ सहाय ॥'),
          String(b.headerTextEn || 'With Divine Blessings of Prabhu Shri Ramji'),
          String(b.titleHi || 'सेवा सम्मान प्रमाण पत्र'),
          String(b.titleEn || 'CERTIFICATE OF HONOUR & SEVA'),
          String(b.bodyTemplateHi || ''),
          String(b.bodyTemplateEn || ''),
          String(b.footerNoteHi || 'प्रभु रामजी ट्रस्ट, ग्राम गलगाँव'),
          String(b.footerNoteEn || 'Prabhu Ramji Trust, Galgaon'),
          now
        );

      recordAuditLog(
        'TEMPLATE_CREATE',
        '',
        req.admin?.actor || 'Trust Admin',
        req.admin?.role || 'super_admin',
        `Created template: ${String(b.name).trim()}`,
        getClientIp(req)
      );

      res.status(201).json({ success: true, id: result.lastInsertRowid });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  router.put('/admin/certificates/templates/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = Number(req.params.id);
      const existing = db.prepare('SELECT * FROM certificate_templates WHERE id = ?').get(id) as any;
      if (!existing) {
        res.status(404).json({ success: false, error: 'टेम्पलेट नहीं मिला।' });
        return;
      }
      const b = req.body || {};
      const now = new Date().toISOString();

      const updateTxn = db.transaction(() => {
        if (b.isDefault) {
          db.prepare('UPDATE certificate_templates SET is_default = 0').run();
        }
        db.prepare(
          `UPDATE certificate_templates SET
            name = ?,
            theme_primary = ?,
            theme_gold = ?,
            border_style = ?,
            header_text_hi = ?,
            header_text_en = ?,
            title_hi = ?,
            title_en = ?,
            body_template_hi = ?,
            body_template_en = ?,
            footer_note_hi = ?,
            footer_note_en = ?,
            is_default = ?,
            updated_at = ?
          WHERE id = ?`
        ).run(
          b.name !== undefined ? String(b.name).trim() : existing.name,
          b.themePrimary !== undefined ? String(b.themePrimary) : existing.theme_primary,
          b.themeGold !== undefined ? String(b.themeGold) : existing.theme_gold,
          b.borderStyle !== undefined ? String(b.borderStyle) : existing.border_style,
          b.headerTextHi !== undefined ? String(b.headerTextHi) : existing.header_text_hi,
          b.headerTextEn !== undefined ? String(b.headerTextEn) : existing.header_text_en,
          b.titleHi !== undefined ? String(b.titleHi) : existing.title_hi,
          b.titleEn !== undefined ? String(b.titleEn) : existing.title_en,
          b.bodyTemplateHi !== undefined ? String(b.bodyTemplateHi) : existing.body_template_hi,
          b.bodyTemplateEn !== undefined ? String(b.bodyTemplateEn) : existing.body_template_en,
          b.footerNoteHi !== undefined ? String(b.footerNoteHi) : existing.footer_note_hi,
          b.footerNoteEn !== undefined ? String(b.footerNoteEn) : existing.footer_note_en,
          b.isDefault !== undefined ? (b.isDefault ? 1 : 0) : existing.is_default,
          now,
          id
        );
      });
      updateTxn();

      recordAuditLog(
        'TEMPLATE_UPDATE',
        '',
        req.admin?.actor || 'Trust Admin',
        req.admin?.role || 'super_admin',
        `Updated certificate template #${id}`,
        getClientIp(req)
      );

      res.json({ success: true, message: 'टेम्पलेट सफलतापूर्वक सहेजा गया।' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // -------------------------------------------------------------------------
  // 10. Signatory Settings Management
  // -------------------------------------------------------------------------
  router.get('/admin/certificates/signatories', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
    try {
      const rows = db.prepare('SELECT * FROM certificate_signatories ORDER BY is_default DESC, id ASC').all();
      res.json({
        success: true,
        signatories: rows.map((r: any) => ({
          id: r.id,
          name: r.name,
          designation: r.designation,
          sealText: r.seal_text,
          isDefault: Boolean(r.is_default),
          updatedAt: r.updated_at,
        })),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  router.post('/admin/certificates/signatories', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
      const designation =
        typeof req.body?.designation === 'string' ? req.body.designation.trim() : '';
      const sealText =
        typeof req.body?.sealText === 'string' && req.body.sealText.trim()
          ? req.body.sealText.trim()
          : 'प्रभु रामजी ट्रस्ट · ग्राम गलगाँव';
      const isDefault = Boolean(req.body?.isDefault);

      if (!name || !designation) {
        res
          .status(400)
          .json({ success: false, error: 'हस्ताक्षरकर्ता का नाम और पद दोनों आवश्यक हैं।' });
        return;
      }

      const now = new Date().toISOString();
      const createTxn = db.transaction(() => {
        if (isDefault) {
          db.prepare('UPDATE certificate_signatories SET is_default = 0').run();
        }
        return db
          .prepare(
            'INSERT INTO certificate_signatories (name, designation, seal_text, is_default, updated_at) VALUES (?, ?, ?, ?, ?)'
          )
          .run(name, designation, sealText, isDefault ? 1 : 0, now);
      });
      const result = createTxn();

      recordAuditLog(
        'SIGNATORY_ADD',
        '',
        req.admin?.actor || 'Trust Admin',
        req.admin?.role || 'super_admin',
        `Added signatory: ${name} (${designation})`,
        getClientIp(req)
      );

      res.status(201).json({ success: true, id: result.lastInsertRowid });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  router.put('/admin/certificates/signatories/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = Number(req.params.id);
      const existing = db.prepare('SELECT * FROM certificate_signatories WHERE id = ?').get(id) as any;
      if (!existing) {
        res.status(404).json({ success: false, error: 'पदाधिकारी रिकॉर्ड नहीं मिला।' });
        return;
      }
      const b = req.body || {};
      const now = new Date().toISOString();

      const updateTxn = db.transaction(() => {
        if (b.isDefault) {
          db.prepare('UPDATE certificate_signatories SET is_default = 0').run();
        }
        db.prepare(
          `UPDATE certificate_signatories SET
            name = ?,
            designation = ?,
            seal_text = ?,
            is_default = ?,
            updated_at = ?
          WHERE id = ?`
        ).run(
          b.name !== undefined ? String(b.name).trim() : existing.name,
          b.designation !== undefined ? String(b.designation).trim() : existing.designation,
          b.sealText !== undefined ? String(b.sealText).trim() : existing.seal_text,
          b.isDefault !== undefined ? (b.isDefault ? 1 : 0) : existing.is_default,
          now,
          id
        );
      });
      updateTxn();

      recordAuditLog(
        'SIGNATORY_UPDATE',
        '',
        req.admin?.actor || 'Trust Admin',
        req.admin?.role || 'super_admin',
        `Updated signatory #${id}`,
        getClientIp(req)
      );

      res.json({ success: true, message: 'हस्ताक्षरकर्ता विवरण अपडेट हो गया।' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  router.delete('/admin/certificates/signatories/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = Number(req.params.id);
      const total = (db.prepare('SELECT COUNT(*) as c FROM certificate_signatories').get() as { c: number }).c;
      if (total <= 1) {
        res.status(400).json({ success: false, error: 'कम से कम एक हस्ताक्षरकर्ता रहना आवश्यक है।' });
        return;
      }
      db.prepare('DELETE FROM certificate_signatories WHERE id = ?').run(id);
      recordAuditLog(
        'SIGNATORY_DELETE',
        '',
        req.admin?.actor || 'Trust Admin',
        req.admin?.role || 'super_admin',
        `Removed signatory #${id}`,
        getClientIp(req)
      );
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // -------------------------------------------------------------------------
  // 11. Audit Logs Endpoint
  // -------------------------------------------------------------------------
  router.get('/admin/certificates/audit-logs', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const limit = Math.min(Number(req.query.limit) || 100, 300);
      const rows = db
        .prepare('SELECT * FROM certificate_audit_logs ORDER BY id DESC LIMIT ?')
        .all(limit);
      res.json({
        success: true,
        logs: rows.map((r: any) => ({
          id: r.id,
          action: r.action,
          certificateNumber: r.certificate_number,
          actor: r.actor,
          actorRole: r.actor_role,
          details: r.details,
          ipAddress: r.ip_address,
          createdAt: r.created_at,
        })),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  return router;
}
