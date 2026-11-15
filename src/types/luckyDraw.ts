export interface LuckyDrawSettings {
  masterEnabled: boolean;
  homepageVisibility: boolean;
  bookingEnabled: boolean;
  autoCouponGeneration: boolean;
  ticketPrice: number;
  campaignTitle: string;
  campaignSubtitle: string;
  paymentGatewayMode: 'test' | 'live';
  paymentProvider: string;
  kycVerified: boolean;
  legalPermissionVerified: boolean;
  webhookVerified: boolean;
  hasWebhookSecret: boolean;
  webhookSecretMasked: string;
  bankVerified: boolean;
  activeSampleId: number | null;
  activatedAt: string;
  activatedBy: string;
  updatedAt: string;
}

export interface LuckyDrawSample {
  id: number;
  name: string;
  sampleFileType: 'image' | 'pdf';
  sampleDataUrl: string;
  widthPx: number;
  heightPx: number;
  numberPrefix: string;
  padLength: number;
  startNumber: number;
  nextPreviewNumber: string;
  serialXPct: number;
  serialYPct: number;
  serialFontSize: number;
  serialColor: string;
  nameXPct: number;
  nameYPct: number;
  nameFontSize: number;
  nameColor: string;
  showQr: boolean;
  qrXPct: number;
  qrYPct: number;
  qrSizePx: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LuckyDrawCoupon {
  id: number;
  couponNumber: string;
  serialSeq: number;
  sampleId: number;
  numberPrefix: string;
  paymentId: number;
  orderId: string;
  buyerName: string;
  buyerMobile: string;
  buyerEmail: string;
  amount: number;
  status: 'valid' | 'cancelled';
  issuedAt: string;
  verifyUrl: string;
  sample?: LuckyDrawSample;
}

export interface LuckyDrawPayment {
  id: number;
  order_id: string;
  payment_ref: string;
  buyer_name: string;
  buyer_mobile: string;
  buyer_email: string;
  quantity: number;
  amount: number;
  gateway_mode: string;
  payment_status: 'pending' | 'verified' | 'failed';
  webhook_verified: number;
  webhook_signature: string;
  coupon_generated: number;
  notes: string;
  created_at: string;
  verified_at: string;
}

export interface LuckyDrawAuditLog {
  id: number;
  action: string;
  actor: string;
  actor_role: string;
  previous_state: string;
  new_state: string;
  details: string;
  ip_address: string;
  created_at: string;
}

export interface LuckyDrawReadiness {
  ready: boolean;
  missing: Array<{ code: string; label: string }>;
}

export interface LuckyDrawStats {
  systemStatus: 'ON' | 'OFF';
  activeSampleStatus: 'Uploaded' | 'Not Set';
  homepageStatus: 'Visible' | 'Hidden';
  bookingStatus: 'Enabled' | 'Disabled';
  paymentGateway: 'Live' | 'Test';
  couponGeneration: 'Enabled' | 'Disabled';
  totalCouponsGenerated: number;
  totalSuccessfulPayments: number;
  totalCollectedAmount: number;
}

export interface LuckyDrawDashboardData {
  success: boolean;
  settings: LuckyDrawSettings;
  activeSample: LuckyDrawSample | null;
  readiness: LuckyDrawReadiness;
  stats: LuckyDrawStats;
  samples: LuckyDrawSample[];
  coupons: LuckyDrawCoupon[];
  payments: LuckyDrawPayment[];
  auditLogs: LuckyDrawAuditLog[];
}

export interface PublicLuckyDrawStatus {
  systemEnabled: boolean;
  homepageVisible: boolean;
  bookingOpen: boolean;
  autoCouponGeneration: boolean;
  ticketPrice: number;
  campaignTitle: string;
  campaignSubtitle: string;
  gatewayMode: 'test' | 'live';
  hasActiveSample: boolean;
}

export interface PublicVerifiedCoupon {
  couponNumber: string;
  buyerName: string;
  maskedMobile: string;
  amount: number;
  status: 'valid' | 'cancelled';
  issuedAt: string;
  issuer: string;
  sample?: LuckyDrawSample;
}
