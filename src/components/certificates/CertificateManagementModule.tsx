import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Award,
  Plus,
  Search,
  Edit3,
  Download,
  Printer,
  Share2,
  ShieldCheck,
  Palette,
  PenTool,
  Ban,
  Eye,
  CheckCircle2,
  XCircle,
  FileDown,
  RefreshCw,
  Copy,
  Check,
  RotateCcw,
  Trash2,
  History,
  ExternalLink,
  Upload,
} from 'lucide-react';
import {
  CertificateAuditLog,
  CertificateCategory,
  CertificateSignatory,
  CertificateStats,
  CertificateTemplate,
  DigitalCertificate,
} from '../../types/certificates';
import {
  buildWhatsAppShareMessage,
  buildWhatsAppShareUrl,
  CertificateApi,
  exportCertificateDomToPdf,
  getCertificateVerifyUrl,
} from '../../utils/certificateApi';
import {
  CertificateCanvas,
  CertificateRenderData,
  ResponsiveCertificatePreview,
} from './CertificateRenderer';

export type CertificateSubTab =
  | 'issue'
  | 'all'
  | 'edit'
  | 'download'
  | 'print'
  | 'whatsapp'
  | 'verify'
  | 'templates'
  | 'signatories'
  | 'revoked';

interface CertificateManagementModuleProps {
  onNotify: (text: string, type?: 'success' | 'error') => void;
  onOpenPublicVerify?: (certNo: string) => void;
}

