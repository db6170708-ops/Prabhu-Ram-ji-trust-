export type CertificateStatus = 'valid' | 'revoked';
export type CertificateLanguage = 'hi' | 'en';

export interface DigitalCertificate {
  id: number;
  certificateNumber: string;
  recipientName: string;
  guardianName: string;
  mobile: string;
  address: string;
  category: string;
  reason: string;
  amount: number | null;
  issueDate: string;
  language: CertificateLanguage;
  signatoryName: string;
  signatoryDesignation: string;
  photoUrl: string;
  templateId: number;
  status: CertificateStatus;
  revokedReason: string;
  revokedAt: string;
  revokedBy: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  verifyUrl: string;
}

export interface CertificateCategory {
  id: number;
  nameHi: string;
  nameEn: string;
  isDefault: boolean;
  createdAt: string;
}

export interface CertificateTemplate {
  id: number;
  name: string;
  themePrimary: string;
  themeGold: string;
  borderStyle: 'royal_double' | 'cultural_arch' | string;
  headerTextHi: string;
  headerTextEn: string;
  titleHi: string;
  titleEn: string;
  bodyTemplateHi: string;
  bodyTemplateEn: string;
  footerNoteHi: string;
  footerNoteEn: string;
  isDefault: boolean;
  updatedAt: string;
}

export interface CertificateSignatory {
  id: number;
  name: string;
  designation: string;
  sealText: string;
  isDefault: boolean;
  updatedAt: string;
}

export interface CertificateAuditLog {
  id: number;
  action: string;
  certificateNumber: string;
  actor: string;
  actorRole: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

export interface CertificateStats {
  totalCertificates: number;
  issuedCount: number;
  validCount: number;
  revokedCount: number;
  categoriesCount: number;
  templatesCount: number;
  signatoriesCount: number;
  nextPredictedNumber: string;
  byCategory: Array<{ category: string; count: number }>;
}

// Strictly privacy-safe public verification fields ONLY
export interface PublicVerifiedCertificate {
  certificateNumber: string;
  recipientName: string;
  category: string;
  issueDate: string;
  status: CertificateStatus;
  revokedAt?: string;
  issuer: string;
}
