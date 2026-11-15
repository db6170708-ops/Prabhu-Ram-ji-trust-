import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Award,
  CheckCircle2,
  Crosshair,
  Download,
  ExternalLink,
  Eye,
  FileDown,
  FileSpreadsheet,
  History,
  Image as ImageIcon,
  Landmark,
  Loader2,
  Lock,
  Power,
  QrCode,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Ticket,
  Upload,
  Webhook,
  X,
} from 'lucide-react';
import {
  exportCouponDomToPdf,
  exportCouponDomToPdf as exportPdf,
  exportCouponDomToPng,
  generateStarterCouponArtworkDataUrl,
  LuckyDrawApi,
} from '../../utils/luckyDrawApi';
import {
  LuckyDrawCoupon,
  LuckyDrawDashboardData,
  LuckyDrawSample,
} from '../../types/luckyDraw';
import { CouponRenderer } from './CouponRenderer';

interface LuckyDrawAdminModuleProps {
  onNotify: (text: string, type?: 'success' | 'error') => void;
  onOpenPublicCouponVerify?: (couponNo: string) => void;
}

export const LuckyDrawAdminModule: React.FC<LuckyDrawAdminModuleProps> = ({
  onNotify,
  onOpenPublicCouponVerify,
}) => {
  const [subTab, setSubTab] = useState<'controls' | 'sample' | 'records' | 'audit'>('controls');
  const [dashboard, setDashboard] = useState<LuckyDrawDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  // Compliance & Live Gateway Form State
  const [ticketPrice, setTicketPrice] = useState('200');
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignSubtitle, setCampaignSubtitle] = useState('');
  const [paymentGatewayMode, setPaymentGatewayMode] = useState<'test' | 'live'>('test');
  const [paymentProvider, setPaymentProvider] = useState('razorpay');
  const [kycVerified, setKycVerified] = useState(false);
  const [legalPermissionVerified, setLegalPermissionVerified] = useState(false);
  const [webhookVerified, setWebhookVerified] = useState(false);
  const [webhookSecretInput, setWebhookSecretInput] = useState('');
  const [bankVerified, setBankVerified] = useState(false);

  // Final Live Confirmation Popup
  const [showLiveConfirmModal, setShowLiveConfirmModal] = useState(false);
  const [confirmCheckbox, setConfirmCheckbox] = useState(false);

  // Sample Engine Form State
  const [sampleName, setSampleName] = useState('आधिकारिक लकी ड्रॉ कूपन 2026');
  const [sampleFileType, setSampleFileType] = useState<'image' | 'pdf'>('image');
  const [sampleDataUrl, setSampleDataUrl] = useState('');
  const [sampleWidth, setSampleWidth] = useState(1100);
  const [sampleHeight, setSampleHeight] = useState(460);
  const [numberPrefix, setNumberPrefix] = useState('PRRT-LD-2026-');
  const [padLength, setPadLength] = useState(4);
  const [startNumber, setStartNumber] = useState(1);
  const [serialXPct, setSerialXPct] = useState(79);
  const [serialYPct, setSerialYPct] = useState(26);
  const [serialFontSize, setSerialFontSize] = useState(24);
  const [serialColor, setSerialColor] = useState('#0f4d3a');
  const [nameXPct, setNameXPct] = useState(46);
  const [nameYPct, setNameYPct] = useState(57);
  const [nameFontSize, setNameFontSize] = useState(22);
  const [nameColor, setNameColor] = useState('#1c1917');
  const [showQr, setShowQr] = useState(true);
  const [qrXPct, setQrXPct] = useState(86);
  const [qrYPct, setQrYPct] = useState(70);
  const [qrSizePx, setQrSizePx] = useState(76);
  const [placementTarget, setPlacementTarget] = useState<'serial' | 'name' | 'qr'>('serial');

  // Preview & Record Modals
  const [showTestPreviewModal, setShowTestPreviewModal] = useState(false);
  const [previewCoupon, setPreviewCoupon] = useState<LuckyDrawCoupon | null>(null);
  const [couponSearch, setCouponSearch] = useState('');
  const testCouponRef = useRef<HTMLDivElement>(null);
  const issuedCouponRef = useRef<HTMLDivElement>(null);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const data = await LuckyDrawApi.getDashboard();
      setDashboard(data);

      // Sync compliance fields
      setTicketPrice(String(data.settings.ticketPrice || 200));
      setCampaignTitle(data.settings.campaignTitle);
      setCampaignSubtitle(data.settings.campaignSubtitle);
      setPaymentGatewayMode(data.settings.paymentGatewayMode);
      setPaymentProvider(data.settings.paymentProvider || 'razorpay');
      setKycVerified(data.settings.kycVerified);
      setLegalPermissionVerified(data.settings.legalPermissionVerified);
      setWebhookVerified(data.settings.webhookVerified);
      setBankVerified(data.settings.bankVerified);

      // Sync active sample fields if not actively editing blank state
      if (data.activeSample && !sampleDataUrl) {
        syncFormFromSample(data.activeSample);
      }
    } catch (err: any) {
      onNotify(err?.message || 'लकी ड्रॉ डैशबोर्ड लोड करने में त्रुटि हुई।', 'error');
    } finally {
      setLoading(false);
    }
  };

  const syncFormFromSample = (s: LuckyDrawSample) => {
    setSampleName(s.name);
    setSampleFileType(s.sampleFileType);
    setSampleDataUrl(s.sampleDataUrl);
    setSampleWidth(s.widthPx);
    setSampleHeight(s.heightPx);
    setNumberPrefix(s.numberPrefix);
    setPadLength(s.padLength);
    setStartNumber(s.startNumber);
    setSerialXPct(s.serialXPct);
    setSerialYPct(s.serialYPct);
    setSerialFontSize(s.serialFontSize);
    setSerialColor(s.serialColor);
    setNameXPct(s.nameXPct);
    setNameYPct(s.nameYPct);
    setNameFontSize(s.nameFontSize);
    setNameColor(s.nameColor);
    setShowQr(s.showQr);
    setQrXPct(s.qrXPct);
    setQrYPct(s.qrYPct);
    setQrSizePx(s.qrSizePx);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleSaveCompliance = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await LuckyDrawApi.updateCompliance({
        ticketPrice: Math.max(1, Number(ticketPrice) || 200),
        campaignTitle: campaignTitle.trim(),
        campaignSubtitle: campaignSubtitle.trim(),
        paymentGatewayMode,
        paymentProvider,
        kycVerified,
        legalPermissionVerified,
        webhookVerified,
        webhookSecret: webhookSecretInput.trim() || undefined,
        bankVerified,
      });
      setWebhookSecretInput('');
      onNotify(res.message, 'success');
      await loadDashboard();
    } catch (err: any) {
      onNotify(err?.message || 'सेटिंग्स सहेजने में त्रुटि हुई।', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleToggleControl = async (
    field: 'homepageVisibility' | 'bookingEnabled' | 'autoCouponGeneration',
    nextVal: boolean
  ) => {
    setBusy(true);
    try {
      const res = await LuckyDrawApi.updateControls({ [field]: nextVal });
      onNotify(res.message, 'success');
      await loadDashboard();
    } catch (err: any) {
      onNotify(err?.message || 'नियंत्रण बदलने में त्रुटि हुई।', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleTurnOffMaster = async () => {
    setBusy(true);
    try {
      const res = await LuckyDrawApi.updateControls({
        masterEnabled: false,
        homepageVisibility: false,
        bookingEnabled: false,
        autoCouponGeneration: false,
      });
      onNotify(res.message, 'success');
      await loadDashboard();
    } catch (err: any) {
      onNotify(err?.message || 'सिस्टम बंद करने में त्रुटि हुई।', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleConfirmLiveActivation = async () => {
    if (!confirmCheckbox) {
      onNotify('कृपया लाइव एक्टिवेशन की अंतिम पुष्टि चेकबॉक्स पर टिक करें।', 'error');
      return;
    }
    setBusy(true);
    try {
      const res = await LuckyDrawApi.activateLiveSystem(true);
      setShowLiveConfirmModal(false);
      setConfirmCheckbox(false);
      onNotify(res.message, 'success');
      await loadDashboard();
    } catch (err: any) {
      onNotify(err?.message || 'लकी ड्रॉ लाइव करने में त्रुटि हुई।', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleSampleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/');
    if (!isPdf && !isImage) {
      onNotify('कृपया केवल PNG / JPG / WEBP इमेज या PDF फ़ाइल अपलोड करें।', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = String(ev.target?.result || '');
      if (isPdf) {
        setSampleFileType('pdf');
        setSampleDataUrl(result);
        setSampleWidth(1050);
        setSampleHeight(440);
        onNotify('PDF कूपन सैंपल लोड हो गया। कोऑर्डिनेट सेट कर "अपलोड व सेट करें" दबाएँ।', 'success');
      } else {
        const img = new window.Image();
        img.src = result;
        img.onload = () => {
          setSampleFileType('image');
          setSampleWidth(img.naturalWidth || 1000);
          setSampleHeight(img.naturalHeight || 420);
          setSampleDataUrl(result);
          onNotify(`इमेज सैंपल (${img.naturalWidth}×${img.naturalHeight}px) लोड हो गया!`, 'success');
        };
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateStarterArtwork = () => {
    const url = generateStarterCouponArtworkDataUrl(
      campaignTitle || 'प्रभु रामजी ट्रस्ट · सेवा लकी ड्रॉ कूपन 2026'
    );
    if (url) {
      setSampleFileType('image');
      setSampleDataUrl(url);
      setSampleWidth(1100);
      setSampleHeight(460);
      setSerialXPct(79);
      setSerialYPct(26);
      setNameXPct(46);
      setNameYPct(57);
      setQrXPct(86);
      setQrYPct(70);
      onNotify('ट्रस्ट का आधिकारिक स्टार्टर कूपन आर्टवर्क तैयार किया गया!', 'success');
    }
  };

  const handleCanvasCoordinateClick = (xPct: number, yPct: number) => {
    if (placementTarget === 'serial') {
      setSerialXPct(xPct);
      setSerialYPct(yPct);
    } else if (placementTarget === 'name') {
      setNameXPct(xPct);
      setNameYPct(yPct);
    } else {
      setQrXPct(xPct);
      setQrYPct(yPct);
    }
  };

  const handleUploadNewSample = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sampleDataUrl) {
      onNotify('कृपया पहले कूपन सैंपल इमेज/PDF अपलोड करें या स्टार्टर आर्टवर्क जनरेट करें।', 'error');
      return;
    }
    setBusy(true);
    try {
      const uniqueName =
        dashboard?.samples.some((s) => s.name === sampleName.trim())
          ? `${sampleName.trim()} (${new Date().toLocaleTimeString('en-GB', { hour12: false })})`
          : sampleName.trim();
      const res = await LuckyDrawApi.uploadSample({
        name: uniqueName,
        sampleFileType,
        sampleDataUrl,
        widthPx: sampleWidth,
        heightPx: sampleHeight,
        numberPrefix: numberPrefix.trim() || 'PRRT-LD-2026-',
        padLength,
        startNumber,
        serialXPct,
        serialYPct,
        serialFontSize,
        serialColor,
        nameXPct,
        nameYPct,
        nameFontSize,
        nameColor,
        showQr,
        qrXPct,
        qrYPct,
        qrSizePx,
        setActive: true,
      });
      onNotify(res.message, 'success');
      await loadDashboard();
    } catch (err: any) {
      onNotify(err?.message || 'सैंपल अपलोड करने में त्रुटि हुई।', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateActiveSampleCoordinates = async () => {
    if (!dashboard?.activeSample) return;
    setBusy(true);
    try {
      const res = await LuckyDrawApi.updateSample(dashboard.activeSample.id, {
        numberPrefix: numberPrefix.trim() || 'PRRT-LD-2026-',
        padLength,
        startNumber,
        serialXPct,
        serialYPct,
        serialFontSize,
        serialColor,
        nameXPct,
        nameYPct,
        nameFontSize,
        nameColor,
        showQr,
        qrXPct,
        qrYPct,
        qrSizePx,
      });
      onNotify(res.message, 'success');
      await loadDashboard();
    } catch (err: any) {
      onNotify(err?.message || 'कोऑर्डिनेट्स अपडेट करने में त्रुटि हुई।', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleActivateSampleById = async (id: number) => {
    setBusy(true);
    try {
      const res = await LuckyDrawApi.activateSample(id);
      onNotify(res.message, 'success');
      const target = dashboard?.samples.find((s) => s.id === id);
      if (target) syncFormFromSample(target);
      await loadDashboard();
    } catch (err: any) {
      onNotify(err?.message || 'सैंपल सक्रिय करने में त्रुटि हुई।', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleIssueCatchupCoupon = async (orderId: string) => {
    setBusy(true);
    try {
      const res = await LuckyDrawApi.issueCouponForPayment(orderId);
      onNotify(res.message, 'success');
      await loadDashboard();
    } catch (err: any) {
      onNotify(err?.message || 'कूपन जारी करने में त्रुटि हुई।', 'error');
    } finally {
      setBusy(false);
    }
  };

  const testPreviewSerial = `${numberPrefix || 'PRRT-LD-2026-'}${String(startNumber || 1).padStart(
    padLength || 4,
    '0'
  )}`;

  const renderConfig = {
    sampleFileType,
    sampleDataUrl,
    widthPx: sampleWidth,
    heightPx: sampleHeight,
    serialXPct,
    serialYPct,
    serialFontSize,
    serialColor,
    nameXPct,
    nameYPct,
    nameFontSize,
    nameColor,
    showQr,
    qrXPct,
    qrYPct,
    qrSizePx,
  };

  if (loading && !dashboard) {
    return (
      <div className="py-12 flex flex-col items-center justify-center gap-3 text-stone-500">
        <Loader2 className="w-7 h-7 animate-spin text-[#0f4d3a]" />
        <span className="text-xs font-semibold">लकी ड्रॉ नियंत्रण कक्ष लोड हो रहा है...</span>
      </div>
    );
  }

  const stats = dashboard?.stats;
  const settings = dashboard?.settings;
  const readiness = dashboard?.readiness;

  const filteredCoupons = (dashboard?.coupons || []).filter((c) => {
    if (!couponSearch.trim()) return true;
    const q = couponSearch.trim().toLowerCase();
    return (
      c.couponNumber.toLowerCase().includes(q) ||
      c.buyerName.toLowerCase().includes(q) ||
      c.buyerMobile.includes(q) ||
      c.orderId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      {/* Real-Time Status Overview Strip (All 8 Required Admin Stats) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div
          className={`p-3 rounded-2xl border ${
            stats?.systemStatus === 'ON'
              ? 'bg-emerald-50 border-emerald-300'
              : 'bg-stone-100 border-stone-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase text-stone-500 block">System Status</span>
          <div className="flex items-center justify-between mt-1">
            <span
              className={`text-lg font-extrabold font-mono ${
                stats?.systemStatus === 'ON' ? 'text-emerald-700' : 'text-red-700'
              }`}
            >
              {stats?.systemStatus || 'OFF'}
            </span>
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                stats?.systemStatus === 'ON' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
              }`}
            />
          </div>
        </div>

        <div className="p-3 rounded-2xl border bg-amber-50/70 border-amber-200">
          <span className="text-[10px] font-bold uppercase text-amber-800 block">
            Active Coupon Sample
          </span>
          <div className="flex items-center justify-between gap-2 mt-1">
            <span className="text-sm font-extrabold text-[#0f4d3a]">
              {stats?.activeSampleStatus === 'Uploaded' ? 'Uploaded ✓' : 'Not Set'}
            </span>
            {dashboard?.activeSample && dashboard.activeSample.sampleFileType === 'image' && (
              <img
                src={dashboard.activeSample.sampleDataUrl}
                alt="Sample Thumb"
                className="w-10 h-6 object-cover rounded border border-amber-400"
              />
            )}
          </div>
          {dashboard?.activeSample && (
            <span className="text-[10px] font-mono text-stone-600 block truncate mt-0.5">
              {dashboard.activeSample.nextPreviewNumber}
            </span>
          )}
        </div>

        <div className="p-3 rounded-2xl border bg-white border-stone-200">
          <span className="text-[10px] font-bold uppercase text-stone-500 block">Homepage / Booking</span>
          <div className="text-xs font-bold mt-1 space-y-0.5">
            <div className="flex justify-between">
              <span className="text-stone-500">Homepage:</span>
              <span className={stats?.homepageStatus === 'Visible' ? 'text-emerald-700' : 'text-stone-600'}>
                {stats?.homepageStatus || 'Hidden'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Booking:</span>
              <span className={stats?.bookingStatus === 'Enabled' ? 'text-emerald-700' : 'text-stone-600'}>
                {stats?.bookingStatus || 'Disabled'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-2xl border bg-white border-stone-200">
          <span className="text-[10px] font-bold uppercase text-stone-500 block">Gateway / Generation</span>
          <div className="text-xs font-bold mt-1 space-y-0.5">
            <div className="flex justify-between">
              <span className="text-stone-500">Gateway:</span>
              <span className={stats?.paymentGateway === 'Live' ? 'text-emerald-700' : 'text-amber-700'}>
                {stats?.paymentGateway || 'Test'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Auto-Gen:</span>
              <span className={stats?.couponGeneration === 'Enabled' ? 'text-emerald-700' : 'text-stone-600'}>
                {stats?.couponGeneration || 'Disabled'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue & Volume Counter Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <div className="p-3 rounded-2xl bg-[#0f4d3a]/5 border border-emerald-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-900 block">Total Coupons Generated</span>
            <span className="text-xl font-extrabold font-mono text-[#0f4d3a]">
              {stats?.totalCouponsGenerated || 0}
            </span>
          </div>
          <Ticket className="w-6 h-6 text-emerald-700 opacity-75" />
        </div>
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-900 block">Total Successful Payments</span>
            <span className="text-xl font-extrabold font-mono text-amber-900">
              {stats?.totalSuccessfulPayments || 0}
            </span>
          </div>
          <CheckCircle2 className="w-6 h-6 text-amber-600 opacity-75" />
        </div>
        <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-stone-600 block">कुल सत्यापित राशि</span>
            <span className="text-xl font-extrabold font-mono text-stone-900">
              ₹{(stats?.totalCollectedAmount || 0).toLocaleString('en-IN')}
            </span>
          </div>
          <button
            type="button"
            onClick={loadDashboard}
            className="p-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 cursor-pointer"
            title="रीफ्रेश करें"
          >
            <RefreshCw className={`w-4 h-4 text-stone-700 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Sub-Navigation Pills */}
      <div className="flex flex-wrap gap-1.5 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
        <button
          type="button"
          onClick={() => setSubTab('controls')}
          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
            subTab === 'controls'
              ? 'bg-[#0f4d3a] text-white shadow-xs'
              : 'text-stone-700 hover:bg-white'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>LUCKY DRAW LIVE CONTROL</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('sample')}
          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
            subTab === 'sample'
              ? 'bg-[#0f4d3a] text-white shadow-xs'
              : 'text-stone-700 hover:bg-white'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Coupon Sample & Template Setup</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('records')}
          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
            subTab === 'records'
              ? 'bg-[#0f4d3a] text-white shadow-xs'
              : 'text-stone-700 hover:bg-white'
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>कूपन व भुगतान ({dashboard?.coupons.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('audit')}
          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
            subTab === 'audit'
              ? 'bg-[#0f4d3a] text-white shadow-xs'
              : 'text-stone-700 hover:bg-white'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>ऑडिट लॉग ({dashboard?.auditLogs.length || 0})</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* SUBTAB 1: LUCKY DRAW LIVE CONTROL & 6-CONDITION ACTIVATION VALIDATOR */}
      {/* ===================================================================== */}
      {subTab === 'controls' && settings && readiness && (
        <div className="space-y-5">
          {/* Master Action Banner */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              settings.masterEnabled
                ? 'bg-emerald-50 border-emerald-400'
                : 'bg-stone-50 border-stone-300'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                    settings.masterEnabled
                      ? 'bg-emerald-600 text-white'
                      : 'bg-red-600 text-white'
                  }`}
                >
                  {settings.masterEnabled ? 'LIVE (ON)' : 'DEFAULT OFF (SAFE MODE)'}
                </span>
                {settings.activatedAt && settings.masterEnabled && (
                  <span className="text-[11px] text-emerald-800">
                    सक्रिय: {new Date(settings.activatedAt).toLocaleString('hi-IN')}
                  </span>
                )}
              </div>
              <h4 className="font-heading text-lg font-bold text-[#0f4d3a]">
                मुख्य लकी ड्रॉ सिस्टम नियंत्रण (Master Switch)
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {settings.masterEnabled
                  ? 'सिस्टम वर्तमान में लाइव है। आपात स्थिति में आप एक क्लिक में सिस्टम को सुरक्षित रूप से OFF कर सकते हैं — पुराने कूपन व भुगतान सुरक्षित रहेंगे।'
                  : 'डिफ़ॉल्ट रूप से पूरा सिस्टम OFF है। सभी 6 अनिवार्य शर्तें पूर्ण किए बिना कोई भी सार्वजनिक बुकिंग या कूपन निर्माण चालू नहीं होगा।'}
              </p>
            </div>

            <div className="shrink-0">
              {settings.masterEnabled ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleTurnOffMaster}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow cursor-pointer"
                >
                  <Power className="w-4 h-4" />
                  <span>लकी ड्रॉ सिस्टम OFF करें</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setShowLiveConfirmModal(true)}
                  className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow cursor-pointer transition-all ${
                    readiness.ready
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      : 'bg-amber-500 hover:bg-amber-600 text-stone-950'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>ACTIVATE LUCKY DRAW</span>
                </button>
              )}
            </div>
          </div>

          {/* 3 Granular Toggle Controls */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
            <h5 className="font-bold text-sm text-[#0f4d3a] flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-600" />
              <span>स्वतंत्र लाइव नियंत्रण (3-Layer Granular Server Controls)</span>
            </h5>

            <div className="grid sm:grid-cols-3 gap-3">
              {/* Control A */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-stone-900">
                    A. Homepage Visibility Control
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1">
                    केवल ON करने पर वेबसाइट के डोनेशन QR सेक्शन के नीचे लकी ड्रॉ सेक्शन दिखाई देगा।
                  </p>
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => handleToggleControl('homepageVisibility', !settings.homepageVisibility)}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    settings.homepageVisibility && settings.masterEnabled
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-200 text-stone-800 hover:bg-stone-300'
                  }`}
                >
                  {settings.homepageVisibility && settings.masterEnabled
                    ? 'VISIBLE (ON) · बंद करें'
                    : 'HIDDEN (OFF) · चालू करें'}
                </button>
              </div>

              {/* Control B */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-stone-900">
                    B. Coupon Booking Control
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1">
                    OFF रहने पर होमपेज दिखने के बावजूद कोई नई बुकिंग / पेमेंट ऑर्डर स्वीकार नहीं होगा (403 Block)।
                  </p>
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => handleToggleControl('bookingEnabled', !settings.bookingEnabled)}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    settings.bookingEnabled && settings.masterEnabled
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-200 text-stone-800 hover:bg-stone-300'
                  }`}
                >
                  {settings.bookingEnabled && settings.masterEnabled
                    ? 'BOOKING OPEN · बंद करें'
                    : 'BOOKING BLOCKED · चालू करें'}
                </button>
              </div>

              {/* Control C */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-stone-900">
                    C. Automatic Coupon Generation
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1">
                    OFF होने पर सत्यापित भुगतान सुरक्षित सेव रहेगा, पर नया कूपन स्वतः जारी नहीं होगा।
                  </p>
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    handleToggleControl('autoCouponGeneration', !settings.autoCouponGeneration)
                  }
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    settings.autoCouponGeneration && settings.masterEnabled
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-200 text-stone-800 hover:bg-stone-300'
                  }`}
                >
                  {settings.autoCouponGeneration && settings.masterEnabled
                    ? 'AUTO-GEN ON · बंद करें'
                    : 'AUTO-GEN OFF · चालू करें'}
                </button>
              </div>
            </div>
          </div>

          {/* 6 Mandatory Readiness Checklist */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h5 className="font-bold text-sm text-amber-950 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>6 अनिवार्य सुरक्षा व लाइव सत्यापन शर्तें (Server Enforced)</span>
              </h5>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  readiness.ready
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}
              >
                {readiness.ready ? 'सभी 6 शर्तें पूर्ण' : `${readiness.missing.length} शर्तें शेष`}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-2 text-xs">
              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  dashboard?.activeSample
                    ? 'bg-white border-emerald-200 text-emerald-900'
                    : 'bg-white border-red-200 text-red-800'
                }`}
              >
                {dashboard?.activeSample ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                )}
                <span>1. सक्रिय कूपन सैंपल अपलोड ({dashboard?.activeSample ? 'तैयार' : 'अपूर्ण'})</span>
              </div>

              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  settings.kycVerified && settings.legalPermissionVerified
                    ? 'bg-white border-emerald-200 text-emerald-900'
                    : 'bg-white border-red-200 text-red-800'
                }`}
              >
                {settings.kycVerified && settings.legalPermissionVerified ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                )}
                <span>2. ट्रस्ट KYC व कानूनी अनुमतियाँ सत्यापित</span>
              </div>

              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  settings.paymentGatewayMode === 'live'
                    ? 'bg-white border-emerald-200 text-emerald-900'
                    : 'bg-white border-red-200 text-red-800'
                }`}
              >
                {settings.paymentGatewayMode === 'live' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                )}
                <span>3. पेमेंट गेटवे Live Mode ({settings.paymentGatewayMode.toUpperCase()})</span>
              </div>

              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  settings.webhookVerified && settings.hasWebhookSecret
                    ? 'bg-white border-emerald-200 text-emerald-900'
                    : 'bg-white border-red-200 text-red-800'
                }`}
              >
                {settings.webhookVerified && settings.hasWebhookSecret ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                )}
                <span>
                  4. वास्तविक Webhook Secret व Verification{' '}
                  {settings.hasWebhookSecret ? `(${settings.webhookSecretMasked})` : ''}
                </span>
              </div>

              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  settings.bankVerified
                    ? 'bg-white border-emerald-200 text-emerald-900'
                    : 'bg-white border-red-200 text-red-800'
                }`}
              >
                {settings.bankVerified ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                )}
                <span>5. IDBI बैंक खाता (1285104000034520) पुष्टि</span>
              </div>

              <div className="p-2.5 rounded-xl border bg-white border-stone-200 text-stone-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>6. सुपर एडमिन अंतिम Live Confirmation पॉपअप</span>
              </div>
            </div>
          </div>

          {/* Compliance, Gateway & Webhook Setup Form */}
          <form
            onSubmit={handleSaveCompliance}
            className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-4"
          >
            <h5 className="font-bold text-sm text-[#0f4d3a] border-b border-stone-100 pb-2">
              KYC, पेमेंट गेटवे व अभियान सेटिंग्स कॉन्फ़िगर करें
            </h5>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  लकी ड्रॉ अभियान शीर्षक (Campaign Title)
                </label>
                <input
                  type="text"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  कूपन मूल्य (₹ INR)
                </label>
                <input
                  type="number"
                  min={1}
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  उपशीर्षक / सेवा विवरण (Subtitle)
                </label>
                <input
                  type="text"
                  value={campaignSubtitle}
                  onChange={(e) => setCampaignSubtitle(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Payment Gateway Mode
                </label>
                <select
                  value={paymentGatewayMode}
                  onChange={(e) => setPaymentGatewayMode(e.target.value as 'test' | 'live')}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold"
                >
                  <option value="test">Test Mode (परीक्षण मोड)</option>
                  <option value="live">Live Mode (वास्तविक भुगतान)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Payment Provider
                </label>
                <select
                  value={paymentProvider}
                  onChange={(e) => setPaymentProvider(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                >
                  <option value="razorpay">Razorpay + UPI Webhook</option>
                  <option value="cashfree">Cashfree Payment Gateway</option>
                  <option value="phonepe_upi">Trust PhonePe Business / Direct UPI</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                  <Webhook className="w-3.5 h-3.5 text-emerald-700" />
                  <span>
                    HMAC Webhook Secret Key (कम से कम 8 अक्षर){' '}
                    {settings.hasWebhookSecret ? `· सहेजी गई: ${settings.webhookSecretMasked}` : ''}
                  </span>
                </label>
                <input
                  type="password"
                  placeholder={
                    settings.hasWebhookSecret
                      ? 'नई कुंजी बदलने हेतु लिखें (खाली छोड़ें तो पुरानी सुरक्षित रहेगी)'
                      : 'उदा. prt_live_whsec_2026_galgaon'
                  }
                  value={webhookSecretInput}
                  onChange={(e) => setWebhookSecretInput(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-2.5 pt-1 text-xs">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={kycVerified}
                  onChange={(e) => setKycVerified(e.target.checked)}
                  className="w-4 h-4 accent-[#0f4d3a]"
                />
                <span className="font-semibold text-stone-800">ट्रस्ट PAN / DARPAN / KYC दस्तावेज़ सत्यापित हैं</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={legalPermissionVerified}
                  onChange={(e) => setLegalPermissionVerified(e.target.checked)}
                  className="w-4 h-4 accent-[#0f4d3a]"
                />
                <span className="font-semibold text-stone-800">कानूनी अनुमतियाँ व ट्रस्ट नियम स्वीकृत हैं</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={webhookVerified}
                  onChange={(e) => setWebhookVerified(e.target.checked)}
                  className="w-4 h-4 accent-[#0f4d3a]"
                />
                <span className="font-semibold text-stone-800">HMAC SHA-256 Webhook सत्यापन सक्षम करें</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bankVerified}
                  onChange={(e) => setBankVerified(e.target.checked)}
                  className="w-4 h-4 accent-[#0f4d3a]"
                />
                <span className="font-semibold text-stone-800 flex items-center gap-1">
                  <Landmark className="w-3.5 h-3.5 text-emerald-700" />
                  <span>IDBI बैंक खाता (1285104000034520) सत्यापित</span>
                </span>
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={busy}
                className="px-5 py-2.5 rounded-xl bg-[#0f4d3a] hover:bg-[#125843] text-white font-bold text-xs cursor-pointer shadow"
              >
                {busy ? 'सहेजा जा रहा है...' : 'अनुपालन व गेटवे सेटिंग्स सहेजें'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUBTAB 2: DYNAMIC COUPON SAMPLE UPLOAD & COORDINATE NUMBERING ENGINE  */}
      {/* ===================================================================== */}
      {subTab === 'sample' && (
        <div className="space-y-5">
          <form
            onSubmit={handleUploadNewSample}
            className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div>
                <h4 className="font-bold text-sm text-[#0f4d3a]">
                  कूपन सैंपल डिज़ाइन अपलोड एवं कोऑर्डिनेट इंजन
                </h4>
                <p className="text-[11px] text-stone-500">
                  अपना कस्टम कूपन डिज़ाइन (PNG/JPG/WEBP/PDF) अपलोड करें और सीरियल नंबर, नाम व QR कोड का सटीक स्थान तय करें।
                </p>
              </div>
              <button
                type="button"
                onClick={handleGenerateStarterArtwork}
                className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs border border-amber-300 cursor-pointer shrink-0"
              >
                + स्टार्टर कूपन आर्टवर्क बनाएं
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  सैंपल का नाम
                </label>
                <input
                  type="text"
                  value={sampleName}
                  onChange={(e) => setSampleName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  सीरियल उपसर्ग (Prefix)
                </label>
                <input
                  type="text"
                  value={numberPrefix}
                  onChange={(e) => setNumberPrefix(e.target.value)}
                  placeholder="PRRT-LD-2026-"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  अंक लंबाई (Digits / Padding)
                </label>
                <input
                  type="number"
                  min={2}
                  max={8}
                  value={padLength}
                  onChange={(e) => setPadLength(Number(e.target.value) || 4)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  प्रारंभिक संख्या (Start Number)
                </label>
                <input
                  type="number"
                  min={1}
                  value={startNumber}
                  onChange={(e) => setStartNumber(Number(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            {/* File Picker */}
            <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-stone-50 border border-dashed border-stone-300">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0f4d3a] hover:bg-[#125843] text-white text-xs font-bold cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>कूपन सैंपल फ़ाइल चुनें (PNG/JPG/PDF)</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,application/pdf"
                  onChange={handleSampleFileUpload}
                  className="hidden"
                />
              </label>
              <span className="text-[11px] text-stone-600 font-mono">
                {sampleDataUrl
                  ? `लोड किया गया प्रकार: ${sampleFileType.toUpperCase()} (${sampleWidth}×${sampleHeight}px) · अगला क्रमांक: ${testPreviewSerial}`
                  : 'अभी कोई सैंपल फ़ाइल लोड नहीं की गई है।'}
              </span>
            </div>

            {/* Coordinate Placement Toolbar & Live Interactive Canvas */}
            {sampleDataUrl && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                    <Crosshair className="w-4 h-4 text-emerald-700" />
                    <span>क्लिक करके स्थान चुनें (Click on Coupon):</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(['serial', 'name', 'qr'] as const).map((target) => (
                      <button
                        key={target}
                        type="button"
                        onClick={() => setPlacementTarget(target)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                          placementTarget === target
                            ? 'bg-[#0f4d3a] text-white'
                            : 'bg-white text-stone-700 border border-stone-300'
                        }`}
                      >
                        {target === 'serial'
                          ? 'सीरियल नंबर स्थान'
                          : target === 'name'
                          ? 'ग्राहक नाम स्थान'
                          : 'QR कोड स्थान'}
                      </button>
                    ))}
                  </div>
                </div>

                <CouponRenderer
                  config={renderConfig}
                  couponNumber={testPreviewSerial}
                  buyerName="श्री रामेश्वर शर्मा (परीक्षण)"
                  onCanvasClick={handleCanvasCoordinateClick}
                  interactiveHint={`सक्रिय लक्ष्य: "${
                    placementTarget === 'serial'
                      ? 'सीरियल नंबर'
                      : placementTarget === 'name'
                      ? 'ग्राहक का नाम'
                      : 'QR कोड'
                  }" — स्थान बदलने के लिए सीधे कूपन डिज़ाइन के ऊपर क्लिक करें।`}
                />

                {/* Fine-grained Position & Style Sliders */}
                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="font-bold text-[#0f4d3a]">सीरियल नंबर शैली</div>
                    <div className="grid grid-cols-2 gap-2">
                      <label>
                        <span className="text-[10px] text-stone-500">X (%)</span>
                        <input
                          type="number"
                          step="0.5"
                          value={serialXPct}
                          onChange={(e) => setSerialXPct(Number(e.target.value))}
                          className="w-full px-2 py-1 bg-white border border-stone-300 rounded font-mono"
                        />
                      </label>
                      <label>
                        <span className="text-[10px] text-stone-500">Y (%)</span>
                        <input
                          type="number"
                          step="0.5"
                          value={serialYPct}
                          onChange={(e) => setSerialYPct(Number(e.target.value))}
                          className="w-full px-2 py-1 bg-white border border-stone-300 rounded font-mono"
                        />
                      </label>
                      <label>
                        <span className="text-[10px] text-stone-500">Font (px)</span>
                        <input
                          type="number"
                          min={12}
                          max={48}
                          value={serialFontSize}
                          onChange={(e) => setSerialFontSize(Number(e.target.value))}
                          className="w-full px-2 py-1 bg-white border border-stone-300 rounded font-mono"
                        />
                      </label>
                      <label>
                        <span className="text-[10px] text-stone-500">Color</span>
                        <input
                          type="color"
                          value={serialColor}
                          onChange={(e) => setSerialColor(e.target.value)}
                          className="w-full h-7 bg-white border border-stone-300 rounded cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="font-bold text-[#0f4d3a]">ग्राहक नाम शैली</div>
                    <div className="grid grid-cols-2 gap-2">
                      <label>
                        <span className="text-[10px] text-stone-500">X (%)</span>
                        <input
                          type="number"
                          step="0.5"
                          value={nameXPct}
                          onChange={(e) => setNameXPct(Number(e.target.value))}
                          className="w-full px-2 py-1 bg-white border border-stone-300 rounded font-mono"
                        />
                      </label>
                      <label>
                        <span className="text-[10px] text-stone-500">Y (%)</span>
                        <input
                          type="number"
                          step="0.5"
                          value={nameYPct}
                          onChange={(e) => setNameYPct(Number(e.target.value))}
                          className="w-full px-2 py-1 bg-white border border-stone-300 rounded font-mono"
                        />
                      </label>
                      <label>
                        <span className="text-[10px] text-stone-500">Font (px)</span>
                        <input
                          type="number"
                          min={12}
                          max={42}
                          value={nameFontSize}
                          onChange={(e) => setNameFontSize(Number(e.target.value))}
                          className="w-full px-2 py-1 bg-white border border-stone-300 rounded font-mono"
                        />
                      </label>
                      <label>
                        <span className="text-[10px] text-stone-500">Color</span>
                        <input
                          type="color"
                          value={nameColor}
                          onChange={(e) => setNameColor(e.target.value)}
                          className="w-full h-7 bg-white border border-stone-300 rounded cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0f4d3a] flex items-center gap-1">
                        <QrCode className="w-3.5 h-3.5" /> QR कोड
                      </span>
                      <input
                        type="checkbox"
                        checked={showQr}
                        onChange={(e) => setShowQr(e.target.checked)}
                        className="w-4 h-4 accent-[#0f4d3a]"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      <label>
                        <span className="text-[10px] text-stone-500">X (%)</span>
                        <input
                          type="number"
                          step="0.5"
                          value={qrXPct}
                          onChange={(e) => setQrXPct(Number(e.target.value))}
                          className="w-full px-2 py-1 bg-white border border-stone-300 rounded font-mono"
                        />
                      </label>
                      <label>
                        <span className="text-[10px] text-stone-500">Y (%)</span>
                        <input
                          type="number"
                          step="0.5"
                          value={qrYPct}
                          onChange={(e) => setQrYPct(Number(e.target.value))}
                          className="w-full px-2 py-1 bg-white border border-stone-300 rounded font-mono"
                        />
                      </label>
                      <label>
                        <span className="text-[10px] text-stone-500">Size (px)</span>
                        <input
                          type="number"
                          min={36}
                          max={120}
                          value={qrSizePx}
                          onChange={(e) => setQrSizePx(Number(e.target.value))}
                          className="w-full px-2 py-1 bg-white border border-stone-300 rounded font-mono"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sample Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                disabled={!sampleDataUrl}
                onClick={() => setShowTestPreviewModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs flex items-center gap-1.5 border border-amber-300 cursor-pointer disabled:opacity-50"
              >
                <Eye className="w-4 h-4" />
                <span>Test Preview (टेस्ट कूपन देखें)</span>
              </button>

              <div className="flex flex-wrap gap-2">
                {dashboard?.activeSample && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={handleUpdateActiveSampleCoordinates}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs cursor-pointer"
                  >
                    सक्रिय सैंपल कोऑर्डिनेट्स सहेजें
                  </button>
                )}
                <button
                  type="submit"
                  disabled={busy || !sampleDataUrl}
                  className="px-5 py-2 rounded-xl bg-[#0f4d3a] hover:bg-[#125843] text-white font-bold text-xs cursor-pointer shadow disabled:opacity-50"
                >
                  {busy ? 'अपलोड हो रहा है...' : 'नया सैंपल अपलोड व सक्रिय करें'}
                </button>
              </div>
            </div>
          </form>

          {/* Saved Samples List */}
          {dashboard && dashboard.samples.length > 0 && (
            <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
              <h5 className="font-bold text-xs uppercase text-stone-600">
                अपलोड किए गए सैंपल टेम्पलेट्स ({dashboard.samples.length})
              </h5>
              <div className="grid sm:grid-cols-2 gap-3">
                {dashboard.samples.map((s) => (
                  <div
                    key={s.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                      s.isActive ? 'bg-emerald-50 border-emerald-400' : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {s.sampleFileType === 'image' ? (
                        <img
                          src={s.sampleDataUrl}
                          alt={s.name}
                          className="w-16 h-10 object-cover rounded border border-stone-300 shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-10 bg-amber-100 rounded border border-amber-300 flex items-center justify-center text-[10px] font-bold text-amber-900 shrink-0">
                          PDF
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-stone-900 truncate">{s.name}</div>
                        <div className="text-[10px] font-mono text-stone-600">
                          Next: {s.nextPreviewNumber}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => syncFormFromSample(s)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 text-[11px] font-bold cursor-pointer"
                      >
                        लोड करें
                      </button>
                      {s.isActive ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-[10px] font-bold">
                          सक्रिय
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleActivateSampleById(s.id)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 text-stone-950 text-[10px] font-bold cursor-pointer"
                        >
                          सक्रिय करें
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUBTAB 3: VERIFIED PAYMENTS, CATCH-UP ISSUE & ISSUED COUPONS TABLE    */}
      {/* ===================================================================== */}
      {subTab === 'records' && dashboard && (
        <div className="space-y-5">
          {/* Payments Table (Shows pending catch-up issuance if payment succeeded while AutoGen was OFF) */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
            <h5 className="font-bold text-sm text-[#0f4d3a]">
              सत्यापित व लंबित भुगतान रिकॉर्ड ({dashboard.payments.length})
            </h5>
            {dashboard.payments.length === 0 ? (
              <p className="text-xs text-stone-500 py-4 text-center">
                अभी कोई लकी ड्रॉ भुगतान रिकॉर्ड नहीं है।
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-100 text-stone-700">
                      <th className="p-2 rounded-l-lg">Order ID</th>
                      <th className="p-2">ग्राहक</th>
                      <th className="p-2">राशि</th>
                      <th className="p-2">स्थिति</th>
                      <th className="p-2">कूपन</th>
                      <th className="p-2 rounded-r-lg">कार्रवाई</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {dashboard.payments.map((p) => (
                      <tr key={p.id}>
                        <td className="p-2 font-mono text-[11px]">{p.order_id}</td>
                        <td className="p-2">
                          <div className="font-bold text-stone-900">{p.buyer_name}</div>
                          <div className="text-[10px] font-mono text-stone-500">{p.buyer_mobile}</div>
                        </td>
                        <td className="p-2 font-mono font-bold">
                          ₹{p.amount} ({p.quantity})
                        </td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.payment_status === 'verified'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {p.payment_status}
                          </span>
                        </td>
                        <td className="p-2">
                          {p.coupon_generated ? (
                            <span className="text-emerald-700 font-bold">जारी ✓</span>
                          ) : (
                            <span className="text-amber-700 font-bold">प्रतीक्षारत</span>
                          )}
                        </td>
                        <td className="p-2">
                          {p.payment_status === 'verified' && !p.coupon_generated && (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => handleIssueCatchupCoupon(p.order_id)}
                              className="px-2.5 py-1 rounded-lg bg-[#0f4d3a] text-white text-[10px] font-bold cursor-pointer"
                            >
                              कूपन जारी करें
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Issued Coupons Registry */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h5 className="font-bold text-sm text-[#0f4d3a]">
                जारी किए गए लकी ड्रॉ कूपन ({filteredCoupons.length})
              </h5>
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  placeholder="कूपन नं., नाम या मोबाइल खोजें..."
                  value={couponSearch}
                  onChange={(e) => setCouponSearch(e.target.value)}
                  className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={() => LuckyDrawApi.downloadCouponsCsv()}
                  className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Excel / CSV डाउनलोड</span>
                </button>
              </div>
            </div>

            {filteredCoupons.length === 0 ? (
              <p className="text-xs text-stone-500 py-4 text-center">कोई कूपन रिकॉर्ड नहीं मिला।</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-100 text-stone-700">
                      <th className="p-2 rounded-l-lg">कूपन क्रमांक</th>
                      <th className="p-2">ग्राहक विवरण</th>
                      <th className="p-2">राशि</th>
                      <th className="p-2">दिनांक</th>
                      <th className="p-2 rounded-r-lg">डाउनलोड / सत्यापन</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredCoupons.map((c) => (
                      <tr key={c.id}>
                        <td className="p-2 font-mono font-extrabold text-[#0f4d3a]">
                          {c.couponNumber}
                        </td>
                        <td className="p-2">
                          <div className="font-bold text-stone-900">{c.buyerName}</div>
                          <div className="text-[10px] font-mono text-stone-500">{c.buyerMobile}</div>
                        </td>
                        <td className="p-2 font-mono font-bold">₹{c.amount}</td>
                        <td className="p-2 text-[11px] text-stone-600">
                          {new Date(c.issuedAt).toLocaleDateString('hi-IN')}
                        </td>
                        <td className="p-2 flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewCoupon(c)}
                            className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-950 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>देखें / डाउनलोड</span>
                          </button>
                          {onOpenPublicCouponVerify && (
                            <button
                              type="button"
                              onClick={() => onOpenPublicCouponVerify(c.couponNumber)}
                              className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Verify</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUBTAB 4: AUDIT LOGS                                                  */}
      {/* ===================================================================== */}
      {subTab === 'audit' && dashboard && (
        <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
          <h5 className="font-bold text-sm text-[#0f4d3a] flex items-center gap-2">
            <History className="w-4 h-4 text-amber-600" />
            <span>संपूर्ण सुरक्षा व नियंत्रण ऑडिट लॉग (Audit Trail)</span>
          </h5>
          {dashboard.auditLogs.length === 0 ? (
            <p className="text-xs text-stone-500 py-4 text-center">अभी कोई ऑडिट प्रविष्टि नहीं है।</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {dashboard.auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                >
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold mr-2">
                      {log.action}
                    </span>
                    <span className="font-semibold text-stone-800">{log.details}</span>
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono shrink-0">
                    {log.actor} · {new Date(log.created_at).toLocaleString('hi-IN')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: FINAL SUPER ADMIN CONFIRMATION POPUP (6th Requirement)         */}
      {/* ===================================================================== */}
      {showLiveConfirmModal && (
        <div className="fixed inset-0 z-[70] bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-amber-400 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5 text-[#0f4d3a]">
                <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0" />
                <h4 className="font-heading text-lg font-bold">
                  लकी ड्रॉ लाइव करने की अंतिम पुष्टि
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowLiveConfirmModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {readiness && !readiness.ready ? (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 font-semibold">
                  निम्नलिखित अनिवार्य शर्तें अधूरी होने के कारण लकी ड्रॉ लाइव नहीं किया जा सकता:
                </div>
                <ul className="space-y-1.5 text-xs text-red-800 list-disc pl-5">
                  {readiness.missing.map((m) => (
                    <li key={m.code}>{m.label}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 leading-relaxed">
                  सभी 5 तकनीकी व कानूनी जांचें (Active Sample, KYC/Legal, Live Gateway, Webhook Secret, IDBI Bank) पूर्ण हैं।
                  सक्रिय करने पर होमपेज पर ₹{settings?.ticketPrice} कूपन बुकिंग तुरंत शुरू हो जाएगी।
                </div>

                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmCheckbox}
                    onChange={(e) => setConfirmCheckbox(e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-[#0f4d3a]"
                  />
                  <span className="font-bold text-stone-900">
                    मैं सुपर एडमिन के रूप में पुष्टि करता हूँ कि ट्रस्ट के सभी नियम व पेमेंट गेटवे जांच लिए गए हैं और मैं लकी ड्रॉ सिस्टम LIVE करने की अनुमति देता हूँ।
                  </span>
                </label>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLiveConfirmModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 cursor-pointer"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="button"
                    disabled={busy || !confirmCheckbox}
                    onClick={handleConfirmLiveActivation}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                  >
                    {busy ? 'सक्रिय हो रहा है...' : 'हाँ, LIVE सक्रिय करें'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: TEST PREVIEW FOR SAMPLE + OVERLAID SERIAL                      */}
      {/* ===================================================================== */}
      {showTestPreviewModal && (
        <div className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-heading text-lg font-bold text-[#0f4d3a]">
                कूपन लाइव टेस्ट प्रीव्यू ({testPreviewSerial})
              </h4>
              <button
                type="button"
                onClick={() => setShowTestPreviewModal(false)}
                className="p-1.5 rounded-full hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <CouponRenderer
              forwardRef={testCouponRef}
              config={renderConfig}
              couponNumber={testPreviewSerial}
              buyerName="श्री रामेश्वर शर्मा (नमूना ग्राहक)"
            />

            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  testCouponRef.current &&
                  exportCouponDomToPng(testCouponRef.current, `TEST_${testPreviewSerial}.png`)
                }
                className="px-4 py-2 rounded-xl bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Test PNG डाउनलोड</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  testCouponRef.current &&
                  exportPdf(
                    testCouponRef.current,
                    `TEST_${testPreviewSerial}.pdf`,
                    sampleWidth,
                    sampleHeight
                  )
                }
                className="px-4 py-2 rounded-xl bg-[#0f4d3a] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Test PDF डाउनलोड</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: VIEW & EXPORT ISSUED CUSTOMER COUPON                           */}
      {/* ===================================================================== */}
      {previewCoupon && (
        <div className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-heading text-lg font-bold text-[#0f4d3a]">
                  कूपन क्रमांक: {previewCoupon.couponNumber}
                </h4>
                <p className="text-xs text-stone-500">
                  {previewCoupon.buyerName} · {previewCoupon.buyerMobile}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewCoupon(null)}
                className="p-1.5 rounded-full hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {previewCoupon.sample ? (
              <CouponRenderer
                forwardRef={issuedCouponRef}
                config={previewCoupon.sample}
                couponNumber={previewCoupon.couponNumber}
                buyerName={previewCoupon.buyerName}
                issuedAt={previewCoupon.issuedAt}
              />
            ) : (
              <div className="p-6 rounded-xl bg-amber-50 border border-amber-300 text-center font-mono font-bold">
                {previewCoupon.couponNumber} — {previewCoupon.buyerName}
              </div>
            )}

            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  issuedCouponRef.current &&
                  exportCouponDomToPng(
                    issuedCouponRef.current,
                    `${previewCoupon.couponNumber}.png`
                  )
                }
                className="px-4 py-2 rounded-xl bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PNG डाउनलोड</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  issuedCouponRef.current &&
                  exportCouponDomToPdf(
                    issuedCouponRef.current,
                    `${previewCoupon.couponNumber}.pdf`,
                    previewCoupon.sample?.widthPx,
                    previewCoupon.sample?.heightPx
                  )
                }
                className="px-4 py-2 rounded-xl bg-[#0f4d3a] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>PDF डाउनलोड</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
