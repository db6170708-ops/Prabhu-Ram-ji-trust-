import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import {
  CertificateAuditLog,
  CertificateCategory,
  CertificateSignatory,
  CertificateStats,
  CertificateTemplate,
  DigitalCertificate,
  PublicVerifiedCertificate,
} from '../types/certificates';

const TOKEN_KEY = 'prt_admin_jwt';
export const PUBLIC_VERIFY_DOMAIN = 'https://prabhuramjitrustram.ai.studio';

export function getStoredAdminToken(): string {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function setStoredAdminToken(token: string) {
  try {
    if (token) {
      sessionStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // ignore storage restriction
  }
}

async function apiRequest<T>(
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
    throw new Error(errMsg);
  }

  return data as T;
}

export const CertificateApi = {
  async adminLogin(password: string, customLocalPassword?: string): Promise<{ token: string; role: string }> {
    const data = await apiRequest<{ success: boolean; token: string; role: string }>(
      '/api/admin/login',
      {
        method: 'POST',
        body: JSON.stringify({ password, customLocalPassword }),
      },
      false
    );
    setStoredAdminToken(data.token);
    return { token: data.token, role: data.role };
  },

  async changeAdminPassword(newPassword: string): Promise<void> {
    await apiRequest('/api/admin/change-password', {
      method: 'POST',
      body: JSON.stringify({ newPassword }),
    });
  },

  async getStats(): Promise<CertificateStats> {
    const data = await apiRequest<{ success: boolean; stats: CertificateStats }>(
      '/api/admin/certificates/stats'
    );
    return data.stats;
  },

  async listCertificates(params?: {
    q?: string;
    category?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<DigitalCertificate[]> {
    const searchParams = new URLSearchParams();
    if (params?.q) searchParams.set('q', params.q);
    if (params?.category && params.category !== 'all') searchParams.set('category', params.category);
    if (params?.status && params.status !== 'all') searchParams.set('status', params.status);
    if (params?.dateFrom) searchParams.set('dateFrom', params.dateFrom);
    if (params?.dateTo) searchParams.set('dateTo', params.dateTo);
    const qs = searchParams.toString();
    const data = await apiRequest<{ success: boolean; certificates: DigitalCertificate[] }>(
      `/api/admin/certificates${qs ? `?${qs}` : ''}`
    );
    return data.certificates;
  },

  async issueCertificate(payload: {
    recipientName: string;
    guardianName?: string;
    mobile: string;
    address?: string;
    category: string;
    reason: string;
    amount?: number | null;
    issueDate: string;
    language: 'hi' | 'en';
    signatoryName: string;
    signatoryDesignation: string;
    photoUrl?: string;
    templateId?: number;
  }): Promise<{ certificate: DigitalCertificate; message: string }> {
    return apiRequest('/api/admin/certificates', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateCertificate(
    certNo: string,
    payload: Partial<{
      recipientName: string;
      guardianName: string;
      mobile: string;
      address: string;
      category: string;
      reason: string;
      amount: number | null;
      issueDate: string;
      language: 'hi' | 'en';
      signatoryName: string;
      signatoryDesignation: string;
      photoUrl: string;
      templateId: number;
    }>
  ): Promise<{ certificate: DigitalCertificate; message: string }> {
    return apiRequest(`/api/admin/certificates/${encodeURIComponent(certNo)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async revokeCertificate(certNo: string, reason: string): Promise<{ certificate: DigitalCertificate; message: string }> {
    return apiRequest(`/api/admin/certificates/${encodeURIComponent(certNo)}/revoke`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  async restoreCertificate(certNo: string): Promise<{ certificate: DigitalCertificate; message: string }> {
    return apiRequest(`/api/admin/certificates/${encodeURIComponent(certNo)}/restore`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },

  async getCategories(): Promise<CertificateCategory[]> {
    const data = await apiRequest<{ success: boolean; categories: CertificateCategory[] }>(
      '/api/admin/certificates/categories'
    );
    return data.categories;
  },

  async addCategory(nameHi: string, nameEn?: string): Promise<CertificateCategory> {
    const data = await apiRequest<{ success: boolean; category: CertificateCategory }>(
      '/api/admin/certificates/categories',
      {
        method: 'POST',
        body: JSON.stringify({ nameHi, nameEn }),
      }
    );
    return data.category;
  },

  async getTemplates(): Promise<CertificateTemplate[]> {
    const data = await apiRequest<{ success: boolean; templates: CertificateTemplate[] }>(
      '/api/admin/certificates/templates'
    );
    return data.templates;
  },

  async createTemplate(payload: Partial<CertificateTemplate>): Promise<void> {
    await apiRequest('/api/admin/certificates/templates', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateTemplate(id: number, payload: Partial<CertificateTemplate>): Promise<void> {
    await apiRequest(`/api/admin/certificates/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async getSignatories(): Promise<CertificateSignatory[]> {
    const data = await apiRequest<{ success: boolean; signatories: CertificateSignatory[] }>(
      '/api/admin/certificates/signatories'
    );
    return data.signatories;
  },

  async addSignatory(payload: {
    name: string;
    designation: string;
    sealText?: string;
    isDefault?: boolean;
  }): Promise<void> {
    await apiRequest('/api/admin/certificates/signatories', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateSignatory(id: number, payload: Partial<CertificateSignatory>): Promise<void> {
    await apiRequest(`/api/admin/certificates/signatories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteSignatory(id: number): Promise<void> {
    await apiRequest(`/api/admin/certificates/signatories/${id}`, {
      method: 'DELETE',
    });
  },

  async getAuditLogs(limit = 100): Promise<CertificateAuditLog[]> {
    const data = await apiRequest<{ success: boolean; logs: CertificateAuditLog[] }>(
      `/api/admin/certificates/audit-logs?limit=${limit}`
    );
    return data.logs;
  },

  async downloadCsv(): Promise<void> {
    const token = getStoredAdminToken();
    const res = await fetch('/api/admin/certificates/export/csv', {
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
      `prabhu_ramji_trust_certificates_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  async publicVerify(certNo: string): Promise<{
    found: boolean;
    certificate?: PublicVerifiedCertificate;
    message?: string;
  }> {
    const res = await fetch(`/api/public/verify/${encodeURIComponent(certNo.trim())}`);
    const data = await res.json();
    if (!res.ok) {
      return {
        found: false,
        message: data?.message || 'यह प्रमाण-पत्र संख्या मान्य रिकॉर्ड में नहीं मिली।',
      };
    }
    return {
      found: true,
      certificate: data.certificate,
    };
  },
};

export function getCertificateVerifyUrl(certNo: string): string {
  return `${PUBLIC_VERIFY_DOMAIN}/verify/${encodeURIComponent(certNo)}`;
}

export function getCertificateDownloadLinkUrl(certNo: string): string {
  return `${PUBLIC_VERIFY_DOMAIN}/verify/${encodeURIComponent(certNo)}?download=1`;
}

export function buildWhatsAppShareMessage(cert: {
  certificateNumber: string;
  recipientName?: string;
}): string {
  const verifyLink = getCertificateVerifyUrl(cert.certificateNumber);
  const downloadLink = getCertificateDownloadLinkUrl(cert.certificateNumber);
  return (
    `प्रभु श्री रामजी ट्रस्ट की ओर से आपको सम्मान प्रमाण पत्र प्रदान किया जाता है। ` +
    `समाज एवं सेवा के प्रति आपके सहयोग के लिए हार्दिक धन्यवाद। जय श्री राम।\n\n` +
    `प्रमाण-पत्र क्रमांक: ${cert.certificateNumber}\n` +
    `Download Link: ${downloadLink}\n` +
    `Verify Link: ${verifyLink}`
  );
}

export function buildWhatsAppShareUrl(mobile: string, message: string): string {
  const cleanDigits = mobile.replace(/\D/g, '');
  const phone =
    cleanDigits.length === 10
      ? `91${cleanDigits}`
      : cleanDigits.length > 10
      ? cleanDigits
      : '';
  return phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export async function exportCertificateDomToPdf(
  element: HTMLElement,
  fileName: string
): Promise<void> {
  // Ensure fonts and images inside certificate DOM are completely ready
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const dataUrl = await toPng(element, {
    quality: 1.0,
    pixelRatio: 2.2,
    backgroundColor: '#FFFDF9',
    cacheBust: true,
  });

  // Exact A4 Landscape (297mm x 210mm)
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  pdf.addImage(dataUrl, 'PNG', 0, 0, 297, 210, undefined, 'FAST');
  pdf.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);
}
