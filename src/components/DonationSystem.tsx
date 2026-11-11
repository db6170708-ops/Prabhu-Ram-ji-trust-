import React, { useState, useEffect } from 'react';
import { TRUST_INFO } from '../data/defaultData';
import { DonationReceipt } from '../types';
import { StorageService } from '../utils/storage';
import { 
  HeartHandshake, 
  Copy, 
  Check, 
  QrCode, 
  Smartphone, 
  Building2, 
  FileCheck, 
  Download, 
  Printer, 
  Info, 
  Sparkles,
  ArrowRight,
  Maximize2,
  Zap,
  FileText,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  CreditCard,
  Wallet,
  Bookmark,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { sendReceiptEmail, getReceiptMailtoLink } from '../utils/emailService';
import { TRANSLATIONS, Language } from '../utils/translations';

interface DonationSystemProps {
  initialCause?: string;
  initialAmount?: number;
  onReceiptGenerated: (receipt: DonationReceipt) => void;
  language?: Language;
}

export const DonationSystem: React.FC<DonationSystemProps> = ({ 
  initialCause, 
  initialAmount,
  onReceiptGenerated,
  language = 'hi'
}) => {
  const isEn = language === 'en';
  const t = TRANSLATIONS[language] || TRANSLATIONS['hi'];

  // Default to ₹501 to match the reference design in IMG_20261110_023724
  const [selectedAmount, setSelectedAmount] = useState<number>(initialAmount || 501);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedCause, setSelectedCause] = useState<string>(
    initialCause || (isEn ? 'Ashram & Mandir Construction Support' : 'आश्रम एवं मंदिर निर्माण सहयोग')
  );
  
  // Donor form
  const [donorName, setDonorName] = useState<string>('');
  const [donorMobile, setDonorMobile] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorPan, setDonorPan] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<string>('PhonePe QR / UPI');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [hasPaidConfirmation, setHasPaidConfirmation] = useState<boolean>(false);

  // UI status
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [generatedReceipt, setGeneratedReceipt] = useState<DonationReceipt | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [showPaymentDetailsDrawer, setShowPaymentDetailsDrawer] = useState(true);

  // Email sending status
  const [emailSendStatus, setEmailSendStatus] = useState<{
    status: 'idle' | 'sending' | 'sent' | 'error';
    message: string;
    recipient?: string;
  }>({ status: 'idle', message: '' });
  const [manualEmailInput, setManualEmailInput] = useState<string>('');

  useEffect(() => {
    if (initialCause) {
      setSelectedCause(initialCause);
    }
    if (initialAmount && initialAmount > 0) {
      setSelectedAmount(initialAmount);
      setCustomAmount('');
    }
  }, [initialCause, initialAmount]);

  useEffect(() => {
    if (generatedReceipt || isQrModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [generatedReceipt, isQrModalOpen]);

  const presetAmounts = [101, 201, 501, 1100];

  const currentAmount = customAmount ? parseInt(customAmount, 10) || 0 : selectedAmount;
  const [upiToast, setUpiToast] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const cleanPayeeName = 'GULABCHAND HIRALAL';
  const cleanNote = (selectedCause || 'Donation to Prabhu Ramji Trust').replace(/[^a-zA-Z0-9 ]/g, ' ').slice(0, 40);

  const getUpiUrl = (app: 'universal' | 'phonepe' | 'gpay' | 'paytm' = 'universal') => {
    const params = `pa=${encodeURIComponent(TRUST_INFO.upiId)}&pn=${encodeURIComponent(cleanPayeeName)}&cu=INR&am=${currentAmount}&tn=${encodeURIComponent(cleanNote)}`;
    return `upi://pay?${params}`;
  };

  const handleDirectUpiPayment = (app: 'universal' | 'phonepe' | 'gpay' | 'paytm' = 'universal') => {
    const url = getUpiUrl(app);
    try {
      navigator.clipboard.writeText(TRUST_INFO.upiId);
      setCopiedField('upi');
      setUpiToast(
        isEn
          ? '✓ UPI ID (dineshbirla312@ybl) copied! If the app asks, paste this UPI ID or scan the QR.'
          : '✓ UPI ID (dineshbirla312@ybl) कॉपी हो गई है! यदि ऐप में आवश्यकता हो तो यह UPI ID पेस्ट करें या QR स्कैन करें।'
      );
      setTimeout(() => {
        setCopiedField(null);
        setUpiToast(null);
      }, 7000);
    } catch {
      // ignore
    }

    // Scroll to verification section so donor enters UTR
    setShowPaymentDetailsDrawer(true);
    window.location.assign(url);
  };

  const handleOnlineDonationConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!donorName.trim()) {
      setFormError(isEn ? 'Please enter donor full name.' : 'कृपया दानदाता का नाम दर्ज करें।');
      return;
    }
    if (!donorMobile.trim() || donorMobile.length < 10) {
      setFormError(isEn ? 'Please enter a valid 10-digit mobile number.' : 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।');
      return;
    }
    if (currentAmount <= 0) {
      setFormError(isEn ? 'Please enter a valid donation amount.' : 'कृपया वैध दान राशि चुनें या दर्ज करें।');
      return;
    }

    // Require actual payment confirmation & UTR for UPI payments so users don't generate slips without paying
    if (!paymentMode.includes('नकद') && !paymentMode.includes('Cash')) {
      const cleanRef = transactionRef.trim();
      if (!cleanRef || cleanRef.length < 6) {
        setFormError(
          isEn 
            ? '⚠️ Please enter the 12-digit UPI UTR / Transaction number from PhonePe, Google Pay or Paytm after paying ₹' + currentAmount + '.'
            : '⚠️ कृपया PhonePe, Google Pay या Paytm से ₹' + currentAmount + ' के भुगतान के बाद प्राप्त 12 अंकों का UTR / Transaction No दर्ज करें।'
        );
        return;
      }
      if (!hasPaidConfirmation) {
        setFormError(
          isEn
            ? '⚠️ Please tick the confirmation checkbox to verify that you have transferred ₹' + currentAmount + ' to Prabhu Ramji Trust (dineshbirla312@ybl).'
            : '⚠️ कृपया नीचे दिए गए चेकबॉक्स पर टिक करके पुष्टि करें कि आपने प्रभु रामजी ट्रस्ट (dineshbirla312@ybl) को ₹' + currentAmount + ' का भुगतान सफलता पूर्वक कर दिया है।'
        );
        return;
      }
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const receiptNo = `PRT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const refNo = transactionRef.trim() || `CASH/${Date.now().toString().slice(-8)}`;

      const newReceipt: DonationReceipt = {
        receiptNo,
        donorName: donorName.trim(),
        mobile: donorMobile.trim(),
        email: donorEmail.trim() || undefined,
        pan: donorPan.trim().toUpperCase() || undefined,
        amount: currentAmount,
        cause: selectedCause,
        date: new Date().toLocaleDateString(isEn ? 'en-IN' : 'hi-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        paymentMode,
        transactionRef: refNo
      };

      StorageService.saveReceipt(newReceipt);
      setGeneratedReceipt(newReceipt);
      onReceiptGenerated(newReceipt);
      setIsSubmitting(false);

      if (donorEmail.trim()) {
        setEmailSendStatus({
          status: 'sending',
          message: `${donorEmail.trim()} पर आधिकारिक दान रसीद भेजी जा रही है...`,
          recipient: donorEmail.trim()
        });
        sendReceiptEmail(newReceipt, donorEmail.trim()).then((res) => {
          if (res.success) {
            setEmailSendStatus({
              status: 'sent',
              message: res.message,
              recipient: donorEmail.trim()
            });
          } else {
            setEmailSendStatus({
              status: 'error',
              message: res.message,
              recipient: donorEmail.trim()
            });
          }
        });
      } else {
        setEmailSendStatus({ status: 'idle', message: '' });
      }
    }, 500);
  };

  return (
    <section id="donate" className="py-16 md:py-24 bg-gradient-to-b from-stone-900 via-[#061e15] to-[#04150e] text-white border-b-4 border-amber-500 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-500/15 px-3.5 py-1 rounded-full border border-amber-400/40">
            {t.donateTag}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-amber-50 mt-3">
            {t.donateTitle}
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-3 rounded-full shadow"></div>
          <p className="text-stone-300 mt-3 text-sm sm:text-base leading-relaxed">
            {t.donateDesc}
          </p>
        </div>

        {/* 12AB and 80G Transparency Status */}
        <div className="mb-8 bg-black/40 border border-amber-400/30 rounded-2xl p-4 flex items-start gap-3 shadow-inner">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-stone-200 leading-relaxed">
            <strong className="text-amber-300 font-bold block mb-0.5">{t.taxNoticeTitle}</strong>
            {t.taxNoticeText}
          </div>
        </div>

        {/* =========================================================================
            EXACT PAYMENT CARD REPLICATION AS IN USER ATTACHMENT IMG_20261110_023724
           ========================================================================= */}
        <div className="bg-[#0b1310] rounded-3xl overflow-hidden border-2 border-stone-800 shadow-2xl transition-all">
          
          {/* Top Sacred Artwork Banner: Lord Rama with Kodanda Bow and Ancient Golden Temple */}
          <div className="relative w-full aspect-16/10 sm:aspect-16/9 max-h-[380px] overflow-hidden bg-stone-950">
            <img
              src="/shri_ram_kodanda.jpg"
              alt={t.paymentCardTitle}
              className="w-full h-full object-cover object-top filter brightness-95 contrast-105"
              loading="eager"
            />
            {/* Top-right bookmark icon */}
            <div className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white backdrop-blur-xs border border-white/20">
              <Bookmark className="w-4 h-4 text-amber-300 fill-amber-300/30" />
            </div>

            {/* Bottom-left sacred watermark badge as in reference mock */}
            <div className="absolute bottom-3 left-4 px-2.5 py-1 rounded-full bg-black/60 text-stone-300 text-[11px] font-mono backdrop-blur-md border border-white/10">
              ramayanam.ai
            </div>

            {/* Gradient bottom overlay to merge smoothly into card body */}
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0b1310] to-transparent pointer-events-none" />
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Golden Title & Motto Header */}
            <div className="text-center space-y-2">
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-amber-400 tracking-wide">
                {t.paymentCardTitle}
              </h3>
              <p className="font-bold text-base sm:text-lg text-white">
                {t.paymentMotto}
              </p>
              <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto leading-relaxed">
                {t.paymentSubtitle}
              </p>
            </div>

            {/* 1. Choose Donation Amount (2x2 Pill Grid) */}
            <div className="space-y-3 pt-2">
              <label className="block text-sm font-bold text-white">
                {t.chooseDonationAmount}
              </label>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {presetAmounts.map((amt) => {
                  const isSelected = selectedAmount === amt && !customAmount;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`py-3.5 px-4 rounded-full font-bold text-base sm:text-lg transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-[#059669] text-white border-[#10b981] shadow-lg shadow-emerald-950/60 ring-2 ring-[#10b981]/50'
                          : 'bg-[#141b18] text-stone-200 border-stone-800 hover:border-stone-600 hover:bg-[#1a2320]'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Custom Amount Input */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs sm:text-sm font-semibold text-stone-300">
                {t.enterCustomAmount}
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder={t.customAmountPlaceholder}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  min="1"
                  className="w-full px-5 py-3.5 bg-[#141b18] text-white placeholder:text-stone-500 border border-stone-800 rounded-full text-sm font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-inner"
                />
              </div>
              <p className="text-[11px] text-stone-400 italic">
                {isEn
                  ? "Select any preset or enter custom voluntary amount."
                  : "इच्छानुसार कोई भी राशि चुनें या दर्ज करें।"}
              </p>
            </div>

            {/* 3. Big Bold Active Amount Display in Vibrant Emerald Green */}
            <div className="pt-2">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#10b981] font-mono tracking-tight">
                ₹{currentAmount.toLocaleString('en-IN')}
              </div>
            </div>

            {/* 4. Primary CTA Button: "PhonePe से दान करें" */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleDirectUpiPayment('phonepe')}
                className="w-full py-4 px-6 rounded-full font-bold text-base sm:text-lg text-white bg-[#141a17] hover:bg-[#1e2622] border border-stone-700 hover:border-stone-500 shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>{t.payViaPhonePeBtn}</span>
              </button>

              {/* Subtext */}
              <p className="text-center text-xs text-stone-400 font-medium">
                {t.securePaymentNote}
              </p>
            </div>

            {/* Toast feedback */}
            {upiToast && (
              <div className="p-3 bg-emerald-950/90 text-emerald-200 border border-emerald-500 rounded-xl text-xs text-center animate-slide-up-fade font-medium">
                {upiToast}
              </div>
            )}

            {/* 5. Complete Integrated Payment Options & Verification Section */}
            <div className="pt-6 border-t border-stone-800 space-y-6">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  {isEn ? "Payment Details & Receipt Verification" : "भुगतान माध्यम व रसीद सत्यापन"}
                </span>
                <button
                  type="button"
                  onClick={() => setShowPaymentDetailsDrawer(!showPaymentDetailsDrawer)}
                  className="text-xs text-stone-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <span>{showPaymentDetailsDrawer ? (isEn ? "Hide Options" : "विकल्प छिपाएं") : (isEn ? "Show Options" : "विकल्प देखें")}</span>
                  {showPaymentDetailsDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {showPaymentDetailsDrawer && (
                <div className="space-y-6 animate-slide-up-fade">
                  
                  {/* Direct Mobile UPI Apps Bar */}
                  <div className="p-4 bg-[#141b18] rounded-2xl border border-stone-800">
                    <span className="block text-xs font-semibold text-stone-300 mb-2.5">
                      {t.directAppsTitle}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => handleDirectUpiPayment('phonepe')}
                        className="py-2.5 px-3 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 font-bold text-xs border border-purple-700/60 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>PhonePe</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDirectUpiPayment('gpay')}
                        className="py-2.5 px-3 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-blue-200 font-bold text-xs border border-blue-700/60 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Google Pay</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDirectUpiPayment('paytm')}
                        className="py-2.5 px-3 rounded-xl bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 font-bold text-xs border border-cyan-700/60 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Paytm UPI</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDirectUpiPayment('universal')}
                        className="py-2.5 px-3 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 font-bold text-xs border border-emerald-700/60 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Any UPI App</span>
                      </button>
                    </div>
                  </div>

                  {/* QR Standee & Bank Transfer Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Official PhonePe Standee Photo */}
                    <div className="bg-[#141b18] p-4 rounded-2xl border border-stone-800 text-center flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-stone-200">{t.scanPhonePeQrTitle}</span>
                          <span className="text-[10px] bg-purple-950 text-purple-300 font-bold px-2 py-0.5 rounded-full border border-purple-800">
                            Accepted Here
                          </span>
                        </div>
                        <div className="relative mx-auto max-w-[190px] bg-stone-950 p-2 rounded-xl border border-stone-800 mb-2">
                          <img
                            src={TRUST_INFO.phonePeQrUrl}
                            alt="PhonePe QR Standee"
                            className="w-full h-auto rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-stone-800">
                        <div className="flex items-center justify-center gap-1.5 text-xs">
                          <span className="text-stone-400">UPI ID:</span>
                          <strong className="text-amber-300 font-mono">{TRUST_INFO.upiId}</strong>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(TRUST_INFO.upiId, 'upi_card')}
                            className="p-1 hover:bg-stone-800 rounded text-stone-400 hover:text-white"
                            title={t.copyUpiBtn}
                          >
                            {copiedField === 'upi_card' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <div className="flex items-center justify-center gap-2">
                          <a
                            href={TRUST_INFO.phonePeQrUrl}
                            download="Prabhu-Ramji-Trust-PhonePe-QR.jpg"
                            className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-white flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            <span>{t.downloadQrBtn}</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => setIsQrModalOpen(true)}
                            className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-white flex items-center gap-1 cursor-pointer"
                          >
                            <Maximize2 className="w-3 h-3" />
                            <span>{t.viewLargeQrBtn}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* IDBI Bank Transfer Details */}
                    <div className="bg-[#141b18] p-4 rounded-2xl border border-stone-800 flex flex-col justify-between">
                      <div>
                        <span className="block text-xs font-bold text-stone-200 mb-3">
                          {t.bankDetailsTitle}
                        </span>
                        
                        <div className="space-y-2.5 text-xs">
                          <div className="flex justify-between items-center py-1 border-b border-stone-800/80">
                            <span className="text-stone-400">{isEn ? "Account Holder:" : "खाता धारक:"}</span>
                            <span className="font-bold text-white text-right">{TRUST_INFO.accountHolder}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-stone-800/80">
                            <span className="text-stone-400">{isEn ? "Account No:" : "खाता संख्या:"}</span>
                            <div className="flex items-center gap-1 font-mono font-bold text-amber-300">
                              <span>{TRUST_INFO.accountNumber}</span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(TRUST_INFO.accountNumber, 'acc')}
                                className="p-0.5 hover:text-white text-stone-400"
                              >
                                {copiedField === 'acc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-stone-800/80">
                            <span className="text-stone-400">{isEn ? "IFSC Code:" : "IFSC कोड:"}</span>
                            <div className="flex items-center gap-1 font-mono font-bold text-amber-300">
                              <span>{TRUST_INFO.ifscCode}</span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(TRUST_INFO.ifscCode, 'ifsc')}
                                className="p-0.5 hover:text-white text-stone-400"
                              >
                                {copiedField === 'ifsc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="text-stone-400">{isEn ? "Bank & Branch:" : "बैंक व शाखा:"}</span>
                            <span className="text-stone-200 text-right">{TRUST_INFO.bankName}, {TRUST_INFO.branchName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 p-2.5 bg-black/40 rounded-xl border border-stone-800 text-[11px] text-stone-400">
                        {isEn
                          ? "After transfer, fill the form below to receive your official stamped digital receipt."
                          : "ट्रांसफर के बाद आधिकारिक रसीद पाने हेतु नीचे रसीद फॉर्म भरें।"}
                      </div>
                    </div>

                  </div>

                  {/* 6. Form: Record Contribution & Generate Instant Receipt */}
                  <div className="bg-[#141b18] p-5 sm:p-6 rounded-2xl border border-stone-800">
                    <div className="border-b border-stone-800 pb-3 mb-4">
                      <h4 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                        <FileCheck className="w-5 h-5 text-emerald-400" />
                        <span>{t.claimReceiptTitle}</span>
                      </h4>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {t.claimReceiptSub}
                      </p>
                    </div>

                    {formError && (
                      <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/70 text-red-200 text-xs flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <span>{formError}</span>
                      </div>
                    )}

                    <form onSubmit={handleOnlineDonationConfirm} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">
                            {t.donorNameLabel}
                          </label>
                          <input
                            type="text"
                            required
                            value={donorName}
                            onChange={(e) => setDonorName(e.target.value)}
                            placeholder={isEn ? "e.g. Ramesh Kumar Sharma" : "उदा. रमेश कुमार शर्मा"}
                            className="w-full px-3.5 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-xs sm:text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">
                            {t.donorMobileLabel}
                          </label>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            value={donorMobile}
                            onChange={(e) => setDonorMobile(e.target.value.replace(/\D/g, ''))}
                            placeholder="98260XXXXX"
                            className="w-full px-3.5 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-xs sm:text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-400 font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">
                            {t.donorEmailLabel}
                          </label>
                          <input
                            type="email"
                            value={donorEmail}
                            onChange={(e) => setDonorEmail(e.target.value)}
                            placeholder="yourname@gmail.com"
                            className="w-full px-3.5 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-xs sm:text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">
                            {t.utrLabel}
                          </label>
                          <input
                            type="text"
                            required
                            value={transactionRef}
                            onChange={(e) => setTransactionRef(e.target.value)}
                            placeholder={t.utrPlaceholder}
                            className="w-full px-3.5 py-2.5 bg-stone-900 border border-amber-400/70 rounded-xl text-xs sm:text-sm text-amber-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-400 font-mono"
                          />
                        </div>
                      </div>

                      {/* Payment confirmation checkbox */}
                      <label className="flex items-start gap-2.5 p-3 rounded-xl bg-black/50 border border-stone-800 text-xs text-stone-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasPaidConfirmation}
                          onChange={(e) => setHasPaidConfirmation(e.target.checked)}
                          className="mt-0.5 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <span>{t.hasPaidConfirmLabel}</span>
                      </label>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg cursor-pointer transition-transform hover:scale-101 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                            <span>{isEn ? "Generating Receipt..." : "रसीद तैयार हो रही है..."}</span>
                          </>
                        ) : (
                          <>
                            <FileCheck className="w-4 h-4 text-stone-950" />
                            <span>{t.submitDonationBtn}</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                </div>
              )}

            </div>

          </div>
        </div>

      </div>

      {/* Standee QR Full Screen Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white text-stone-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-100"
            >
              ✕
            </button>
            <h4 className="font-heading font-bold text-lg text-center mb-3">
              {t.scanPhonePeQrTitle}
            </h4>
            <div className="p-2 bg-stone-100 rounded-2xl border border-stone-300 mb-4">
              <img
                src={TRUST_INFO.phonePeQrUrl}
                alt="PhonePe Standee"
                className="w-full h-auto rounded-xl"
              />
            </div>
            <p className="text-center text-xs font-mono font-bold text-emerald-800 mb-3">
              UPI ID: {TRUST_INFO.upiId}
            </p>
            <a
              href={TRUST_INFO.phonePeQrUrl}
              download="Prabhu-Ramji-Trust-PhonePe-QR.jpg"
              className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>{t.downloadQrBtn}</span>
            </a>
          </div>
        </div>
      )}

      {/* Generated Digital Receipt Stamped Slip Modal */}
      {generatedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="bg-white text-stone-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-auto border-4 border-amber-400">
            <button
              onClick={() => setGeneratedReceipt(null)}
              className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-100"
            >
              ✕
            </button>

            {/* Slip Header */}
            <div className="text-center border-b-2 border-stone-200 pb-4 mb-4">
              <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-amber-500 mb-2">
                <img src={TRUST_INFO.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-heading font-bold text-xl text-[#0f4d3a]">
                {t.trustName}
              </h3>
              <p className="text-xs text-stone-600 font-medium">
                {TRUST_INFO.village}, {TRUST_INFO.tehsil}, {TRUST_INFO.district} (म.प्र.) - 451111
              </p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-300">
                {isEn ? "OFFICIAL DIGITAL DONATION RECEIPT" : "आधिकारिक डिजिटल दान पावती"}
              </span>
            </div>

            {/* Slip Details */}
            <div className="space-y-2.5 text-xs sm:text-sm py-2">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">{isEn ? "Receipt No:" : "रसीद संख्या:"}</span>
                <span className="font-mono font-bold text-stone-900">{generatedReceipt.receiptNo}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">{isEn ? "Date:" : "दिनांक:"}</span>
                <span className="font-medium text-stone-900">{generatedReceipt.date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">{isEn ? "Donor Name:" : "दानदाता का नाम:"}</span>
                <span className="font-bold text-stone-900">{generatedReceipt.donorName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">{isEn ? "Mobile Number:" : "मोबाइल नंबर:"}</span>
                <span className="font-mono text-stone-900">{generatedReceipt.mobile}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">{isEn ? "Seva Cause:" : "सहयोग प्रकल्प:"}</span>
                <span className="font-semibold text-emerald-900">{generatedReceipt.cause}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">{isEn ? "Payment Mode & Ref:" : "माध्यम व संदर्भ:"}</span>
                <span className="font-mono text-stone-800 text-xs">{generatedReceipt.paymentMode} ({generatedReceipt.transactionRef})</span>
              </div>
              <div className="flex justify-between items-center py-2.5 bg-emerald-50 px-3 rounded-xl border border-emerald-200 mt-2">
                <span className="font-bold text-emerald-950 text-sm">{isEn ? "Amount Received:" : "प्राप्त सहयोग राशि:"}</span>
                <span className="font-mono font-extrabold text-emerald-900 text-xl">
                  ₹{generatedReceipt.amount.toLocaleString('en-IN')} /-
                </span>
              </div>
            </div>

            {/* Email Dispatch Status */}
            {emailSendStatus.message && (
              <div className="mt-3 p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs">
                {emailSendStatus.message}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{isEn ? "Print Receipt" : "रसीद प्रिंट करें"}</span>
              </button>
              <button
                onClick={() => setGeneratedReceipt(null)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{isEn ? "Done" : "पूर्ण"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