const SUB_TABS: Array<{ id: CertificateSubTab; label: string; shortLabel: string; icon: React.ReactNode }> = [
  { id: 'issue', label: '1. नया प्रमाण पत्र जारी करें', shortLabel: 'जारी करें', icon: <Plus className="w-3.5 h-3.5" /> },
  { id: 'all', label: '2. सभी जारी प्रमाण पत्र', shortLabel: 'सभी रिकॉर्ड', icon: <Award className="w-3.5 h-3.5" /> },
  { id: 'edit', label: '3. प्रमाण पत्र संपादित करें', shortLabel: 'संपादित करें', icon: <Edit3 className="w-3.5 h-3.5" /> },
  { id: 'download', label: '4. प्रमाण पत्र डाउनलोड करें', shortLabel: 'डाउनलोड PDF', icon: <Download className="w-3.5 h-3.5" /> },
  { id: 'print', label: '5. प्रमाण पत्र प्रिंट करें', shortLabel: 'प्रिंट करें', icon: <Printer className="w-3.5 h-3.5" /> },
  { id: 'whatsapp', label: '6. WhatsApp पर शेयर करें', shortLabel: 'WhatsApp शेयर', icon: <Share2 className="w-3.5 h-3.5" /> },
  { id: 'verify', label: '7. प्रमाण पत्र सत्यापन', shortLabel: 'सत्यापन', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  { id: 'templates', label: '8. टेम्पलेट मैनेजमेंट', shortLabel: 'टेम्पलेट्स', icon: <Palette className="w-3.5 h-3.5" /> },
  { id: 'signatories', label: '9. हस्ताक्षर एवं पदाधिकारी', shortLabel: 'हस्ताक्षर सेटिंग', icon: <PenTool className="w-3.5 h-3.5" /> },
  { id: 'revoked', label: '10. रद्द प्रमाण पत्र व ऑडिट', shortLabel: 'रद्द / ऑडिट', icon: <Ban className="w-3.5 h-3.5" /> },
];

export const CertificateManagementModule: React.FC<CertificateManagementModuleProps> = ({
  onNotify,
  onOpenPublicVerify,
}) => {
  const [subTab, setSubTab] = useState<CertificateSubTab>('issue');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  // Core data from SQLite backend
  const [stats, setStats] = useState<CertificateStats | null>(null);
  const [certificates, setCertificates] = useState<DigitalCertificate[]>([]);
  const [categories, setCategories] = useState<CertificateCategory[]>([]);
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [signatories, setSignatories] = useState<CertificateSignatory[]>([]);
  const [auditLogs, setAuditLogs] = useState<CertificateAuditLog[]>([]);

  // Active selected certificate for Download/Print/WhatsApp/Edit/Verify/Preview modal
  const [activeCert, setActiveCert] = useState<DigitalCertificate | null>(null);
  const [previewModalData, setPreviewModalData] = useState<{
    data: CertificateRenderData;
    template: CertificateTemplate | null;
  } | null>(null);

  // Export & Print DOM refs (exact 1122x794 A4 Landscape)
  const pdfCaptureRef = useRef<HTMLDivElement>(null);
  const [exportRenderData, setExportRenderData] = useState<{
    data: CertificateRenderData;
    template: CertificateTemplate | null;
  } | null>(null);

  // Issue New Certificate Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const [issueForm, setIssueForm] = useState({
    recipientName: '',
    guardianName: '',
    mobile: '',
    address: '',
    category: 'दानदाता',
    reason: '',
    amount: '',
    issueDate: todayStr,
    language: 'hi' as 'hi' | 'en',
    signatoryName: 'श्री गुलाबचंद जी',
    signatoryDesignation: 'अध्यक्ष (President)',
    photoUrl: '',
    templateId: 1,
  });
  const [justIssuedCert, setJustIssuedCert] = useState<DigitalCertificate | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);

  // Filters for All Issued Certificates
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'valid' | 'revoked'>('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  // Edit Form State
  const [editTargetNo, setEditTargetNo] = useState('');
  const [editForm, setEditForm] = useState({
    recipientName: '',
    guardianName: '',
    mobile: '',
    address: '',
    category: '',
    reason: '',
    amount: '',
    issueDate: todayStr,
    language: 'hi' as 'hi' | 'en',
    signatoryName: '',
    signatoryDesignation: '',
    photoUrl: '',
    templateId: 1,
  });

  // WhatsApp Share State
  const [waPhoneOverride, setWaPhoneOverride] = useState('');
  const [copiedKey, setCopiedKey] = useState('');

  // Verify Sub-tab State
  const [verifyQuery, setVerifyQuery] = useState('');
  const [verifyCheckResult, setVerifyCheckResult] = useState<any>(null);

  // Revoke Modal / Form State
  const [revokeTargetNo, setRevokeTargetNo] = useState('');
  const [revokeReason, setRevokeReason] = useState('');

  // Template Editing State
  const [editingTemplate, setEditingTemplate] = useState<CertificateTemplate | null>(null);
  const [newTemplateForm, setNewTemplateForm] = useState({
    name: '',
    themePrimary: '#0f4d3a',
    themeGold: '#d97706',
    borderStyle: 'royal_double',
    headerTextHi: '॥ श्री गणेशाय नमः ॥ श्री जानकीनाथ सहाय ॥',
    headerTextEn: 'With Divine Blessings of Prabhu Shri Ramji',
    titleHi: 'सेवा सम्मान प्रमाण पत्र',
    titleEn: 'CERTIFICATE OF HONOUR & SEVA',
    bodyTemplateHi:
      'यह पावन प्रमाण-पत्र {category} श्रेणी के अंतर्गत {reason} में आपके समर्पित योगदान के लिए सादर प्रदान किया जाता है।',
    bodyTemplateEn:
      'This certificate is proudly conferred under {category} category for dedicated contribution towards {reason}.',
    footerNoteHi: 'प्रभु रामजी ट्रस्ट, ग्राम गलगाँव, तहसील सनावद, जिला खरगोन (म.प्र.)',
    footerNoteEn: 'Prabhu Ramji Trust, Galgaon, Sanawad, Khargone (M.P.)',
  });

  // Signatory Add Form
  const [newSignatory, setNewSignatory] = useState({
    name: '',
    designation: '',
    sealText: 'प्रभु रामजी ट्रस्ट · ग्राम गलगाँव',
    isDefault: false,
  });

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, certsData, catsData, tplsData, sigsData, logsData] = await Promise.all([
        CertificateApi.getStats(),
        CertificateApi.listCertificates(),
        CertificateApi.getCategories(),
        CertificateApi.getTemplates(),
        CertificateApi.getSignatories(),
        CertificateApi.getAuditLogs(100),
      ]);

      setStats(statsData);
      setCertificates(certsData);
      setCategories(catsData);
      setTemplates(tplsData);
      setSignatories(sigsData);
      setAuditLogs(logsData);

      // Set defaults on issue form if blank or matching defaults
      const defSig = sigsData.find((s) => s.isDefault) || sigsData[0];
      const defTpl = tplsData.find((t) => t.isDefault) || tplsData[0];
      setIssueForm((prev) => ({
        ...prev,
        signatoryName: prev.signatoryName || defSig?.name || 'श्री गुलाबचंद जी',
        signatoryDesignation: prev.signatoryDesignation || defSig?.designation || 'अध्यक्ष (President)',
        templateId: defTpl?.id || prev.templateId || 1,
      }));

      if (certsData.length > 0 && !activeCert) {
        setActiveCert(certsData[0]);
      }
    } catch (err: any) {
      onNotify(err.message || 'प्रमाण-पत्र डेटा लोड करने में त्रुटि हुई।', 'error');
    } finally {
      setLoading(false);
    }
  }, [activeCert, onNotify]);

  useEffect(() => {
    loadAllData();
  }, []);

  const getTemplateById = (id?: number): CertificateTemplate | null => {
    if (!templates.length) return null;
    return templates.find((t) => t.id === id) || templates.find((t) => t.isDefault) || templates[0];
  };

  const getSealForSignatory = (sigName: string): string => {
    const match = signatories.find((s) => s.name === sigName) || signatories.find((s) => s.isDefault);
    return match?.sealText || 'प्रभु रामजी ट्रस्ट · ग्राम गलगाँव';
  };

  const certToRenderData = (c: DigitalCertificate): CertificateRenderData => ({
    certificateNumber: c.certificateNumber,
    recipientName: c.recipientName,
    guardianName: c.guardianName,
    category: c.category,
    reason: c.reason,
    amount: c.amount,
    issueDate: c.issueDate,
    language: c.language,
    signatoryName: c.signatoryName,
    signatoryDesignation: c.signatoryDesignation,
    photoUrl: c.photoUrl,
    status: c.status,
    sealText: getSealForSignatory(c.signatoryName),
  });

  // Upload & compress recipient photo
  const handlePhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'issue' | 'edit'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onNotify('कृपया केवल JPG या PNG छवि चुनें।', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const rawUrl = ev.target?.result as string;
      const img = new window.Image();
      img.src = rawUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 480;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        const compressed = ctx
          ? (ctx.drawImage(img, 0, 0, w, h), canvas.toDataURL('image/jpeg', 0.85))
          : rawUrl;

        if (target === 'issue') {
          setIssueForm((prev) => ({ ...prev, photoUrl: compressed }));
        } else {
          setEditForm((prev) => ({ ...prev, photoUrl: compressed }));
        }
      };
    };
    reader.readAsDataURL(file);
  };

  // Trigger A4 Landscape PDF Download
  const handleDownloadPdf = async (cert: DigitalCertificate) => {
    try {
      setBusy(true);
      const renderData = certToRenderData(cert);
      const tpl = getTemplateById(cert.templateId);
      setExportRenderData({ data: renderData, template: tpl });

      // Wait two animation frames for hidden 1122x794 node + QR image to settle
      await new Promise((r) => setTimeout(r, 420));

      if (!pdfCaptureRef.current) {
        throw new Error('PDF कैनवास तैयार नहीं हो सका।');
      }

      await exportCertificateDomToPdf(
        pdfCaptureRef.current,
        `${cert.certificateNumber}_${cert.recipientName.replace(/\s+/g, '_')}.pdf`
      );
      onNotify(`PDF डाउनलोड प्रारंभ: ${cert.certificateNumber}.pdf`, 'success');
    } catch (err: any) {
      onNotify(err.message || 'PDF डाउनलोड में त्रुटि हुई।', 'error');
    } finally {
      setBusy(false);
    }
  };

  // Trigger A4 Landscape Native Print
  const handlePrintCertificate = async (cert: DigitalCertificate) => {
    try {
      const renderData = certToRenderData(cert);
      const tpl = getTemplateById(cert.templateId);
      setExportRenderData({ data: renderData, template: tpl });
      document.body.classList.add('printing-a4-certificate');

      await new Promise((r) => setTimeout(r, 380));
      window.print();

      const cleanup = () => {
        document.body.classList.remove('printing-a4-certificate');
        window.removeEventListener('afterprint', cleanup);
      };
      window.addEventListener('afterprint', cleanup);
      setTimeout(() => document.body.classList.remove('printing-a4-certificate'), 2500);
    } catch (err: any) {
      document.body.classList.remove('printing-a4-certificate');
      onNotify(err.message || 'प्रिंट प्रारंभ करने में त्रुटि हुई।', 'error');
    }
  };

  // Issue New Certificate
  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setBusy(true);
      const res = await CertificateApi.issueCertificate({
        recipientName: issueForm.recipientName,
        guardianName: issueForm.guardianName,
        mobile: issueForm.mobile,
        address: issueForm.address,
        category: issueForm.category,
        reason: issueForm.reason,
        amount: issueForm.amount ? Number(issueForm.amount) : null,
        issueDate: issueForm.issueDate,
        language: issueForm.language,
        signatoryName: issueForm.signatoryName,
        signatoryDesignation: issueForm.signatoryDesignation,
        photoUrl: issueForm.photoUrl,
        templateId: issueForm.templateId,
      });

      setJustIssuedCert(res.certificate);
      setActiveCert(res.certificate);
      setWaPhoneOverride(res.certificate.mobile);
      onNotify(res.message, 'success');

      setIssueForm((prev) => ({
        ...prev,
        recipientName: '',
        guardianName: '',
        mobile: '',
        address: '',
        reason: '',
        amount: '',
        photoUrl: '',
      }));

      await loadAllData();
    } catch (err: any) {
      onNotify(err.message || 'प्रमाण-पत्र जारी करने में त्रुटि हुई।', 'error');
    } finally {
      setBusy(false);
    }
  };

  // Open Preview Certificate Modal before/without saving
  const handleOpenFormPreview = (mode: 'issue' | 'edit') => {
    if (mode === 'issue') {
      const renderData: CertificateRenderData = {
        certificateNumber: stats?.nextPredictedNumber || 'PRRT-2026-0001',
        recipientName: issueForm.recipientName || 'श्री श्रद्धालु का नाम',
        guardianName: issueForm.guardianName,
        category: issueForm.category,
        reason: issueForm.reason || 'गौसेवा एवं समाजसेवा में निष्काम योगदान',
        amount: issueForm.amount ? Number(issueForm.amount) : null,
        issueDate: issueForm.issueDate,
        language: issueForm.language,
        signatoryName: issueForm.signatoryName,
        signatoryDesignation: issueForm.signatoryDesignation,
        photoUrl: issueForm.photoUrl,
        status: 'valid',
        sealText: getSealForSignatory(issueForm.signatoryName),
      };
      setPreviewModalData({
        data: renderData,
        template: getTemplateById(issueForm.templateId),
      });
    } else {
      const renderData: CertificateRenderData = {
        certificateNumber: editTargetNo || 'PRRT-2026-0001',
        recipientName: editForm.recipientName,
        guardianName: editForm.guardianName,
        category: editForm.category,
        reason: editForm.reason,
        amount: editForm.amount ? Number(editForm.amount) : null,
        issueDate: editForm.issueDate,
        language: editForm.language,
        signatoryName: editForm.signatoryName,
        signatoryDesignation: editForm.signatoryDesignation,
        photoUrl: editForm.photoUrl,
        status: 'valid',
        sealText: getSealForSignatory(editForm.signatoryName),
      };
      setPreviewModalData({
        data: renderData,
        template: getTemplateById(editForm.templateId),
      });
    }
  };

  // Add Custom Category
  const handleAddCustomCategory = async () => {
    if (!newCategoryName.trim()) {
      onNotify('कृपया नई श्रेणी का नाम लिखें।', 'error');
      return;
    }
    try {
      setBusy(true);
      const created = await CertificateApi.addCategory(newCategoryName.trim());
      setCategories((prev) => [...prev, created]);
      setIssueForm((prev) => ({ ...prev, category: created.nameHi }));
      setNewCategoryName('');
      setShowAddCategory(false);
      onNotify(`नई श्रेणी "${created.nameHi}" जोड़ी गई।`, 'success');
      await loadAllData();
    } catch (err: any) {
      onNotify(err.message || 'श्रेणी जोड़ने में त्रुटि हुई।', 'error');
    } finally {
      setBusy(false);
    }
  };

  // Select certificate into Edit mode
  const startEditingCertificate = (cert: DigitalCertificate) => {
    setEditTargetNo(cert.certificateNumber);
    setEditForm({
      recipientName: cert.recipientName,
      guardianName: cert.guardianName,
      mobile: cert.mobile,
      address: cert.address,
      category: cert.category,
      reason: cert.reason,
      amount: cert.amount !== null ? String(cert.amount) : '',
      issueDate: cert.issueDate,
      language: cert.language,
      signatoryName: cert.signatoryName,
      signatoryDesignation: cert.signatoryDesignation,
      photoUrl: cert.photoUrl,
      templateId: cert.templateId,
    });
    setSubTab('edit');
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTargetNo) return;
    try {
      setBusy(true);
      const res = await CertificateApi.updateCertificate(editTargetNo, {
        recipientName: editForm.recipientName,
        guardianName: editForm.guardianName,
        mobile: editForm.mobile,
        address: editForm.address,
        category: editForm.category,
        reason: editForm.reason,
        amount: editForm.amount ? Number(editForm.amount) : null,
        issueDate: editForm.issueDate,
        language: editForm.language,
        signatoryName: editForm.signatoryName,
        signatoryDesignation: editForm.signatoryDesignation,
        photoUrl: editForm.photoUrl,
        templateId: editForm.templateId,
      });
      setActiveCert(res.certificate);
      onNotify(res.message, 'success');
      await loadAllData();
    } catch (err: any) {
      onNotify(err.message || 'संपादन सहेजने में त्रुटि हुई।', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleRevokeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revokeTargetNo || !revokeReason.trim()) {
      onNotify('कृपया प्रमाण-पत्र चुनें और रद्द करने का कारण लिखें।', 'error');
      return;
    }
    try {
      setBusy(true);
      const res = await CertificateApi.revokeCertificate(revokeTargetNo, revokeReason.trim());
      onNotify(res.message, 'success');
      setRevokeTargetNo('');
      setRevokeReason('');
      await loadAllData();
    } catch (err: any) {
      onNotify(err.message || 'रद्द करने में त्रुटि हुई।', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleRestoreCertificate = async (certNo: string) => {
    try {
      setBusy(true);
      const res = await CertificateApi.restoreCertificate(certNo);
      onNotify(res.message, 'success');
      await loadAllData();
    } catch (err: any) {
      onNotify(err.message || 'पुनर्स्थापना में त्रुटि हुई।', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleCopyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    onNotify('कॉपी किया गया!', 'success');
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const filteredCertificates = certificates.filter((c) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesQ =
      !q ||
      c.certificateNumber.toLowerCase().includes(q) ||
      c.recipientName.toLowerCase().includes(q) ||
      c.mobile.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q);
    const matchesCat = filterCategory === 'all' || c.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchesFrom = !filterDateFrom || c.issueDate >= filterDateFrom;
    const matchesTo = !filterDateTo || c.issueDate <= filterDateTo;
    return matchesQ && matchesCat && matchesStatus && matchesFrom && matchesTo;
  });

  const validCertificates = certificates.filter((c) => c.status === 'valid');
  const revokedCertificates = certificates.filter((c) => c.status === 'revoked');

  const selectedShareCert = activeCert || certificates[0] || null;
  const shareMessage = selectedShareCert ? buildWhatsAppShareMessage(selectedShareCert) : '';

  return (
    <div className="space-y-5">
      {/* Module Header & KPI Stats */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              DIGITAL CERTIFICATE MANAGEMENT
            </div>
            <h4 className="font-heading text-lg sm:text-xl font-bold text-[#0f4d3a]">
              डिजिटल सम्मान प्रमाण-पत्र प्रबंधन प्रणाली
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={loadAllData}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 border border-stone-300 text-xs font-semibold text-stone-700 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>डेटा ताज़ा करें</span>
            </button>
            <button
              type="button"
              onClick={() => CertificateApi.downloadCsv().catch((e) => onNotify(e.message, 'error'))}
              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>CSV निर्यात करें</span>
            </button>
          </div>
        </div>

        {/* 5 Responsive KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          <div className="bg-white p-3 rounded-xl border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-500 block">कुल प्रमाण पत्र</span>
            <span className="text-xl font-bold font-mono tabular-nums text-stone-900">
              {stats?.totalCertificates ?? certificates.length}
            </span>
          </div>
          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
            <span className="text-[11px] font-semibold text-emerald-800 block">वैध (Valid)</span>
            <span className="text-xl font-bold font-mono tabular-nums text-emerald-900">
              {stats?.validCount ?? validCertificates.length}
            </span>
          </div>
          <div className="bg-red-50/70 p-3 rounded-xl border border-red-200">
            <span className="text-[11px] font-semibold text-red-800 block">रद्द (Revoked)</span>
            <span className="text-xl font-bold font-mono tabular-nums text-red-900">
              {stats?.revokedCount ?? revokedCertificates.length}
            </span>
          </div>
          <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200">
            <span className="text-[11px] font-semibold text-amber-900 block">कुल श्रेणियाँ</span>
            <span className="text-xl font-bold font-mono tabular-nums text-amber-950">
              {stats?.categoriesCount ?? categories.length}
            </span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-stone-200 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-semibold text-stone-500 block">आगामी क्रमांक</span>
            <span className="text-sm sm:text-base font-bold font-mono tabular-nums text-[#0f4d3a]">
              {stats?.nextPredictedNumber || 'PRRT-2026-0001'}
            </span>
          </div>
        </div>
      </div>

      {/* 10 Sub-Menu Tabs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5 bg-stone-100 p-1.5 rounded-xl border border-stone-200">
        {SUB_TABS.map((t) => {
          const active = subTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSubTab(t.id)}
              title={t.label}
              className={`px-2.5 py-2 rounded-lg text-[11px] sm:text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer truncate ${
                active
                  ? 'bg-[#0f4d3a] text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-emerald-50 hover:text-[#0f4d3a]'
              }`}
            >
              <span className="shrink-0">{t.icon}</span>
              <span className="truncate">{t.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          SUB-TAB 1: ISSUE NEW CERTIFICATE (नया प्रमाण पत्र जारी करें)
         ===================================================================== */}
      {subTab === 'issue' && (
        <div className="space-y-5">
          {justIssuedCert && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span>
                    प्रमाण-पत्र सफलतापूर्वक जारी हुआ! क्रमांक:{' '}
                    <span className="font-mono text-[#0f4d3a] underline">
                      {justIssuedCert.certificateNumber}
                    </span>
                  </span>
                </div>
                <span className="text-xs text-emerald-800 font-semibold">
                  प्राप्तकर्ता: {justIssuedCert.recipientName}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setPreviewModalData({
                      data: certToRenderData(justIssuedCert),
                      template: getTemplateById(justIssuedCert.templateId),
                    })
                  }
                  className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-xs font-bold text-emerald-900 flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview देखें</span>
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => handleDownloadPdf(justIssuedCert)}
                  className="px-3 py-1.5 rounded-lg bg-[#0f4d3a] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF डाउनलोड करें</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePrintCertificate(justIssuedCert)}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>प्रिंट करें</span>
                </button>
                <a
                  href={buildWhatsAppShareUrl(
                    justIssuedCert.mobile,
                    buildWhatsAppShareMessage(justIssuedCert)
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp पर भेजें</span>
                </a>
              </div>
            </div>
          )}

          <form
            onSubmit={handleIssueSubmit}
            className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-6 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
              <div>
                <h5 className="font-heading text-base font-bold text-[#0f4d3a]">
                  नया डिजिटल सम्मान प्रमाण-पत्र जारी करें
                </h5>
                <p className="text-xs text-stone-500">
                  क्रमांक सर्वर द्वारा स्वतः क्रमबद्ध एवं अपरिवर्तनीय बनेगा:{' '}
                  <strong className="font-mono text-[#0f4d3a]">
                    {stats?.nextPredictedNumber || 'PRRT-2026-0001'}
                  </strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenFormPreview('issue')}
                className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-400 text-amber-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Certificate</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  पूरा नाम (Full Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. श्री रमेशचंद्र पाटीदार"
                  value={issueForm.recipientName}
                  onChange={(e) => setIssueForm({ ...issueForm, recipientName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs focus:ring-1 focus:ring-[#0f4d3a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  पिता / पति का नाम (वैकल्पिक)
                </label>
                <input
                  type="text"
                  placeholder="उदा. श्री मोहनलाल जी"
                  value={issueForm.guardianName}
                  onChange={(e) => setIssueForm({ ...issueForm, guardianName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  मोबाइल नंबर (Mobile Number) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10 अंकों का मोबाइल नंबर"
                  value={issueForm.mobile}
                  onChange={(e) => setIssueForm({ ...issueForm, mobile: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-700">
                    प्रमाण-पत्र श्रेणी (Category) *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAddCategory(!showAddCategory)}
                    className="text-[11px] font-bold text-[#0f4d3a] hover:underline cursor-pointer"
                  >
                    + नई श्रेणी जोड़ें
                  </button>
                </div>
                <select
                  value={issueForm.category}
                  onChange={(e) => setIssueForm({ ...issueForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs font-medium"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.nameHi}>
                      {cat.nameHi} {cat.nameEn ? `(${cat.nameEn})` : ''}
                    </option>
                  ))}
                </select>

                {showAddCategory && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="नई कस्टम श्रेणी का नाम लिखें..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-emerald-400 text-xs bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomCategory}
                      className="px-3 py-1.5 rounded-lg bg-[#0f4d3a] text-white text-xs font-bold cursor-pointer"
                    >
                      जोड़ें
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  पता (Address - वैकल्पिक)
                </label>
                <input
                  type="text"
                  placeholder="ग्राम / शहर / जिला"
                  value={issueForm.address}
                  onChange={(e) => setIssueForm({ ...issueForm, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                सेवा / सम्मान का कारण (Reason / Citation) *
              </label>
              <textarea
                rows={2}
                required
                placeholder="उदा. श्री राम आश्रम निर्माण एवं शनिवार महाभंडारा सेवा में विशेष सहयोग"
                value={issueForm.reason}
                onChange={(e) => setIssueForm({ ...issueForm, reason: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  सहयोग / दान राशि (₹ - यदि लागू हो)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="उदा. 5100 (वैकल्पिक)"
                  value={issueForm.amount}
                  onChange={(e) => setIssueForm({ ...issueForm, amount: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  जारी दिनांक (Issue Date) *
                </label>
                <input
                  type="date"
                  required
                  value={issueForm.issueDate}
                  onChange={(e) => setIssueForm({ ...issueForm, issueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  प्रमाण-पत्र की भाषा (Language)
                </label>
                <select
                  value={issueForm.language}
                  onChange={(e) =>
                    setIssueForm({ ...issueForm, language: e.target.value as 'hi' | 'en' })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs"
                >
                  <option value="hi">हिंदी (Hindi - Default)</option>
                  <option value="en">अंग्रेजी (English)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  टेम्पलेट डिज़ाइन (Template)
                </label>
                <select
                  value={issueForm.templateId}
                  onChange={(e) =>
                    setIssueForm({ ...issueForm, templateId: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs"
                >
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-end">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  पदाधिकारी चुनें / हस्ताक्षरकर्ता नाम *
                </label>
                <select
                  value={issueForm.signatoryName}
                  onChange={(e) => {
                    const selected = signatories.find((s) => s.name === e.target.value);
                    setIssueForm({
                      ...issueForm,
                      signatoryName: e.target.value,
                      signatoryDesignation: selected?.designation || issueForm.signatoryDesignation,
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs"
                >
                  {signatories.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  हस्ताक्षरकर्ता पद (Designation) *
                </label>
                <input
                  type="text"
                  required
                  value={issueForm.signatoryDesignation}
                  onChange={(e) =>
                    setIssueForm({ ...issueForm, signatoryDesignation: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  फोटो अपलोड (वैकल्पिक)
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-700 flex items-center justify-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-[#0f4d3a]" />
                    <span>{issueForm.photoUrl ? 'फोटो बदला गया ✓' : 'फोटो चुनें'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, 'issue')}
                      className="hidden"
                    />
                  </label>
                  {issueForm.photoUrl && (
                    <button
                      type="button"
                      onClick={() => setIssueForm({ ...issueForm, photoUrl: '' })}
                      className="px-2.5 py-2 rounded-xl bg-red-50 text-red-700 text-xs font-bold cursor-pointer"
                    >
                      हटाएँ
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => handleOpenFormPreview('issue')}
                className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#0f4d3a]" />
                <span>Preview Certificate</span>
              </button>
              <button
                type="submit"
                disabled={busy}
                className="px-6 py-2.5 rounded-xl bg-[#0f4d3a] hover:bg-[#135943] text-white text-xs sm:text-sm font-bold shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>{busy ? 'सहेजा जा रहा है...' : 'प्रमाण पत्र जारी करें (Issue Certificate)'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 2: ALL ISSUED CERTIFICATES (सभी जारी प्रमाण पत्र)
         ===================================================================== */}
      {subTab === 'all' && (
        <div className="space-y-4">
          {/* Search & Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              <div className="relative lg:col-span-2">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="नाम, प्रमाण-पत्र क्रमांक, या मोबाइल खोजें..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs"
              >
                <option value="all">सभी श्रेणियाँ (All)</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.nameHi}>
                    {cat.nameHi}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs"
              >
                <option value="all">सभी स्थितियाँ</option>
                <option value="valid">वैध (Valid)</option>
                <option value="revoked">रद्द (Revoked)</option>
              </select>

              <button
                type="button"
                onClick={() => CertificateApi.downloadCsv().catch((e) => onNotify(e.message, 'error'))}
                className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>CSV Export</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600">
              <div className="flex items-center gap-1.5">
                <span>दिनांक से:</span>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-stone-300 bg-stone-50 font-mono text-xs"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span>तक:</span>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-stone-300 bg-stone-50 font-mono text-xs"
                />
              </div>
              {(filterDateFrom || filterDateTo || searchTerm || filterCategory !== 'all' || filterStatus !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCategory('all');
                    setFilterStatus('all');
                    setFilterDateFrom('');
                    setFilterDateTo('');
                  }}
                  className="text-xs font-bold text-red-700 hover:underline cursor-pointer"
                >
                  फ़िल्टर साफ़ करें
                </button>
              )}
              <span className="ml-auto font-mono text-xs text-stone-500">
                परिणाम: {filteredCertificates.length}
              </span>
            </div>
          </div>

          {/* Empty State or Table */}
          {filteredCertificates.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-10 text-center space-y-3">
              <Award className="w-10 h-10 text-stone-400 mx-auto" />
              <div className="text-sm font-bold text-stone-800">
                कोई प्रमाण-पत्र रिकॉर्ड नहीं मिला
              </div>
              <p className="text-xs text-stone-500">
                नया डिजिटल सम्मान प्रमाण-पत्र जारी करने के लिए नीचे बटन पर क्लिक करें।
              </p>
              <button
                type="button"
                onClick={() => setSubTab('issue')}
                className="px-4 py-2 rounded-xl bg-[#0f4d3a] text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>पहला प्रमाण पत्र जारी करें</span>
              </button>
            </div>
          ) : (
            <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-3">प्रमाण-पत्र क्र.</th>
                      <th className="py-2.5 px-3">प्राप्तकर्ता व मोबाइल</th>
                      <th className="py-2.5 px-3">श्रेणी</th>
                      <th className="py-2.5 px-3">जारी दिनांक</th>
                      <th className="py-2.5 px-3 text-right">राशि</th>
                      <th className="py-2.5 px-3 text-center">स्थिति</th>
                      <th className="py-2.5 px-3 text-center">कार्रवाई</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredCertificates.map((c) => (
                      <tr key={c.certificateNumber} className="hover:bg-emerald-50/40">
                        <td className="py-2.5 px-3 font-mono font-bold text-[#0f4d3a] tabular-nums whitespace-nowrap">
                          {c.certificateNumber}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-stone-900">{c.recipientName}</div>
                          <div className="text-[11px] font-mono text-stone-500">{c.mobile}</div>
                        </td>
                        <td className="py-2.5 px-3 text-stone-700">{c.category}</td>
                        <td className="py-2.5 px-3 font-mono text-stone-600 tabular-nums whitespace-nowrap">
                          {c.issueDate}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums">
                          {c.amount ? `₹${c.amount.toLocaleString('en-IN')}` : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`text-[11px] font-bold ${
                              c.status === 'valid' ? 'text-emerald-700' : 'text-red-700'
                            }`}
                          >
                            {c.status === 'valid' ? '✓ Valid' : '✕ Revoked'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewModalData({
                                  data: certToRenderData(c),
                                  template: getTemplateById(c.templateId),
                                })
                              }
                              className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                              title="Preview"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => startEditingCertificate(c)}
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 cursor-pointer"
                              title="Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDownloadPdf(c)}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 cursor-pointer"
                              title="Download PDF"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePrintCertificate(c)}
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 cursor-pointer"
                              title="Print A4 Landscape"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveCert(c);
                                setWaPhoneOverride(c.mobile);
                                setSubTab('whatsapp');
                              }}
                              className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 cursor-pointer"
                              title="Share WhatsApp"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>
                            {c.status === 'valid' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setRevokeTargetNo(c.certificateNumber);
                                  setSubTab('revoked');
                                }}
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 cursor-pointer"
                                title="Revoke Certificate"
                              >
                                <Ban className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View */}
              <div className="md:hidden divide-y divide-stone-100">
                {filteredCertificates.map((c) => (
                  <div key={c.certificateNumber} className="p-3.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#0f4d3a]">
                        {c.certificateNumber}
                      </span>
                      <span
                        className={`font-bold ${
                          c.status === 'valid' ? 'text-emerald-700' : 'text-red-700'
                        }`}
                      >
                        {c.status === 'valid' ? '✓ Valid' : '✕ Revoked'}
                      </span>
                    </div>
                    <div className="font-bold text-stone-900 text-sm">{c.recipientName}</div>
                    <div className="text-stone-500">
                      {c.category} · {c.issueDate} · मो: {c.mobile}
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewModalData({
                            data: certToRenderData(c),
                            template: getTemplateById(c.templateId),
                          })
                        }
                        className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 font-semibold cursor-pointer"
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => startEditingCertificate(c)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-semibold cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadPdf(c)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold cursor-pointer"
                      >
                        PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePrintCertificate(c)}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 font-semibold cursor-pointer"
                      >
                        Print
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 3: EDIT CERTIFICATE (प्रमाण पत्र संपादित करें)
         ===================================================================== */}
      {subTab === 'edit' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
            <div>
              <h5 className="font-heading text-base font-bold text-[#0f4d3a]">
                प्रमाण-पत्र विवरण संपादित करें
              </h5>
              <p className="text-xs text-stone-500">
                प्रमाण-पत्र संख्या अपरिवर्तनीय रहती है; शेष सभी विवरण सुरक्षित रूप से संशोधित किए जा सकते हैं।
              </p>
            </div>

            <select
              value={editTargetNo}
              onChange={(e) => {
                const chosen = certificates.find((c) => c.certificateNumber === e.target.value);
                if (chosen) startEditingCertificate(chosen);
              }}
              className="px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs font-mono"
            >
              <option value="">-- संपादन हेतु प्रमाण-पत्र चुनें --</option>
              {certificates.map((c) => (
                <option key={c.certificateNumber} value={c.certificateNumber}>
                  {c.certificateNumber} · {c.recipientName}
                </option>
              ))}
            </select>
          </div>

          {!editTargetNo ? (
            <div className="text-center py-8 text-xs text-stone-500">
              कृपया ऊपर ड्रॉपडाउन से कोई प्रमाण-पत्र चुनें या &ldquo;सभी रिकॉर्ड&rdquo; टैब से Edit दबाएँ।
            </div>
          ) : (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
                <span>
                  अपरिवर्तनीय क्रमांक (Immutable ID):{' '}
                  <strong className="font-mono text-[#0f4d3a]">{editTargetNo}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenFormPreview('edit')}
                  className="px-3 py-1 rounded-lg bg-white border border-amber-300 font-bold text-amber-950 cursor-pointer flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Certificate</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">पूरा नाम *</label>
                  <input
                    type="text"
                    required
                    value={editForm.recipientName}
                    onChange={(e) => setEditForm({ ...editForm, recipientName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">पिता/पति का नाम</label>
                  <input
                    type="text"
                    value={editForm.guardianName}
                    onChange={(e) => setEditForm({ ...editForm, guardianName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">मोबाइल *</label>
                  <input
                    type="tel"
                    required
                    value={editForm.mobile}
                    onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">श्रेणी *</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.nameHi}>
                        {cat.nameHi}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">पता</label>
                  <input
                    type="text"
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">सेवा / सम्मान कारण *</label>
                <textarea
                  rows={2}
                  required
                  value={editForm.reason}
                  onChange={(e) => setEditForm({ ...editForm, reason: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">राशि (₹)</label>
                  <input
                    type="number"
                    value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">दिनांक</label>
                  <input
                    type="date"
                    value={editForm.issueDate}
                    onChange={(e) => setEditForm({ ...editForm, issueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">भाषा</label>
                  <select
                    value={editForm.language}
                    onChange={(e) =>
                      setEditForm({ ...editForm, language: e.target.value as 'hi' | 'en' })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs"
                  >
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">टेम्पलेट</label>
                  <select
                    value={editForm.templateId}
                    onChange={(e) =>
                      setEditForm({ ...editForm, templateId: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs"
                  >
                    {templates.map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">हस्ताक्षरकर्ता नाम</label>
                  <input
                    type="text"
                    required
                    value={editForm.signatoryName}
                    onChange={(e) => setEditForm({ ...editForm, signatoryName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">पद (Designation)</label>
                  <input
                    type="text"
                    required
                    value={editForm.signatoryDesignation}
                    onChange={(e) =>
                      setEditForm({ ...editForm, signatoryDesignation: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">फोटो बदलें</label>
                  <label className="px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{editForm.photoUrl ? 'फोटो संलग्न ✓' : 'फोटो अपलोड'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, 'edit')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  disabled={busy}
                  className="px-5 py-2.5 rounded-xl bg-[#0f4d3a] hover:bg-[#135943] text-white text-xs font-bold cursor-pointer"
                >
                  {busy ? 'अपडेट हो रहा है...' : 'संशोधन सहेजें (Update Certificate)'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 4 & 5: DOWNLOAD PDF / PRINT CERTIFICATE (A4 Landscape)
         ===================================================================== */}
      {(subTab === 'download' || subTab === 'print') && (
        <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h5 className="font-heading text-base font-bold text-[#0f4d3a]">
                {subTab === 'download'
                  ? 'A4 लैंडस्केप प्रमाण-पत्र PDF डाउनलोड'
                  : 'A4 लैंडस्केप प्रमाण-पत्र प्रिंट करें'}
              </h5>
              <p className="text-xs text-stone-500">
                उच्च गुणवत्ता वाला हिंदी यूनिकोड व QR कोड सहित आधिकारिक प्रमाण-पत्र चुनें:
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={activeCert?.certificateNumber || ''}
                onChange={(e) => {
                  const found = certificates.find((c) => c.certificateNumber === e.target.value);
                  if (found) setActiveCert(found);
                }}
                className="px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs font-mono"
              >
                {certificates.map((c) => (
                  <option key={c.certificateNumber} value={c.certificateNumber}>
                    {c.certificateNumber} · {c.recipientName}
                  </option>
                ))}
              </select>

              {activeCert && (
                <>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleDownloadPdf(activeCert)}
                    className="px-4 py-2 rounded-xl bg-[#0f4d3a] hover:bg-[#145e48] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{busy ? 'PDF बन रहा है...' : 'PDF डाउनलोड करें'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePrintCertificate(activeCert)}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>प्रिंट करें (A4 Landscape)</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {activeCert ? (
            <div className="p-3 bg-stone-100 rounded-xl border border-stone-200">
              <ResponsiveCertificatePreview
                data={certToRenderData(activeCert)}
                template={getTemplateById(activeCert.templateId)}
              />
            </div>
          ) : (
            <div className="py-10 text-center text-xs text-stone-500">
              अभी कोई प्रमाण-पत्र जारी नहीं किया गया है।
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 6: WHATSAPP SHARE (WhatsApp पर शेयर करें)
         ===================================================================== */}
      {subTab === 'whatsapp' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h5 className="font-heading text-base font-bold text-[#0f4d3a]">
                WhatsApp पर डिजिटल प्रमाण-पत्र शेयर करें
              </h5>
              <p className="text-xs text-stone-500">
                प्राप्तकर्ता को सीधे डाउनलोड और ऑनलाइन सत्यापन लिंक के साथ संदेश भेजें।
              </p>
            </div>

            <select
              value={selectedShareCert?.certificateNumber || ''}
              onChange={(e) => {
                const found = certificates.find((c) => c.certificateNumber === e.target.value);
                if (found) {
                  setActiveCert(found);
                  setWaPhoneOverride(found.mobile);
                }
              }}
              className="px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs font-mono"
            >
              {certificates.map((c) => (
                <option key={c.certificateNumber} value={c.certificateNumber}>
                  {c.certificateNumber} · {c.recipientName}
                </option>
              ))}
            </select>
          </div>

          {selectedShareCert ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    प्राप्तकर्ता का WhatsApp नंबर (10 अंक)
                  </label>
                  <input
                    type="tel"
                    value={waPhoneOverride || selectedShareCert.mobile}
                    onChange={(e) => setWaPhoneOverride(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    पब्लिक सत्यापन लिंक (Verify Link)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={getCertificateVerifyUrl(selectedShareCert.certificateNumber)}
                      className="flex-1 px-3 py-2 rounded-xl border border-stone-300 bg-stone-100 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyText(
                          'wa_url',
                          getCertificateVerifyUrl(selectedShareCert.certificateNumber)
                        )
                      }
                      className="px-3 py-2 rounded-xl bg-stone-800 text-white text-xs font-bold cursor-pointer"
                    >
                      {copiedKey === 'wa_url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  संदेश टेम्पलेट पूर्वावलोकन (WhatsApp Message):
                </label>
                <pre className="whitespace-pre-wrap p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-stone-800 font-sans leading-relaxed">
                  {shareMessage}
                </pre>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <a
                  href={buildWhatsAppShareUrl(
                    waPhoneOverride || selectedShareCert.mobile,
                    shareMessage
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>WhatsApp पर भेजें</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopyText('wa_msg', shareMessage)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'wa_msg' ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                  <span>पूरा संदेश कॉपी करें</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-xs text-stone-500">
              शेयर करने के लिए पहले कोई प्रमाण-पत्र जारी करें।
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 7: CERTIFICATE VERIFICATION (प्रमाण पत्र सत्यापन)
         ===================================================================== */}
      {subTab === 'verify' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-6 space-y-4">
          <h5 className="font-heading text-base font-bold text-[#0f4d3a]">
            तत्काल प्रमाण-पत्र सत्यापन एवं पब्लिक लिंक जांच
          </h5>
          <p className="text-xs text-stone-600">
            सार्वजनिक सत्यापन पेज (<code className="font-mono">/verify/PRRT-2026-0001</code>) पर केवल
            सुरक्षित विवरण दिखता है; मोबाइल नंबर, पता और दान राशि गोपनीय रहती है।
          </p>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!verifyQuery.trim()) return;
              const res = await CertificateApi.publicVerify(verifyQuery.trim());
              setVerifyCheckResult(res);
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <input
              type="text"
              placeholder="प्रमाण-पत्र क्रमांक दर्ज करें (उदा. PRRT-2026-0001)"
              value={verifyQuery}
              onChange={(e) => setVerifyQuery(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs font-mono uppercase"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#0f4d3a] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>सत्यापित करें</span>
            </button>
          </form>

          {verifyCheckResult && (
            <div
              className={`p-4 rounded-xl border text-xs space-y-2 ${
                verifyCheckResult.found && verifyCheckResult.certificate?.status === 'valid'
                  ? 'bg-emerald-50 border-emerald-300'
                  : 'bg-red-50 border-red-300'
              }`}
            >
              {verifyCheckResult.found ? (
                <>
                  <div className="font-bold text-sm flex items-center justify-between">
                    <span>
                      {verifyCheckResult.certificate.certificateNumber} —{' '}
                      {verifyCheckResult.certificate.recipientName}
                    </span>
                    <span className="uppercase">
                      {verifyCheckResult.certificate.status}
                    </span>
                  </div>
                  <div className="text-stone-700">
                    श्रेणी: {verifyCheckResult.certificate.category} · दिनांक:{' '}
                    {verifyCheckResult.certificate.issueDate} · जारीकर्ता:{' '}
                    {verifyCheckResult.certificate.issuer}
                  </div>
                  {onOpenPublicVerify && (
                    <button
                      type="button"
                      onClick={() =>
                        onOpenPublicVerify(verifyCheckResult.certificate.certificateNumber)
                      }
                      className="px-3 py-1.5 rounded-lg bg-[#0f4d3a] text-white font-bold inline-flex items-center gap-1.5 cursor-pointer mt-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>पब्लिक /verify पेज खोलें</span>
                    </button>
                  )}
                </>
              ) : (
                <div className="font-bold text-red-800">{verifyCheckResult.message}</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 8: TEMPLATE MANAGEMENT (टेम्पलेट मैनेजमेंट)
         ===================================================================== */}
      {subTab === 'templates' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-white border border-stone-200 rounded-2xl p-4 space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-bold text-sm text-[#0f4d3a]">{tpl.name}</div>
                  {tpl.isDefault && (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-stone-600">
                  <span>
                    Primary:{' '}
                    <span
                      className="inline-block w-3 h-3 rounded-xs align-middle border"
                      style={{ backgroundColor: tpl.themePrimary }}
                    />{' '}
                    <code>{tpl.themePrimary}</code>
                  </span>
                  <span>
                    Gold:{' '}
                    <span
                      className="inline-block w-3 h-3 rounded-xs align-middle border"
                      style={{ backgroundColor: tpl.themeGold }}
                    />{' '}
                    <code>{tpl.themeGold}</code>
                  </span>
                </div>
                <p className="text-stone-600 line-clamp-2">{tpl.bodyTemplateHi}</p>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEditingTemplate(tpl)}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 font-bold text-stone-800 cursor-pointer"
                  >
                    संपादित करें
                  </button>
                  {!tpl.isDefault && (
                    <button
                      type="button"
                      onClick={async () => {
                        await CertificateApi.updateTemplate(tpl.id, { isDefault: true });
                        onNotify('डिफ़ॉल्ट टेम्पलेट अपडेट किया गया।', 'success');
                        await loadAllData();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 font-bold text-emerald-800 cursor-pointer"
                    >
                      डिफ़ॉल्ट सेट करें
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {editingTemplate ? (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await CertificateApi.updateTemplate(editingTemplate.id, editingTemplate);
                onNotify('टेम्पलेट सहेजा गया।', 'success');
                setEditingTemplate(null);
                await loadAllData();
              }}
              className="bg-stone-50 border border-stone-300 rounded-2xl p-4 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between font-bold text-sm text-[#0f4d3a]">
                <span>टेम्पलेट संपादन: {editingTemplate.name}</span>
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="text-stone-500 hover:text-stone-900 cursor-pointer"
                >
                  बंद करें
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                  className="px-3 py-2 rounded-lg border bg-white"
                  placeholder="टेम्पलेट नाम"
                />
                <input
                  type="color"
                  value={editingTemplate.themePrimary}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, themePrimary: e.target.value })
                  }
                  className="h-9 w-full rounded-lg border bg-white cursor-pointer"
                />
                <select
                  value={editingTemplate.borderStyle}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, borderStyle: e.target.value })
                  }
                  className="px-3 py-2 rounded-lg border bg-white"
                >
                  <option value="royal_double">Royal Double Border</option>
                  <option value="cultural_arch">Sacred Temple Arch Border</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <textarea
                  rows={2}
                  value={editingTemplate.bodyTemplateHi}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, bodyTemplateHi: e.target.value })
                  }
                  className="px-3 py-2 rounded-lg border bg-white"
                  placeholder="हिंदी संदेश ({category}, {reason})"
                />
                <textarea
                  rows={2}
                  value={editingTemplate.bodyTemplateEn}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, bodyTemplateEn: e.target.value })
                  }
                  className="px-3 py-2 rounded-lg border bg-white"
                  placeholder="English Body ({category}, {reason})"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#0f4d3a] text-white font-bold cursor-pointer"
              >
                टेम्पलेट अपडेट सहेजें
              </button>
            </form>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await CertificateApi.createTemplate(newTemplateForm);
                onNotify('नया टेम्पलेट सहेजा गया।', 'success');
                setNewTemplateForm({ ...newTemplateForm, name: '' });
                await loadAllData();
              }}
              className="bg-white border border-stone-200 rounded-2xl p-4 space-y-3 text-xs"
            >
              <h6 className="font-bold text-sm text-[#0f4d3a]">नया टेम्पलेट बनाएँ</h6>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="टेम्पलेट नाम (उदा. नर्मदा परिक्रमा विशेष)"
                  value={newTemplateForm.name}
                  onChange={(e) => setNewTemplateForm({ ...newTemplateForm, name: e.target.value })}
                  className="px-3 py-2 rounded-lg border bg-stone-50"
                />
                <input
                  type="text"
                  placeholder="हिंदी शीर्षक"
                  value={newTemplateForm.titleHi}
                  onChange={(e) =>
                    setNewTemplateForm({ ...newTemplateForm, titleHi: e.target.value })
                  }
                  className="px-3 py-2 rounded-lg border bg-stone-50"
                />
                <select
                  value={newTemplateForm.borderStyle}
                  onChange={(e) =>
                    setNewTemplateForm({ ...newTemplateForm, borderStyle: e.target.value })
                  }
                  className="px-3 py-2 rounded-lg border bg-stone-50"
                >
                  <option value="royal_double">Royal Double Border</option>
                  <option value="cultural_arch">Sacred Temple Arch</option>
                </select>
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#0f4d3a] text-white font-bold cursor-pointer"
              >
                नया टेम्पलेट जोड़ें
              </button>
            </form>
          )}
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 9: SIGNATORY SETTINGS (हस्ताक्षर एवं पदाधिकारी सेटिंग)
         ===================================================================== */}
      {subTab === 'signatories' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {signatories.map((sig) => (
              <div
                key={sig.id}
                className="bg-white border border-stone-200 rounded-2xl p-4 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#0f4d3a]">{sig.name}</span>
                  {sig.isDefault && (
                    <span className="text-[11px] font-bold text-emerald-700">✓ Default</span>
                  )}
                </div>
                <div className="text-stone-700 font-semibold">{sig.designation}</div>
                <div className="text-stone-500 text-[11px]">मुहर: {sig.sealText}</div>
                <div className="flex gap-2 pt-1">
                  {!sig.isDefault && (
                    <button
                      type="button"
                      onClick={async () => {
                        await CertificateApi.updateSignatory(sig.id, { isDefault: true });
                        onNotify(`${sig.name} को डिफ़ॉल्ट हस्ताक्षरकर्ता सेट किया गया।`, 'success');
                        await loadAllData();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold cursor-pointer"
                    >
                      डिफ़ॉल्ट करें
                    </button>
                  )}
                  {signatories.length > 1 && (
                    <button
                      type="button"
                      onClick={async () => {
                        await CertificateApi.deleteSignatory(sig.id);
                        onNotify('हस्ताक्षरकर्ता हटाया गया।', 'success');
                        await loadAllData();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 font-bold cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await CertificateApi.addSignatory(newSignatory);
              onNotify('नया हस्ताक्षरकर्ता जोड़ा गया।', 'success');
              setNewSignatory({
                name: '',
                designation: '',
                sealText: 'प्रभु रामजी ट्रस्ट · ग्राम गलगाँव',
                isDefault: false,
              });
              await loadAllData();
            }}
            className="bg-white border border-stone-200 rounded-2xl p-4 space-y-3 text-xs"
          >
            <h6 className="font-bold text-sm text-[#0f4d3a]">नया अधिकृत हस्ताक्षरकर्ता जोड़ें</h6>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                placeholder="पदाधिकारी नाम (उदा. श्री गुलाबचंद जी)"
                value={newSignatory.name}
                onChange={(e) => setNewSignatory({ ...newSignatory, name: e.target.value })}
                className="px-3 py-2 rounded-xl border bg-stone-50"
              />
              <input
                type="text"
                required
                placeholder="पद (उदा. अध्यक्ष / सचिव)"
                value={newSignatory.designation}
                onChange={(e) =>
                  setNewSignatory({ ...newSignatory, designation: e.target.value })
                }
                className="px-3 py-2 rounded-xl border bg-stone-50"
              />
              <input
                type="text"
                placeholder="आधिकारिक मुहर टेक्स्ट"
                value={newSignatory.sealText}
                onChange={(e) => setNewSignatory({ ...newSignatory, sealText: e.target.value })}
                className="px-3 py-2 rounded-xl border bg-stone-50"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#0f4d3a] text-white font-bold cursor-pointer"
            >
              पदाधिकारी सहेजें
            </button>
          </form>
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 10: REVOKED CERTIFICATES & AUDIT LOGS (रद्द प्रमाण पत्र)
         ===================================================================== */}
      {subTab === 'revoked' && (
        <div className="space-y-5">
          {/* Soft Revoke Action Box */}
          <form
            onSubmit={handleRevokeSubmit}
            className="bg-red-50/50 border border-red-200 rounded-2xl p-4 space-y-3 text-xs"
          >
            <h6 className="font-bold text-sm text-red-900">
              प्रमाण-पत्र निरस्त करें (Soft Revoke — स्थायी रिकॉर्ड सुरक्षित रहेगा)
            </h6>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                required
                value={revokeTargetNo}
                onChange={(e) => setRevokeTargetNo(e.target.value)}
                className="px-3 py-2 rounded-xl border border-red-200 bg-white font-mono"
              >
                <option value="">-- वैध प्रमाण-पत्र चुनें --</option>
                {validCertificates.map((c) => (
                  <option key={c.certificateNumber} value={c.certificateNumber}>
                    {c.certificateNumber} · {c.recipientName}
                  </option>
                ))}
              </select>
              <input
                type="text"
                required
                placeholder="रद्द करने का स्पष्ट कारण लिखें..."
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                className="sm:col-span-2 px-3 py-2 rounded-xl border border-red-200 bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold cursor-pointer inline-flex items-center gap-1.5"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>प्रमाण-पत्र रद्द (Revoke) चिह्नित करें</span>
            </button>
          </form>

          {/* Revoked List */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-3">
            <h6 className="font-bold text-sm text-stone-900">
              रद्द किए गए प्रमाण-पत्र ({revokedCertificates.length})
            </h6>
            {revokedCertificates.length === 0 ? (
              <p className="text-xs text-stone-500">वर्तमान में कोई रद्द प्रमाण-पत्र नहीं है।</p>
            ) : (
              <div className="space-y-2">
                {revokedCertificates.map((c) => (
                  <div
                    key={c.certificateNumber}
                    className="p-3 rounded-xl bg-red-50/40 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="font-bold text-stone-900">
                        <span className="font-mono text-red-800">{c.certificateNumber}</span> —{' '}
                        {c.recipientName}
                      </div>
                      <div className="text-red-700">
                        कारण: {c.revokedReason} · दिनांक: {c.revokedAt.split('T')[0]} ({c.revokedBy})
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRestoreCertificate(c.certificateNumber)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold inline-flex items-center gap-1 cursor-pointer self-start sm:self-center"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>पुनः वैध करें (Restore)</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Audit Logs Trail */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-3">
            <h6 className="font-bold text-sm text-[#0f4d3a] flex items-center gap-1.5">
              <History className="w-4 h-4" />
              <span>सुरक्षा एवं ऑडिट लॉग्स (Audit Logs)</span>
            </h6>
            <div className="max-h-64 overflow-y-auto divide-y divide-stone-100 text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="font-mono font-bold text-[#0f4d3a]">{log.action}</span>
                    {log.certificateNumber && (
                      <span className="font-mono text-stone-700"> · {log.certificateNumber}</span>
                    )}
                    <span className="text-stone-600"> — {log.details}</span>
                  </div>
                  <div className="font-mono text-[11px] text-stone-400 whitespace-nowrap tabular-nums">
                    {log.actor} · {log.createdAt.replace('T', ' ').slice(0, 19)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          LIVE CERTIFICATE PREVIEW MODAL
         ===================================================================== */}
      {previewModalData && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto no-print">
          <div className="bg-white rounded-2xl max-w-5xl w-full p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div className="font-heading font-bold text-base sm:text-lg text-[#0f4d3a]">
                A4 लैंडस्केप प्रमाण-पत्र पूर्वावलोकन ({previewModalData.data.certificateNumber})
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalData(null)}
                className="px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-bold text-stone-700 cursor-pointer"
              >
                बंद करें ✕
              </button>
            </div>

            <ResponsiveCertificatePreview
              data={previewModalData.data}
              template={previewModalData.template}
            />
          </div>
        </div>
      )}

      {/* =====================================================================
          HIDDEN EXACT 1122x794 A4 LANDSCAPE RENDERER FOR PDF CAPTURE & PRINT
         ===================================================================== */}
      {exportRenderData && (
        <div
          id="printable-a4-certificate-wrapper"
          style={{
            position: 'fixed',
            left: '-9999px',
            top: 0,
            width: '1122px',
            height: '794px',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        >
          <div ref={pdfCaptureRef} id="printable-a4-certificate">
            <CertificateCanvas
              data={exportRenderData.data}
              template={exportRenderData.template}
            />
          </div>
        </div>
      )}
    </div>
  );
};
