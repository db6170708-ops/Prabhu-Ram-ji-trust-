export type SevaCategory = 'gauseva' | 'narmada' | 'annadan' | 'chaiseva' | 'ashram' | 'manavseva' | 'all';

export interface Official {
  id: string;
  name: string;
  designation: string;
  roleDescription: string;
  phone?: string;
  photo?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  content: string;
  category: 'bhandara' | 'utsav' | 'gauseva' | 'suchna';
  isImportant?: boolean;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: SevaCategory;
  imageUrl: string;
  date: string;
  description: string;
}

export interface GalleryVideo {
  id: string;
  title: string;
  youtubeId: string;
  category: SevaCategory;
  date: string;
  description: string;
}

export interface TransparencyRecord {
  id: string;
  monthYear: string;
  totalDonation: number;
  totalExpense: number;
  gauSevaExpense: number;
  bhandaraExpense: number;
  narmadaSevaExpense: number;
  otherExpense: number;
  remarks: string;
}

export interface DonationReceipt {
  receiptNo: string;
  donorName: string;
  mobile: string;
  email?: string;
  pan?: string;
  amount: number;
  cause: string;
  date: string;
  paymentMode: string;
  transactionRef: string;
  status?: 'pending' | 'verified' | 'rejected';
  verifiedDate?: string;
  verifiedBy?: string;
  adminNotes?: string;
}

export interface TrustObjective {
  number: string;
  type: 'active' | 'proposed';
  statusLabel: string;
  title: string;
  desc: string;
  badge: string;
  location: string;
}

export interface VolunteerApplication {
  id: string;
  name?: string;
  fullName?: string;
  mobile: string;
  city?: string;
  email?: string;
  sevaType?: string;
  preferredArea?: string;
  availableTime?: string;
  availability?: string;
  message?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate?: string;
  appliedAt?: string;
  adminNotes?: string;
}

export interface SevaCertificate {
  id?: string;
  certificateNo?: string;
  recipientName: string;
  recipientMobile?: string;
  roleOrCause?: string;
  sevaTitle?: string;
  issueDate: string;
  amount?: number;
  description?: string;
  status?: 'valid' | 'revoked';
}

export type VolunteerCertificate = SevaCertificate;

export interface ComplaintFeedback {
  id?: string;
  refNo?: string;
  name: string;
  phone?: string;
  mobile?: string;
  type: 'feedback' | 'complaint' | 'inquiry' | 'suggestion';
  category?: string;
  subject: string;
  message?: string;
  description?: string;
  date?: string;
  createdAt?: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'submitted' | 'under_review';
  adminReply?: string;
  adminResponse?: string;
  resolvedDate?: string;
}

export interface ConstructionMilestone {
  id?: string;
  title?: string;
  name?: string;
  percent?: number;
  done?: boolean;
  status?: 'completed' | 'in_progress' | 'upcoming';
  description?: string;
  completedDate?: string;
}

export interface ConstructionProgress {
  projectTitle?: string;
  phaseTitle?: string;
  location?: string;
  totalBudget?: number;
  estimatedBudget?: number;
  receivedDonations?: number;
  fundsRaised?: number;
  totalSpent?: number;
  fundsSpent?: number;
  status?: string;
  completionPercentage?: number;
  targetCompletion?: string;
  targetDate?: string;
  description?: string;
  milestones: ConstructionMilestone[];
  photos?: string[];
}

export interface PaymentGatewayConfig {
  enabled?: boolean;
  provider: 'manual' | 'direct_upi' | 'razorpay' | 'cashfree' | 'payu';
  testMode?: boolean;
  mode?: 'live' | 'test';
  apiKey?: string;
  keyId?: string;
  keySecret?: string;
  merchantId?: string;
  webhookSecret?: string;
  updatedAt?: string;
}

export interface SevaProject {
  id: string;
  number?: string;
  order?: number;
  title: string;
  englishTitle?: string;
  subtitle?: string;
  description?: string;
  fullDescription?: string;
  iconName?: string;
  imageUrl?: string;
  dailyRoutine?: string;
  schedule?: string;
  location?: string;
  keyStats?: string;
  impactStat?: string;
  status?: 'active' | 'in_progress';
  donationTargetCause?: string;
  highlights?: string[];
}
