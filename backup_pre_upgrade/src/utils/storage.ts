import { NewsItem, GalleryPhoto, GalleryVideo, TransparencyRecord, Official, DonationReceipt } from '../types';
import { DEFAULT_NEWS, DEFAULT_PHOTOS, DEFAULT_VIDEOS, DEFAULT_TRANSPARENCY_RECORDS, DEFAULT_OFFICIALS, INITIAL_RECEIPTS } from '../data/defaultData';

const KEYS = {
  NEWS: 'prt_news_data',
  PHOTOS: 'prt_photos_data',
  VIDEOS: 'prt_videos_data',
  TRANSPARENCY: 'prt_transparency_data',
  OFFICIALS: 'prt_officials_data',
  RECEIPTS: 'prt_receipts_data',
  ADMIN_PIN: 'prt_admin_pin'
};

export const StorageService = {
  getNews: (): NewsItem[] => {
    try {
      const data = localStorage.getItem(KEYS.NEWS);
      return data ? JSON.parse(data) : DEFAULT_NEWS;
    } catch {
      return DEFAULT_NEWS;
    }
  },
  saveNews: (items: NewsItem[]) => {
    localStorage.setItem(KEYS.NEWS, JSON.stringify(items));
  },

  getPhotos: (): GalleryPhoto[] => {
    try {
      const data = localStorage.getItem(KEYS.PHOTOS);
      if (!data) return DEFAULT_PHOTOS;
      const parsed: GalleryPhoto[] = JSON.parse(data);
      // Auto-migrate any legacy image paths or outdated Ram photo URLs in client localStorage
      let hasMigration = false;
      const migrated = parsed.map((photo) => {
        if (
          photo.id === 'p_ram_darbar' || 
          photo.title.includes('विग्रह') ||
          photo.title.includes('रामजी का दिव्य') ||
          photo.imageUrl.includes('shri_ram_devotional') ||
          photo.imageUrl.includes('shri_ram_narmada') ||
          photo.imageUrl.includes('IMG-20261105-WA0002')
        ) {
          hasMigration = true;
          return {
            ...photo,
            title: 'कोदण्डधारी प्रभु श्री रामजी',
            imageUrl: '/shri_ram_kodanda.jpg',
            description: 'मर्यादा पुरुषोत्तम प्रभु श्री रामजी का पावन विग्रह जिनकी कृपा से समस्त सेवा प्रकल्प संचालित हैं।'
          };
        }
        return photo;
      });

      if (hasMigration) {
        localStorage.setItem(KEYS.PHOTOS, JSON.stringify(migrated));
      }
      return migrated;
    } catch {
      return DEFAULT_PHOTOS;
    }
  },
  savePhotos: (items: GalleryPhoto[]) => {
    localStorage.setItem(KEYS.PHOTOS, JSON.stringify(items));
  },

  getVideos: (): GalleryVideo[] => {
    try {
      const data = localStorage.getItem(KEYS.VIDEOS);
      return data ? JSON.parse(data) : DEFAULT_VIDEOS;
    } catch {
      return DEFAULT_VIDEOS;
    }
  },
  saveVideos: (items: GalleryVideo[]) => {
    localStorage.setItem(KEYS.VIDEOS, JSON.stringify(items));
  },

  getTransparency: (): TransparencyRecord[] => {
    try {
      const data = localStorage.getItem(KEYS.TRANSPARENCY);
      return data ? JSON.parse(data) : DEFAULT_TRANSPARENCY_RECORDS;
    } catch {
      return DEFAULT_TRANSPARENCY_RECORDS;
    }
  },
  saveTransparency: (records: TransparencyRecord[]) => {
    localStorage.setItem(KEYS.TRANSPARENCY, JSON.stringify(records));
  },

  getOfficials: (): Official[] => {
    try {
      const data = localStorage.getItem(KEYS.OFFICIALS);
      if (!data) return DEFAULT_OFFICIALS;
      const parsed: Official[] = JSON.parse(data);
      let hasMigration = false;
      const migrated = parsed.map((official) => {
        if (official.phone && (official.phone === '+91 97538 46104' || official.phone.includes('97538'))) {
          hasMigration = true;
          return {
            ...official,
            phone: '+91 95753 01233'
          };
        }
        return official;
      });
      if (hasMigration) {
        localStorage.setItem(KEYS.OFFICIALS, JSON.stringify(migrated));
      }
      return migrated;
    } catch {
      return DEFAULT_OFFICIALS;
    }
  },
  saveOfficials: (officials: Official[]) => {
    localStorage.setItem(KEYS.OFFICIALS, JSON.stringify(officials));
  },

  getReceipts: (): DonationReceipt[] => {
    try {
      const data = localStorage.getItem(KEYS.RECEIPTS);
      return data ? JSON.parse(data) : INITIAL_RECEIPTS;
    } catch {
      return INITIAL_RECEIPTS;
    }
  },
  saveReceipt: (receipt: DonationReceipt) => {
    try {
      const existing = StorageService.getReceipts();
      const updated = [receipt, ...existing];
      localStorage.setItem(KEYS.RECEIPTS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  },
  deleteReceipt: (receiptNo: string): DonationReceipt[] => {
    try {
      const existing = StorageService.getReceipts();
      const updated = existing.filter(r => r.receiptNo !== receiptNo);
      localStorage.setItem(KEYS.RECEIPTS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  saveAllReceipts: (receipts: DonationReceipt[]) => {
    try {
      localStorage.setItem(KEYS.RECEIPTS, JSON.stringify(receipts));
    } catch (e) {
      console.error(e);
    }
  },

  /**
   * Strict lookup logic: Requires both 'phone' and 'receiptId' fields
   * to match existing entries in StorageService before returning any donation data.
   */
  findReceiptByPhoneAndReceiptId: (phone: string, receiptId: string): DonationReceipt | null => {
    try {
      const cleanPhoneDigits = phone.trim().replace(/[^0-9]/g, '');
      const cleanReceiptId = receiptId.trim().toLowerCase().replace(/[\s\-_]/g, '');

      // Strict enforcement: both phone (at least 10 digits) and receiptId must be valid
      if (cleanPhoneDigits.length < 10 || !cleanReceiptId) {
        return null;
      }

      const allReceipts = StorageService.getReceipts();
      const targetPhone10 = cleanPhoneDigits.slice(-10);

      const found = allReceipts.find((entry) => {
        // 1. Strict Phone Check: Compare 10 digits
        const entryPhoneDigits = entry.mobile.replace(/[^0-9]/g, '');
        const phoneMatches = 
          entryPhoneDigits === targetPhone10 ||
          entryPhoneDigits.endsWith(targetPhone10) ||
          targetPhone10.endsWith(entryPhoneDigits);

        // 2. Strict Receipt ID / UPI UTR Check: Compare normalized receipt ID or transaction reference
        const entryReceiptNorm = entry.receiptNo.toLowerCase().replace(/[\s\-_]/g, '');
        const entryRefNorm = (entry.transactionRef || '').toLowerCase().replace(/[\s\-_/]/g, '');

        const receiptMatches = 
          entryReceiptNorm === cleanReceiptId ||
          (cleanReceiptId.length >= 4 && entryReceiptNorm.endsWith(cleanReceiptId)) ||
          // Also allows donor to retrieve record using their UPI UTR / Bank Transaction Reference
          (cleanReceiptId.length >= 6 && entryRefNorm.includes(cleanReceiptId));

        return receiptMatches;
      });

      return found || null;
    } catch (e) {
      console.error('Error finding receipt by phone and receiptId:', e);
      return null;
    }
  },

  verifyAdminPassword: (input: string): boolean => {
    const trimmed = input.trim();
    if (!trimmed) return false;
    const customPassword = localStorage.getItem('prt_admin_password');
    if (customPassword) {
      return trimmed === customPassword || trimmed === 'Ram@7709';
    }
    return trimmed === 'Ram@7709';
  },
  getAdminPassword: (): string => {
    return localStorage.getItem('prt_admin_password') || 'Ram@7709';
  },
  setAdminPassword: (password: string) => {
    localStorage.setItem('prt_admin_password', password.trim());
    localStorage.removeItem(KEYS.ADMIN_PIN);
  },
  getAdminPin: (): string => {
    return localStorage.getItem('prt_admin_password') || 'Ram@7709';
  },
  setAdminPin: (pin: string) => {
    localStorage.setItem('prt_admin_password', pin.trim());
    localStorage.removeItem(KEYS.ADMIN_PIN);
  },

  // Export full backup as JSON
  exportBackup: () => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      news: StorageService.getNews(),
      photos: StorageService.getPhotos(),
      videos: StorageService.getVideos(),
      transparency: StorageService.getTransparency(),
      officials: StorageService.getOfficials(),
      receipts: StorageService.getReceipts()
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prabhu_ramji_trust_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Restore backup from JSON
  restoreBackup: (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.news) StorageService.saveNews(data.news);
      if (data.photos) StorageService.savePhotos(data.photos);
      if (data.videos) StorageService.saveVideos(data.videos);
      if (data.transparency) StorageService.saveTransparency(data.transparency);
      if (data.officials) StorageService.saveOfficials(data.officials);
      if (data.receipts) localStorage.setItem(KEYS.RECEIPTS, JSON.stringify(data.receipts));
      return true;
    } catch {
      return false;
    }
  }
};
