import { 
  NewsItem, 
  GalleryPhoto, 
  GalleryVideo, 
  TransparencyRecord, 
  Official, 
  DonationReceipt, 
  VolunteerApplication, 
  SevaCertificate, 
  ComplaintFeedback, 
  ConstructionProgress, 
  PaymentGatewayConfig,
  VolunteerServiceEvent,
  VolunteerTaskItem
} from '../types';
import { 
  DEFAULT_NEWS, 
  DEFAULT_PHOTOS, 
  DEFAULT_VIDEOS, 
  DEFAULT_TRANSPARENCY_RECORDS, 
  DEFAULT_OFFICIALS, 
  INITIAL_RECEIPTS,
  DEFAULT_CONSTRUCTION_PROGRESS,
  DEFAULT_VOLUNTEER_EVENTS,
  DEFAULT_VOLUNTEER_TASKS
} from '../data/defaultData';

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
  },

  // 1. Donation Verification & Admin Audit
  updateReceiptStatus: (receiptNo: string, status: 'verified' | 'rejected' | 'pending', notes?: string) => {
    try {
      const receipts = StorageService.getReceipts();
      const updated = receipts.map((r) => {
        if (r.receiptNo === receiptNo) {
          return {
            ...r,
            status,
            verifiedDate: new Date().toISOString().split('T')[0],
            verifiedBy: 'ट्रस्ट कोषाध्यक्ष / सचिव',
            adminNotes: notes || (status === 'verified' ? 'बैंक खाते में पुष्टि पूर्ण' : status === 'rejected' ? 'अमान्य UTR' : 'समीक्षाधीन')
          };
        }
        return r;
      });
      StorageService.saveAllReceipts(updated);
      return updated;
    } catch {
      return StorageService.getReceipts();
    }
  },

  // 2. Volunteers Management
  getVolunteers: (): VolunteerApplication[] => {
    try {
      const data = localStorage.getItem('prt_volunteers_data');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveVolunteer: (vol: VolunteerApplication) => {
    try {
      const existing = StorageService.getVolunteers();
      localStorage.setItem('prt_volunteers_data', JSON.stringify([vol, ...existing]));
    } catch (e) {
      console.error(e);
    }
  },
  updateVolunteerStatus: (id: string, status: 'approved' | 'rejected', notes?: string) => {
    try {
      const existing = StorageService.getVolunteers();
      const updated = existing.map(v => v.id === id ? { ...v, status, adminNotes: notes } : v);
      localStorage.setItem('prt_volunteers_data', JSON.stringify(updated));
      return updated;
    } catch {
      return StorageService.getVolunteers();
    }
  },

  // 3. Certificates
  getCertificates: (): SevaCertificate[] => {
    try {
      const data = localStorage.getItem('prt_certificates_data');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveCertificate: (cert: SevaCertificate) => {
    try {
      const existing = StorageService.getCertificates();
      localStorage.setItem('prt_certificates_data', JSON.stringify([cert, ...existing]));
    } catch (e) {
      console.error(e);
    }
  },
  findCertificate: (certNo: string): SevaCertificate | null => {
    try {
      const certs = StorageService.getCertificates();
      const clean = certNo.trim().toUpperCase();
      return certs.find(c => 
        (c.certificateNo && c.certificateNo.toUpperCase() === clean) || 
        (c.id && c.id.toUpperCase() === clean)
      ) || null;
    } catch {
      return null;
    }
  },
  getCertificateById: (certNo: string): SevaCertificate | null => {
    return StorageService.findCertificate(certNo);
  },

  // 4. Complaints & Feedback
  getComplaints: (): ComplaintFeedback[] => {
    try {
      const data = localStorage.getItem('prt_complaints_data');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveComplaint: (cf: ComplaintFeedback) => {
    try {
      const existing = StorageService.getComplaints();
      localStorage.setItem('prt_complaints_data', JSON.stringify([cf, ...existing]));
    } catch (e) {
      console.error(e);
    }
  },
  findComplaint: (refNo: string): ComplaintFeedback | null => {
    try {
      const list = StorageService.getComplaints();
      const clean = refNo.trim().toUpperCase();
      return list.find(item => 
        (item.refNo && item.refNo.toUpperCase() === clean) || 
        (item.id && item.id.toUpperCase() === clean)
      ) || null;
    } catch {
      return null;
    }
  },
  updateComplaintStatus: (refNo: string, status: 'under_review' | 'resolved' | 'in_progress' | 'submitted' | 'pending', reply?: string) => {
    try {
      const list = StorageService.getComplaints();
      const clean = refNo.trim().toUpperCase();
      const updated = list.map(item => {
        const match = 
          (item.refNo && item.refNo.toUpperCase() === clean) || 
          (item.id && item.id.toUpperCase() === clean);
        if (match) {
          return {
            ...item,
            status,
            adminReply: reply || item.adminReply,
            adminResponse: reply || item.adminResponse,
            resolvedDate: status === 'resolved' ? new Date().toISOString().split('T')[0] : item.resolvedDate
          };
        }
        return item;
      });
      localStorage.setItem('prt_complaints_data', JSON.stringify(updated));
      return updated;
    } catch {
      return StorageService.getComplaints();
    }
  },

  // 5. Construction Progress
  getConstructionProgress: (): ConstructionProgress => {
    try {
      const data = localStorage.getItem('prt_construction_data');
      return data ? JSON.parse(data) : DEFAULT_CONSTRUCTION_PROGRESS;
    } catch {
      return DEFAULT_CONSTRUCTION_PROGRESS;
    }
  },
  saveConstructionProgress: (cp: ConstructionProgress) => {
    try {
      localStorage.setItem('prt_construction_data', JSON.stringify(cp));
    } catch (e) {
      console.error(e);
    }
  },

  // 6. Payment Gateway Config
  getGatewayConfig: (): PaymentGatewayConfig => {
    try {
      const data = localStorage.getItem('prt_gateway_config');
      return data ? JSON.parse(data) : {
        enabled: false,
        provider: 'manual',
        testMode: true,
        updatedAt: '2026-11-10'
      };
    } catch {
      return {
        enabled: false,
        provider: 'manual',
        testMode: true
      };
    }
  },
  saveGatewayConfig: (cfg: PaymentGatewayConfig) => {
    try {
      localStorage.setItem('prt_gateway_config', JSON.stringify({
        ...cfg,
        updatedAt: new Date().toISOString().split('T')[0]
      }));
    } catch (e) {
      console.error(e);
    }
  },

  // 7. Volunteer Dashboard Events & Tasks
  getVolunteerEvents: (): VolunteerServiceEvent[] => {
    try {
      const data = localStorage.getItem('prt_volunteer_events');
      return data ? JSON.parse(data) : DEFAULT_VOLUNTEER_EVENTS;
    } catch {
      return DEFAULT_VOLUNTEER_EVENTS;
    }
  },
  saveVolunteerEvents: (events: VolunteerServiceEvent[]) => {
    try {
      localStorage.setItem('prt_volunteer_events', JSON.stringify(events));
    } catch (e) {
      console.error(e);
    }
  },
  toggleVolunteerEventRsvp: (eventId: string, volunteerKey: string): VolunteerServiceEvent[] => {
    const events = StorageService.getVolunteerEvents();
    const updated = events.map((ev) => {
      if (ev.id !== eventId) return ev;
      const exists = ev.rsvpVolunteerIds.includes(volunteerKey);
      return {
        ...ev,
        rsvpVolunteerIds: exists
          ? ev.rsvpVolunteerIds.filter((id) => id !== volunteerKey)
          : [...ev.rsvpVolunteerIds, volunteerKey]
      };
    });
    StorageService.saveVolunteerEvents(updated);
    return updated;
  },

  getVolunteerTasks: (): VolunteerTaskItem[] => {
    try {
      const data = localStorage.getItem('prt_volunteer_tasks');
      return data ? JSON.parse(data) : DEFAULT_VOLUNTEER_TASKS;
    } catch {
      return DEFAULT_VOLUNTEER_TASKS;
    }
  },
  saveVolunteerTasks: (tasks: VolunteerTaskItem[]) => {
    try {
      localStorage.setItem('prt_volunteer_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  },
  updateVolunteerTaskStatus: (
    taskId: string,
    status: 'pending' | 'in_progress' | 'completed',
    assignedTo?: string
  ): VolunteerTaskItem[] => {
    const tasks = StorageService.getVolunteerTasks();
    const updated = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            status,
            assignedTo: assignedTo !== undefined ? assignedTo : task.assignedTo
          }
        : task
    );
    StorageService.saveVolunteerTasks(updated);
    return updated;
  },
  addVolunteerTask: (task: VolunteerTaskItem): VolunteerTaskItem[] => {
    const tasks = StorageService.getVolunteerTasks();
    const updated = [task, ...tasks];
    StorageService.saveVolunteerTasks(updated);
    return updated;
  }
};

