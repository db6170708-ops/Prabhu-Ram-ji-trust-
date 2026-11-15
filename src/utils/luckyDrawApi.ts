import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { getStoredAdminToken, PUBLIC_VERIFY_DOMAIN } from './certificateApi';
import {
  LuckyDrawCoupon,
  LuckyDrawDashboardData,
  LuckyDrawReadiness,
  LuckyDrawSample,
  LuckyDrawSettings,
  PublicLuckyDrawStatus,
  PublicVerifiedCoupon,
} from '../types/luckyDraw';

async function ldRequest<T>(
  url: string,
  options: RequestInit = {},
  requiresAuth = true
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (requiresAuth) {
    const token = getStoredAdminToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) {
    const errMsg =
      typeof data === 'object' && data && 'error' in data
        ? String((data as any).error)
        : `HTTP ${res.status}`;
    const err = new Error(errMsg) as Error & { missing?: Array<{ code: string; label: string }> };
    if (typeof data === 'object' && data && Array.isArray((data as any).missing)) {
      err.missing = (data as any).missing;
    }
    throw err;
  }

  return data as T;
}

export const LuckyDrawApi = {
  // Public Endpoints
  async getPublicStatus(): Promise<PublicLuckyDrawStatus> {
    const data = await ldRequest<{ success: boolean; status: PublicLuckyDrawStatus }>(
      '/api/public/lucky-draw/status',
      {},
      false
    );
    return data.status;
  },

  async createOrder(payload: {
    buyerName: string;
    buyerMobile: string;
    buyerEmail?: string;
    quantity: number;
  }): Promise<{
    order: {
      orderId: string;
      amount: number;
      quantity: number;
      ticketPrice: number;
      gatewayMode: 'test' | 'live';
      provider: string;
      verificationToken: string;
    };
  }> {
    return ldRequest(
      '/api/public/lucky-draw/create-order',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      false
    );
  },

  async verifyPayment(payload: {
    orderId: string;
    paymentRef: string;
    verificationToken: string;
  }): Promise<{
    success: boolean;
    paymentVerified: boolean;
    couponGenerated: boolean;
    coupons: LuckyDrawCoupon[];
    message: string;
  }> {
    return ldRequest(
      '/api/public/lucky-draw/verify-payment',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      false
    );
  },

  async verifyCouponPublic(couponNumber: string): Promise<{
    found: boolean;
    coupon?: PublicVerifiedCoupon;
    message?: string;
  }> {
    const res = await fetch(
      `/api/public/lucky-draw/verify/${encodeURIComponent(couponNumber.trim().toUpperCase())}`
    );
    const data = await res.json();
    if (!res.ok) {
      return {
        found: false,
        message: data?.message || 'यह कूपन संख्या हमारे रिकॉर्ड में उपलब्ध नहीं है।',
      };
    }
    return {
      found: true,
      coupon: data.coupon,
    };
  },

  // Protected Super Admin Endpoints
  async getDashboard(): Promise<LuckyDrawDashboardData> {
    return ldRequest<LuckyDrawDashboardData>('/api/admin/lucky-draw/dashboard');
  },

  async updateCompliance(payload: {
    ticketPrice?: number;
    campaignTitle?: string;
    campaignSubtitle?: string;
    paymentGatewayMode?: 'test' | 'live';
    paymentProvider?: string;
    kycVerified?: boolean;
    legalPermissionVerified?: boolean;
    webhookVerified?: boolean;
    webhookSecret?: string;
    bankVerified?: boolean;
  }): Promise<{
    success: boolean;
    settings: LuckyDrawSettings;
    readiness: LuckyDrawReadiness;
    message: string;
  }> {
    return ldRequest('/api/admin/lucky-draw/compliance', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async activateLiveSystem(confirmLiveActivation: boolean): Promise<{
    success: boolean;
    settings: LuckyDrawSettings;
    message: string;
  }> {
    return ldRequest('/api/admin/lucky-draw/activate', {
      method: 'POST',
      body: JSON.stringify({ confirmLiveActivation }),
    });
  },

  async updateControls(payload: {
    masterEnabled?: boolean;
    homepageVisibility?: boolean;
    bookingEnabled?: boolean;
    autoCouponGeneration?: boolean;
  }): Promise<{
    success: boolean;
    settings: LuckyDrawSettings;
    message: string;
  }> {
    return ldRequest('/api/admin/lucky-draw/controls', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async uploadSample(payload: {
    name: string;
    sampleFileType: 'image' | 'pdf';
    sampleDataUrl: string;
    widthPx: number;
    heightPx: number;
    numberPrefix: string;
    padLength: number;
    startNumber: number;
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
    setActive?: boolean;
  }): Promise<{ success: boolean; sample: LuckyDrawSample; message: string }> {
    return ldRequest('/api/admin/lucky-draw/samples', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateSample(
    id: number,
    payload: Partial<{
      name: string;
      numberPrefix: string;
      padLength: number;
      startNumber: number;
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
    }>
  ): Promise<{ success: boolean; sample: LuckyDrawSample; message: string }> {
    return ldRequest(`/api/admin/lucky-draw/samples/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async activateSample(id: number): Promise<{ success: boolean; message: string }> {
    return ldRequest(`/api/admin/lucky-draw/samples/${id}/activate`, {
      method: 'PUT',
      body: JSON.stringify({}),
    });
  },

  async issueCouponForPayment(orderId: string): Promise<{
    success: boolean;
    coupons: LuckyDrawCoupon[];
    message: string;
  }> {
    return ldRequest(`/api/admin/lucky-draw/payments/${encodeURIComponent(orderId)}/issue-coupon`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },

  async downloadCouponsCsv(): Promise<void> {
    const token = getStoredAdminToken();
    const res = await fetch('/api/admin/lucky-draw/export/csv', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new Error('CSV डाउनलोड करने में त्रुटि हुई।');
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `prabhu_ramji_trust_lucky_draw_coupons_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};

export function getCouponVerifyUrl(couponNumber: string): string {
  return `${PUBLIC_VERIFY_DOMAIN}/verify-coupon/${encodeURIComponent(couponNumber)}`;
}

export async function exportCouponDomToPng(
  element: HTMLElement,
  fileName: string
): Promise<void> {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }
  const dataUrl = await toPng(element, {
    quality: 1.0,
    pixelRatio: 2.5,
    backgroundColor: '#FFFFFF',
    cacheBust: true,
  });
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function exportCouponDomToPdf(
  element: HTMLElement,
  fileName: string,
  widthPx = 1000,
  heightPx = 420
): Promise<void> {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }
  const dataUrl = await toPng(element, {
    quality: 1.0,
    pixelRatio: 2.5,
    backgroundColor: '#FFFFFF',
    cacheBust: true,
  });

  const orientation = widthPx >= heightPx ? 'landscape' : 'portrait';
  const pdfW = orientation === 'landscape' ? 210 : 148;
  const pdfH = Math.max(70, Math.round((pdfW * heightPx) / Math.max(widthPx, 1)));

  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: [pdfW, pdfH],
    compress: true,
  });

  pdf.addImage(dataUrl, 'PNG', 0, 0, pdfW, pdfH, undefined, 'FAST');
  pdf.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);
}

// Helper to synthesize a crisp default sample coupon PNG artwork on canvas if Admin wants one immediately
export function generateStarterCouponArtworkDataUrl(title = 'प्रभु रामजी ट्रस्ट · सेवा लकी ड्रॉ कूपन 2026'): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1100;
  canvas.height = 460;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Warm parchment background
  const grad = ctx.createLinearGradient(0, 0, 1100, 460);
  grad.addColorStop(0, '#FFFDF7');
  grad.addColorStop(0.5, '#FFF7DF');
  grad.addColorStop(1, '#FDECC8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1100, 460);

  // Sacred Emerald Left Stub & Outer Frame
  ctx.strokeStyle = '#0f4d3a';
  ctx.lineWidth = 10;
  ctx.strokeRect(14, 14, 1072, 432);

  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 3;
  ctx.strokeRect(28, 28, 1044, 404);

  // Left emerald strip
  ctx.fillStyle = '#0f4d3a';
  ctx.fillRect(28, 28, 210, 404);

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('प्रभु रामजी ट्रस्ट', 133, 120);
  ctx.fillStyle = '#ecfdf5';
  ctx.font = '15px sans-serif';
  ctx.fillText('ग्राम गलगाँव, सनावद', 133, 152);
  ctx.fillText('जिला खरगोन (म.प्र.)', 133, 176);

  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(68, 220, 130, 56);
  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 28px monospace';
  ctx.fillText('₹200/-', 133, 258);

  ctx.fillStyle = '#d1fae5';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('आधिकारिक सेवा कूपन', 133, 330);

  // Tear line
  ctx.setLineDash([8, 8]);
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(255, 36);
  ctx.lineTo(255, 424);
  ctx.stroke();
  ctx.setLineDash([]);

  // Main body header
  ctx.textAlign = 'left';
  ctx.fillStyle = '#0f4d3a';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText(title, 285, 86);

  ctx.fillStyle = '#92400e';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('॥ श्री जानकीनाथ सहाय · आश्रम, गौशाला एवं नर्मदा सेवा सहायतार्थ ॥', 285, 118);

  // Placeholder slots labels (actual values get overlaid dynamically by engine!)
  ctx.fillStyle = '#78716c';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('अद्वितीय कूपन क्रमांक (COUPON NO.):', 715, 76);

  ctx.strokeStyle = '#0f4d3a';
  ctx.lineWidth = 2;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(715, 90, 325, 62);
  ctx.strokeRect(715, 90, 325, 62);

  ctx.fillStyle = '#57534e';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('श्रद्धालु का नाम (DEVOTEE NAME):', 285, 222);

  ctx.beginPath();
  ctx.moveTo(285, 280);
  ctx.lineTo(790, 280);
  ctx.strokeStyle = '#d6d3d1';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#57534e';
  ctx.font = '14px sans-serif';
  ctx.fillText('ऑनलाइन सत्यापन: https://prabhuramjitrustram.ai.studio/', 285, 388);
  ctx.fillStyle = '#065f46';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('अधिकृत डिजिटल मुहर · प्रभु रामजी ट्रस्ट', 285, 412);

  return canvas.toDataURL('image/png', 0.95);
}
