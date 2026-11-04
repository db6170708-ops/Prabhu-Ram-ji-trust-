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
