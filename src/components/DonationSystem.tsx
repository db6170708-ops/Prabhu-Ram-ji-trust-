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
  Banknote,
  X,
  ArrowDown,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import QRCode from 'qrcode';
import { sendReceiptEmail, getReceiptMailtoLink } from '../utils/emailService';

interface DonationSystemProps {
  initialCause?: string;
  initialAmount?: number;
  onReceiptGenerated: (receipt: DonationReceipt) => void;
}

export const DonationSystem: React.FC<DonationSystemProps> = ({ 
  initialCause, 
  initialAmount,
  onReceiptGenerated 
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(initialAmount || 1100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedCause, setSelectedCause] = useState<string>(initialCause || 'आश्रम एवं मंदिर निर्माण सहयोग');
  
  // Donor form
  const [donorName, setDonorName] = useState<string>('');
  const [donorMobile, setDonorMobile] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorPan, setDonorPan] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<string>('PhonePe QR / UPI');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [hasPaidConfirmation, setHasPaidConfirmation] = useState<boolean>(false);

  // UI status
  const [activePaymentTab, setActivePaymentTab] = useState<'phonepe' | 'gpay' | 'paytm' | 'bank'>('phonepe');
  const [generatedQrUrl, setGeneratedQrUrl] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [generatedReceipt, setGeneratedReceipt] = useState<DonationReceipt | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Email sending status & manual input
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

  const presetAmounts = [251, 380, 501, 750, 1100, 2100, 5100, 11000];

  const causes = [
    { title: 'आश्रम एवं मंदिर निर्माण सहयोग', desc: 'नींव, पिलर, छत, परिक्रमा विश्राम शेड व आश्रम परिसर' },
    { title: 'शनिवार शाम भंडारा महाप्रसाद', desc: 'हर शनिवार शाम को होने वाले महाभंडारे का संपूर्ण प्रायोजन' },
    { title: 'प्रतिदिन चाय सेवा', desc: 'नर्मदा परिक्रमावासियों व संतों हेतु नित्य प्रातः व दिनभर चाय सेवा' },
    { title: 'गौसेवा एवं चारा व्यवस्था', desc: 'निराश्रित गायों हेतु हरा व सूखा चारा, दाना व चिकित्सा' },
    { title: 'सामान्य सेवा कोष', desc: 'ट्रस्ट के सभी सामाजिक व धार्मिक सेवा कार्यों में' }
  ];

  const currentAmount = customAmount ? parseInt(customAmount, 10) || 0 : selectedAmount;
  const [upiToast, setUpiToast] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Generate robust UPI deep links with safe payee name for mobile apps (PhonePe, GPay, Paytm)
  const cleanPayeeName = 'GULABCHAND HIRALAL';
  const cleanNote = (selectedCause || 'Donation to Prabhu Ramji Trust').replace(/[^a-zA-Z0-9 ]/g, ' ').slice(0, 40);

  const getUpiUrl = (app: 'universal' | 'phonepe' | 'gpay' | 'paytm' = 'universal') => {
    const params = `pa=${encodeURIComponent(TRUST_INFO.upiId)}&pn=${encodeURIComponent(cleanPayeeName)}&am=${currentAmount}&cu=INR&tn=${encodeURIComponent(cleanNote)}`;
    switch (app) {
      case 'phonepe':
        return `phonepe://pay?${params}`;
      case 'gpay':
        return `tez://upi/pay?${params}`;
      case 'paytm':
        return `paytmmp://pay?${params}`;
      default:
        return `upi://pay?${params}`;
    }
  };

  // Generate dynamic QR code for GPay / Paytm / Universal UPI
  useEffect(() => {
    const upiUrl = getUpiUrl('universal');
    QRCode.toDataURL(upiUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0f241b',
        light: '#ffffff',
      },
    })
      .then((url) => setGeneratedQrUrl(url))
      .catch((err) => console.error('Failed to generate UPI QR:', err));
  }, [currentAmount, selectedCause]);

  const handleDirectUpiPayment = (app: 'universal' | 'phonepe' | 'gpay' | 'paytm' = 'universal') => {
    const url = getUpiUrl(app);
    // Auto-copy UPI ID as seamless fallback
    try {
      navigator.clipboard.writeText(TRUST_INFO.upiId);
      setCopiedField('upi');
      setUpiToast('✓ UPI ID (dineshbirla312@ybl) क्लिपबोर्ड पर कॉपी हो गया है! यदि ऐप स्वतः न खुले तो किसी भी UPI ऐप में पेस्ट करें।');
      setTimeout(() => {
        setCopiedField(null);
        setUpiToast(null);
      }, 5000);
    } catch {
      // ignore
    }

    // Direct app trigger
    window.location.assign(url);
  };

  const scrollToReceiptForm = () => {
    const el = document.getElementById('receipt-claim-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOnlineDonationConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!donorName.trim()) {
      setFormError('कृपया दानदाता का नाम दर्ज करें।');
      return;
    }
    if (!donorMobile.trim() || donorMobile.length < 10) {
      setFormError('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।');
      return;
    }
    if (currentAmount <= 0) {
      setFormError('कृपया वैध दान राशि चुनें या दर्ज करें।');
      return;
    }

    // Require actual payment confirmation & UTR for UPI payments so users don't generate slips without paying
    if (!paymentMode.includes('नकद')) {
      const cleanRef = transactionRef.trim();
      if (!cleanRef || cleanRef.length < 6) {
        setFormError('⚠️ कृपया अपने PhonePe, Google Pay या Paytm से भुगतान के बाद प्राप्त 12 अंकों का UTR / Transaction No दर्ज करें। यदि आपने अभी भुगतान नहीं किया है, तो कृपया पहले ऊपर दिए गए UPI ऐप बटन द्वारा ₹' + currentAmount + ' का भुगतान पूर्ण करें।');
        return;
      }
      if (!hasPaidConfirmation) {
        setFormError('⚠️ कृपया नीचे दिए गए चेकबॉक्स पर टिक करके पुष्टि करें कि आपने प्रभु रामजी ट्रस्ट (dineshbirla312@ybl) को ₹' + currentAmount + ' का भुगतान सफलता पूर्वक कर दिया है।');
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
        date: new Date().toLocaleDateString('hi-IN', {
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

      // Automated Email Sending Utility: Immediately dispatch receipt to donor's registered email
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

  const handleSendEmailManually = async (emailOverride?: string) => {
    if (!generatedReceipt) return;
    const target = (emailOverride || manualEmailInput || generatedReceipt.email || '').trim();
    if (!target) {
      setEmailSendStatus({ status: 'error', message: 'कृपया वैध ईमेल पता दर्ज करें।' });
      return;
    }

    setEmailSendStatus({
      status: 'sending',
      message: `${target} पर आधिकारिक दान रसीद भेजी जा रही है...`,
      recipient: target
    });

    const res = await sendReceiptEmail(generatedReceipt, target);
    if (res.success) {
      setEmailSendStatus({
        status: 'sent',
        message: res.message,
        recipient: target
      });
      setManualEmailInput('');
    } else {
      setEmailSendStatus({
        status: 'error',
        message: res.message,
        recipient: target
      });
    }
  };

  return (
    <section id="donate" className="py-16 md:py-24 bg-gradient-to-b from-stone-50 via-amber-50/30 to-stone-100 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/80 px-3.5 py-1 rounded-full border border-emerald-300">
            पुण्य सहयोग महायज्ञ
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0f4d3a] mt-3">
            दान एवं सहयोग व्यवस्था
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
          <p className="text-stone-600 mt-4 text-base sm:text-lg">
            आश्रम निर्माण, हर शनिवार शाम भंडारा, प्रतिदिन चाय सेवा एवं गौसेवा में अपना पावन अंशदान समर्पित करें।
          </p>
        </div>

        {/* 12AB and 80G Transparency Status Banner */}
        <div className="mb-8 max-w-4xl mx-auto bg-amber-50 border border-amber-300/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-950 leading-relaxed">
            <strong className="font-bold text-amber-900 block mb-0.5">पारदर्शिता एवं कर-छूट स्थिति:</strong>
            {TRUST_INFO.taxExemptionStatus} दान करने के उपरांत ट्रस्ट की मुहर युक्त आधिकारिक डिजिटल रसीद तुरंत प्रदान की जाएगी।
          </div>
        </div>

        {/* DEDICATED SECTION: इच्छित / अन्य राशि सीधे UPI QR व 1-क्लिक भुगतान (Direct Custom Amount UPI Pay) */}
        <div id="custom-upi-pay" className="mb-14 bg-gradient-to-br from-[#08241b] via-[#0f4d3a] to-[#08241b] rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-amber-400/80 text-white relative overflow-hidden">
          {/* Subtle glow decorations */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none"></div>

          {/* Section Header */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-emerald-700/60 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold uppercase tracking-wider mb-2">
                <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>सीधा 1-क्लिक UPI दान केंद्र · Instant Direct Pay</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-wide">
                इच्छित / अन्य राशि सीधे UPI QR कोड से भुगतान करें
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl">
                अपनी श्रद्धानुसार कोई भी राशि (उदा. ₹51, ₹101, ₹250, ₹500, ₹1500 या अन्य) सीधे लाइव QR स्कैन करके अथवा PhonePe / GPay / Paytm से 1-क्लिक में तुरंत समर्पित करें।
              </p>
            </div>

            <div className="flex items-center gap-2.5 bg-emerald-950/90 px-4 py-2.5 rounded-2xl border border-amber-400/50 shadow-inner">
              <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0" />
              <div className="text-left text-xs">
                <span className="text-emerald-300 block text-[10px]">अधिकृत ट्रस्ट खाता</span>
                <strong className="text-amber-200 font-bold block">{TRUST_INFO.accountHolder}</strong>
                <span className="text-[10px] text-emerald-200 font-mono">IDBI Bank, सनावद</span>
              </div>
            </div>
          </div>

          {/* 1. Interactive Amount Picker & Custom Amount Input */}
          <div className="relative z-10 mb-8 bg-emerald-950/80 p-4 sm:p-6 rounded-2xl border border-emerald-600/40">
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-3">
              1. इच्छित सहयोग राशि चुनें या अपनी पसंद की कोई भी अन्य राशि लिखें (₹):
            </label>
            
            {/* Quick Amount Selector Pills */}
            <div className="flex flex-wrap gap-2 sm:gap-2.5 mb-4">
              {[51, 101, 251, 501, 1100, 2100, 5100, 11000].map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => {
                    setSelectedAmount(amt);
                    setCustomAmount('');
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    selectedAmount === amt && !customAmount
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-[#08241b] shadow-lg scale-105 border-2 border-amber-200 ring-2 ring-amber-400/50'
                      : 'bg-emerald-900/80 text-emerald-100 hover:bg-emerald-800 border border-emerald-700/50'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            {/* Custom Amount Field */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-8 relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-amber-400 font-bold text-lg">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="यहाँ कोई भी अन्य राशि लिखें (उदा. 150, 750, 3100)..."
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  min="1"
                  className="w-full pl-9 pr-4 py-3.5 bg-white text-stone-900 placeholder:text-stone-400 border-2 border-amber-400 rounded-xl text-base font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white shadow-inner"
                />
              </div>

              <div className="sm:col-span-4 bg-emerald-900/90 border border-emerald-500/60 px-4 py-3.5 rounded-xl text-center">
                <span className="text-[11px] text-emerald-300 block">वर्तमान चयनित राशि:</span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-amber-300">
                  ₹{currentAmount} /-
                </span>
              </div>
            </div>
          </div>

          {/* 2. Side-by-Side: Live Dynamic QR & Direct Mobile 1-Tap Pay */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Box: Live Dynamic UPI QR Code */}
            <div className="lg:col-span-5 bg-white text-stone-900 p-5 sm:p-6 rounded-2xl shadow-xl border-2 border-amber-400 text-center relative group">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0f4d3a]">
                  <QrCode className="w-4 h-4 text-emerald-700" />
                  <span>लाइव डायनामिक QR कोड</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#0f4d3a] text-xs font-extrabold border border-emerald-300">
                  ₹{currentAmount} प्री-लोडेड
                </span>
              </div>

              <div className="relative mx-auto w-60 max-w-full aspect-square bg-white p-2.5 rounded-xl border border-stone-200 shadow-inner flex items-center justify-center">
                {generatedQrUrl ? (
                  <img
                    src={generatedQrUrl}
                    alt={`Dynamic UPI QR Code for ₹${currentAmount}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={TRUST_INFO.phonePeQrUrl}
                    alt="PhonePe QR Code"
                    className="w-full h-full object-contain"
                  />
                )}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2.5 py-1 rounded-md shadow-md border border-stone-200 pointer-events-none">
                  <span className="text-xs font-extrabold tracking-wide text-[#0f4d3a]">
                    ₹{currentAmount}
                  </span>
                </div>
              </div>

              <div className="mt-3.5 text-xs space-y-1">
                <div className="font-bold text-stone-900 text-sm">
                  {TRUST_INFO.accountHolder}
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-stone-600 font-mono">
                  <span>UPI ID:</span>
                  <strong className="text-emerald-800 font-bold">{TRUST_INFO.upiId}</strong>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(TRUST_INFO.upiId, 'upi_custom')}
                    className="p-1 hover:bg-stone-100 rounded text-stone-500 hover:text-stone-800 cursor-pointer"
                    title="UPI ID कॉपी करें"
                  >
                    {copiedField === 'upi_custom' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-stone-500 pt-1 font-medium">
                  PhonePe, Google Pay, Paytm अथवा BHIM से स्कैन करके ₹{currentAmount} सीधे समर्पित करें।
                </p>
              </div>
            </div>

            {/* Right Box: Direct 1-Click Pay Buttons & Transition to Receipt */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block mb-2">
                  2. मोबाइल से 1-क्लिक में सीधा भुगतान करें:
                </span>
                <p className="text-xs sm:text-sm text-emerald-100/90 mb-3.5">
                  नीचे अपने पसंदीदा UPI ऐप पर क्लिक करें। ऐप स्वतः <strong>₹{currentAmount}</strong> की राशि के साथ तुरंत खुल जाएगा:
                </p>

                {/* 4 Direct 1-Click Mobile Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleDirectUpiPayment('phonepe')}
                    className="py-3 px-4 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-between cursor-pointer border border-purple-500 hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs">पे</div>
                      <div className="text-left">
                        <div className="leading-tight">PhonePe से पे करें</div>
                        <div className="text-[10px] text-purple-200">₹{currentAmount} ऑटो-फिल होगा</div>
                      </div>
                    </div>
                    <Zap className="w-4 h-4 text-yellow-300" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDirectUpiPayment('gpay')}
                    className="py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-between cursor-pointer border border-blue-400 hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs">G</div>
                      <div className="text-left">
                        <div className="leading-tight">Google Pay से पे करें</div>
                        <div className="text-[10px] text-blue-100">₹{currentAmount} ऑटो-फिल होगा</div>
                      </div>
                    </div>
                    <Zap className="w-4 h-4 text-yellow-300" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDirectUpiPayment('paytm')}
                    className="py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-between cursor-pointer border border-sky-400 hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs">P</div>
                      <div className="text-left">
                        <div className="leading-tight">Paytm से पे करें</div>
                        <div className="text-[10px] text-sky-100">₹{currentAmount} ऑटो-फिल होगा</div>
                      </div>
                    </div>
                    <Zap className="w-4 h-4 text-yellow-300" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDirectUpiPayment('universal')}
                    className="py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-between cursor-pointer border border-emerald-500 hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-5 h-5 text-amber-300" />
                      <div className="text-left">
                        <div className="leading-tight">अन्य किसी भी UPI से पे करें</div>
                        <div className="text-[10px] text-emerald-200">BHIM / Cred / Amazon</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-amber-300" />
                  </button>
                </div>
              </div>

              {/* Transition to Official Receipt */}
              <div className="pt-4 border-t border-emerald-700/60 bg-emerald-950/70 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-emerald-100">
                  <span className="font-bold text-amber-300 block mb-0.5">भुगतान पूर्ण कर लिया है?</span>
                  <span>अपनी आधिकारिक डिजिटल पावती रसीद व 12 अंकों का UTR दर्ज करने के लिए नीचे फॉर्म भरें।</span>
                </div>
                <button
                  type="button"
                  onClick={scrollToReceiptForm}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#08241b] font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
                >
                  <FileText className="w-4 h-4" />
                  <span>आधिकारिक रसीद प्राप्त करें</span>
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Official PhonePe QR Image & Bank Details */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Interactive Payment Modes Selection Tabs */}
            <div className="bg-stone-100/80 p-1.5 rounded-2xl border border-stone-300 shadow-2xs grid grid-cols-4 gap-1">
              <button
                type="button"
                onClick={() => {
                  setActivePaymentTab('phonepe');
                  setPaymentMode('PhonePe QR / UPI');
                }}
                className={`py-2 px-1 text-center rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                  activePaymentTab === 'phonepe'
                    ? 'bg-purple-700 text-white shadow-sm font-bold'
                    : 'text-stone-700 hover:bg-white/80 font-semibold'
                }`}
              >
                <div className="text-[12px] sm:text-xs leading-tight">PhonePe</div>
                <div className={`text-[9px] ${activePaymentTab === 'phonepe' ? 'text-purple-200' : 'text-stone-500'}`}>QR कोड</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActivePaymentTab('gpay');
                  setPaymentMode('Google Pay (GPay)');
                }}
                className={`py-2 px-1 text-center rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                  activePaymentTab === 'gpay'
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-stone-700 hover:bg-white/80 font-semibold'
                }`}
              >
                <div className="text-[12px] sm:text-xs leading-tight">Google Pay</div>
                <div className={`text-[9px] ${activePaymentTab === 'gpay' ? 'text-blue-100' : 'text-stone-500'}`}>GPay QR</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActivePaymentTab('paytm');
                  setPaymentMode('Paytm / अन्य UPI');
                }}
                className={`py-2 px-1 text-center rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                  activePaymentTab === 'paytm'
                    ? 'bg-sky-600 text-white shadow-sm font-bold'
                    : 'text-stone-700 hover:bg-white/80 font-semibold'
                }`}
              >
                <div className="text-[12px] sm:text-xs leading-tight">Paytm</div>
                <div className={`text-[9px] ${activePaymentTab === 'paytm' ? 'text-sky-100' : 'text-stone-500'}`}>BHIM/UPI</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActivePaymentTab('bank');
                  setPaymentMode('सीधे बैंक ट्रांसफर (IDBI)');
                }}
                className={`py-2 px-1 text-center rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                  activePaymentTab === 'bank'
                    ? 'bg-[#0f4d3a] text-white shadow-sm font-bold'
                    : 'text-stone-700 hover:bg-white/80 font-semibold'
                }`}
              >
                <div className="text-[12px] sm:text-xs leading-tight">बैंक खाता</div>
                <div className={`text-[9px] ${activePaymentTab === 'bank' ? 'text-emerald-200' : 'text-stone-500'}`}>NEFT/IMPS</div>
              </button>
            </div>

            {/* TAB 1: PHONEPE QR CARD */}
            {activePaymentTab === 'phonepe' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-purple-400 text-center relative overflow-hidden animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-purple-700" />
                    <span className="font-heading font-bold text-purple-900 text-base">
                      आधिकारिक PhonePe QR कोड
                    </span>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
                    PhonePe Verified
                  </span>
                </div>

                <div className="relative mx-auto w-64 max-w-full bg-white p-2 rounded-2xl shadow-inner border border-purple-200 group">
                  <img
                    src={TRUST_INFO.phonePeQrUrl}
                    alt="PhonePe QR Code - Gulabchand S/O Hiralal - Prabhu Ramji Trust"
                    className="w-full h-auto rounded-xl object-contain mx-auto"
                  />
                  <button
                    onClick={() => setIsQrModalOpen(true)}
                    className="absolute bottom-3 right-3 p-2 bg-purple-900/80 hover:bg-purple-950 text-white rounded-lg opacity-85 group-hover:opacity-100 transition-opacity"
                    title="बड़ा देखें"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 text-xs">
                  <div className="font-bold text-stone-900 text-sm">
                    {TRUST_INFO.accountHolder}
                  </div>
                  <div className="text-stone-600 font-mono mt-0.5">
                    UPI ID: <strong className="text-purple-800">{TRUST_INFO.upiId}</strong>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    PhonePe ऐप खोलें और इस QR को स्कैन करें अथवा नीचे बटन दबाएं।
                  </p>
                </div>

                <div className="mt-4 pt-3 space-y-2">
                  <button
                    type="button"
                    onClick={() => handleDirectUpiPayment('phonepe')}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs sm:text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4 text-amber-300" />
                    <span>PhonePe ऐप में सीधे खोलें (₹{currentAmount})</span>
                    <Zap className="w-3.5 h-3.5 text-yellow-300" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: GOOGLE PAY (GPAY) QR CARD */}
            {activePaymentTab === 'gpay' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-blue-400 text-center relative overflow-hidden animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-blue-600" />
                    <span className="font-heading font-bold text-blue-900 text-base">
                      Google Pay (GPay) आधिकारिक QR कोड
                    </span>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    Google Pay Verified
                  </span>
                </div>

                <div className="relative mx-auto w-64 max-w-full bg-white p-3 rounded-2xl shadow-inner border border-blue-200 group">
                  {generatedQrUrl ? (
                    <img
                      src={generatedQrUrl}
                      alt="Google Pay QR Code - Prabhu Ramji Trust"
                      className="w-full h-auto rounded-xl object-contain mx-auto"
                    />
                  ) : (
                    <img
                      src={TRUST_INFO.phonePeQrUrl}
                      alt="UPI QR Code"
                      className="w-full h-auto rounded-xl object-contain mx-auto"
                    />
                  )}

                  {/* Google Pay Center Badge */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded-md shadow-md border border-stone-200 pointer-events-none">
                    <span className="text-[10px] font-extrabold tracking-wide text-blue-600">GPay</span>
                  </div>

                  <button
                    onClick={() => setIsQrModalOpen(true)}
                    className="absolute bottom-3 right-3 p-2 bg-blue-900/80 hover:bg-blue-950 text-white rounded-lg opacity-85 group-hover:opacity-100 transition-opacity"
                    title="बड़ा देखें"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 text-xs space-y-1">
                  <div className="font-bold text-stone-900 text-sm">
                    {TRUST_INFO.accountHolder}
                  </div>
                  <div className="text-stone-600 font-mono">
                    UPI ID: <strong className="text-blue-700">{TRUST_INFO.upiId}</strong>
                  </div>
                  <div className="inline-block px-3 py-1 bg-blue-50 text-blue-900 font-bold rounded-lg border border-blue-200 text-xs mt-1">
                    निर्धारित सहयोग राशि: ₹{currentAmount} /-
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Google Pay स्कैनर से इस QR को स्कैन करें अथवा नीचे दिए गए बटन पर टैप करें।
                  </p>
                </div>

                <div className="mt-4 pt-3 space-y-2">
                  <button
                    type="button"
                    onClick={() => handleDirectUpiPayment('gpay')}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4 text-amber-300" />
                    <span>Google Pay ऐप में सीधे खोलें (₹{currentAmount})</span>
                    <Zap className="w-3.5 h-3.5 text-yellow-300" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: PAYTM / BHIM UPI QR CARD */}
            {activePaymentTab === 'paytm' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-sky-400 text-center relative overflow-hidden animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-sky-600" />
                    <span className="font-heading font-bold text-sky-900 text-base">
                      Paytm / BHIM UPI QR कोड
                    </span>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-200">
                    Paytm Verified
                  </span>
                </div>

                <div className="relative mx-auto w-64 max-w-full bg-white p-3 rounded-2xl shadow-inner border border-sky-200 group">
                  {generatedQrUrl ? (
                    <img
                      src={generatedQrUrl}
                      alt="Paytm UPI QR Code"
                      className="w-full h-auto rounded-xl object-contain mx-auto"
                    />
                  ) : (
                    <img
                      src={TRUST_INFO.phonePeQrUrl}
                      alt="UPI QR Code"
                      className="w-full h-auto rounded-xl object-contain mx-auto"
                    />
                  )}
                  <button
                    onClick={() => setIsQrModalOpen(true)}
                    className="absolute bottom-3 right-3 p-2 bg-sky-900/80 hover:bg-sky-950 text-white rounded-lg opacity-85 group-hover:opacity-100 transition-opacity"
                    title="बड़ा देखें"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 text-xs space-y-1">
                  <div className="font-bold text-stone-900 text-sm">
                    {TRUST_INFO.accountHolder}
                  </div>
                  <div className="text-stone-600 font-mono">
                    UPI ID: <strong className="text-sky-700">{TRUST_INFO.upiId}</strong>
                  </div>
                  <div className="inline-block px-3 py-1 bg-sky-50 text-sky-900 font-bold rounded-lg border border-sky-200 text-xs mt-1">
                    सहयोग राशि: ₹{currentAmount} /-
                  </div>
                </div>

                <div className="mt-4 pt-3 space-y-2">
                  <button
                    type="button"
                    onClick={() => handleDirectUpiPayment('paytm')}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs sm:text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4 text-amber-300" />
                    <span>Paytm ऐप में सीधे खोलें (₹{currentAmount})</span>
                    <Zap className="w-3.5 h-3.5 text-yellow-300" />
                  </button>
                </div>
              </div>
            )}

            {/* Quick 1-Tap App Launchers for all apps */}
            {activePaymentTab !== 'bank' && (
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <button
                    type="button"
                    onClick={() => handleDirectUpiPayment('phonepe')}
                    className={`py-2 px-1.5 rounded-xl border transition-all flex flex-col items-center justify-center cursor-pointer shadow-xs active:scale-95 ${
                      activePaymentTab === 'phonepe'
                        ? 'bg-purple-100 border-purple-400 text-purple-900 font-bold ring-2 ring-purple-300/40'
                        : 'bg-white hover:bg-purple-50 border-purple-200 text-purple-900'
                    }`}
                    title="PhonePe में खोलें"
                  >
                    <span className="text-xs font-bold text-purple-700">PhonePe</span>
                    <span className="text-[10px] text-purple-600 font-medium">सीधे खोलें</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDirectUpiPayment('gpay')}
                    className={`py-2 px-1.5 rounded-xl border transition-all flex flex-col items-center justify-center cursor-pointer shadow-xs active:scale-95 ${
                      activePaymentTab === 'gpay'
                        ? 'bg-blue-100 border-blue-400 text-blue-900 font-bold ring-2 ring-blue-300/40'
                        : 'bg-white hover:bg-blue-50 border-blue-200 text-blue-900'
                    }`}
                    title="Google Pay में खोलें"
                  >
                    <span className="text-xs font-bold text-blue-700">Google Pay</span>
                    <span className="text-[10px] text-blue-600 font-medium">सीधे खोलें</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDirectUpiPayment('paytm')}
                    className={`py-2 px-1.5 rounded-xl border transition-all flex flex-col items-center justify-center cursor-pointer shadow-xs active:scale-95 ${
                      activePaymentTab === 'paytm'
                        ? 'bg-sky-100 border-sky-400 text-sky-900 font-bold ring-2 ring-sky-300/40'
                        : 'bg-white hover:bg-sky-50 border-sky-200 text-sky-900'
                    }`}
                    title="Paytm में खोलें"
                  >
                    <span className="text-xs font-bold text-sky-700">Paytm</span>
                    <span className="text-[10px] text-sky-600 font-medium">सीधे खोलें</span>
                  </button>
                </div>

                {upiToast && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-medium text-center animate-fadeIn shadow-xs">
                    {upiToast}
                  </div>
                )}
              </div>
            )}

            {/* Bank Transfer Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#0f4d3a]" />
                  <h3 className="font-heading text-base font-bold text-[#0f4d3a]">
                    सीधे बैंक ट्रांसफर (NEFT / IMPS)
                  </h3>
                </div>
                <span className="text-xs text-stone-500">IDBI बैंक</span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                
                {/* Account Number */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <div className="text-[11px] text-stone-500">खाता संख्या (A/C No.)</div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="font-mono text-base font-bold text-stone-900 tracking-wider">
                      {TRUST_INFO.accountNumber}
                    </span>
                    <button
                      onClick={() => copyToClipboard(TRUST_INFO.accountNumber, 'acc')}
                      className="p-1 text-stone-500 hover:text-[#0f4d3a] rounded"
                      title="कॉपी करें"
                    >
                      {copiedField === 'acc' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* IFSC */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <div className="text-[11px] text-stone-500">IFSC कोड</div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="font-mono text-base font-bold text-stone-900 tracking-wider">
                      {TRUST_INFO.ifscCode}
                    </span>
                    <button
                      onClick={() => copyToClipboard(TRUST_INFO.ifscCode, 'ifsc')}
                      className="p-1 text-stone-500 hover:text-[#0f4d3a] rounded"
                      title="कॉपी करें"
                    >
                      {copiedField === 'ifsc' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <div className="text-[11px] text-stone-500">खाता धारक का नाम</div>
                  <div className="font-semibold text-stone-900 text-xs sm:text-sm mt-0.5">
                    {TRUST_INFO.accountHolder}
                  </div>
                </div>

                {/* Bank Name */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <div className="text-[11px] text-stone-500">बैंक व शाखा</div>
                  <div className="font-medium text-stone-900 text-xs sm:text-sm mt-0.5">
                    {TRUST_INFO.bankName}, शाखा: {TRUST_INFO.branchName}
                  </div>
                </div>

              </div>
            </div>

            {/* Direct Step-by-Step Guide for UPI & Bank Donors to get Receipt ID */}
            <div className="bg-emerald-50/90 rounded-3xl p-5 border border-emerald-200 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>UPI या बैंक से भेजने के बाद रसीद ID कैसे प्राप्त करें?</span>
              </div>
              <ol className="text-xs text-emerald-900 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                  <span>PhonePe QR या बैंक में राशि भेजने के बाद दाएँ तरफ दिए फॉर्म में अपना <strong>नाम, मोबाइल नंबर</strong> और <strong>राशि</strong> दर्ज करें।</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                  <span><strong>"दान विवरण जमा करें व रसीद प्राप्त करें"</strong> पर क्लिक करते ही आपकी आधिकारिक <strong>रसीद संख्या (PRT-2026-XXXX)</strong> तुरंत स्क्रीन पर जनरेट हो जाएगी।</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                  <span>अथवा सीधे WhatsApp (<a href={TRUST_INFO.whatsappContactUrl} target="_blank" rel="noopener noreferrer" className="font-bold underline text-emerald-950 hover:text-emerald-800">{TRUST_INFO.phone}</a>) पर पेमेंट स्क्रीनशॉट भेजकर भी अपनी रसीद संख्या मँगवा सकते हैं।</span>
                </li>
              </ol>
            </div>

          </div>

          {/* Right Column: Interactive Donation Form with Cause & Instant Receipt */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-stone-200">
              
              <div className="flex items-center justify-between pb-6 border-b border-stone-100">
                <div>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#0f4d3a]">
                    दान दर्ज करें एवं डिजिटल पावती प्राप्त करें
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                    दान के पश्चात आधिकारिक रसीद प्रिंट अथवा PDF में तुरंत सहेजें
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full overflow-hidden border border-amber-400 shrink-0">
                  <img src={TRUST_INFO.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                </div>
              </div>

              <form onSubmit={handleOnlineDonationConfirm} className="space-y-6 pt-6">
                
                {/* 1. Cause Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    सहयोग प्रकल्प चुनें (Select Cause)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {causes.map((c) => (
                      <button
                        type="button"
                        key={c.title}
                        onClick={() => setSelectedCause(c.title)}
                        className={`text-left p-3 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer ${
                          selectedCause === c.title
                            ? 'bg-emerald-50 border-emerald-600 text-[#0f4d3a] font-bold shadow-xs'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{c.title}</span>
                          {selectedCause === c.title && (
                            <Check className="w-4 h-4 text-emerald-700" />
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 font-normal mt-0.5 line-clamp-1">
                          {c.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Amount Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    सहयोग राशि चुनें (Amount - ₹)
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {presetAmounts.map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => {
                          setSelectedAmount(amt);
                          setCustomAmount('');
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                          selectedAmount === amt && !customAmount
                            ? 'bg-[#0f4d3a] text-white shadow-sm'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-500 font-bold text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="अन्य इच्छित राशि यहाँ लिखें..."
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      min="1"
                      className="w-full pl-8 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0f4d3a] focus:bg-white"
                    />
                  </div>
                </div>

                {/* 3. Donor Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      दानदाता का पूरा नाम *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. श्री रमेश पाटीदार"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4d3a] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      मोबाइल नंबर * (10 अंक)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="उदा. 98260XXXXX"
                      value={donorMobile}
                      onChange={(e) => setDonorMobile(e.target.value)}
                      maxLength={12}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4d3a] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center justify-between">
                      <span>ईमेल आईडी (Email)</span>
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        📧 रसीद तुरंत इनबॉक्स में पाएँ
                      </span>
                    </label>
                    <input
                      type="email"
                      placeholder="उदा. name@example.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4d3a] focus:bg-white"
                    />
                    <span className="text-[10px] text-emerald-700 mt-1 block">
                      दान दर्ज होते ही आधिकारिक डिजिटल रसीद सीधे इस ईमेल पर तुरंत प्रेषित होगी
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      पैन नंबर (वैकल्पिक)
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. ABCDE1234F"
                      value={donorPan}
                      onChange={(e) => setDonorPan(e.target.value)}
                      maxLength={10}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-[#0f4d3a] focus:bg-white"
                    />
                  </div>
                </div>

                {/* 4. Payment Method & Ref */}
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-stone-700">
                        भुगतान का माध्यम (Payment Method) *
                      </label>
                      <span className="text-[11px] text-stone-500">
                        चयनित: <strong className="text-[#0f4d3a]">{paymentMode}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMode('PhonePe QR / UPI');
                          setActivePaymentTab('phonepe');
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                          paymentMode.includes('PhonePe')
                            ? 'border-purple-600 bg-purple-50 text-purple-950 font-bold ring-2 ring-purple-400/40 shadow-xs'
                            : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-lg bg-purple-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                          पे
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold leading-tight">PhonePe</div>
                          <div className="text-[10px] text-stone-500">QR / UPI</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMode('Google Pay (GPay)');
                          setActivePaymentTab('gpay');
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                          paymentMode.includes('Google Pay')
                            ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold ring-2 ring-blue-400/40 shadow-xs'
                            : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                          G
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold leading-tight">Google Pay</div>
                          <div className="text-[10px] text-stone-500">GPay QR</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMode('Paytm / अन्य UPI');
                          setActivePaymentTab('paytm');
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                          paymentMode.includes('Paytm')
                            ? 'border-sky-600 bg-sky-50 text-sky-950 font-bold ring-2 ring-sky-400/40 shadow-xs'
                            : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                          P
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold leading-tight">Paytm</div>
                          <div className="text-[10px] text-stone-500">BHIM / UPI</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMode('सीधे बैंक ट्रांसफर (IDBI)');
                          setActivePaymentTab('bank');
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                          paymentMode.includes('बैंक')
                            ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-400/40 shadow-xs'
                            : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs'
                        }`}
                      >
                        <Building2 className="w-5 h-5 text-emerald-700 shrink-0" />
                        <div className="truncate">
                          <div className="text-xs font-bold leading-tight">बैंक खाता</div>
                          <div className="text-[10px] text-stone-500">NEFT / IMPS</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMode('नकद (आश्रम कार्यालय)');
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                          paymentMode.includes('नकद')
                            ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold ring-2 ring-amber-400/40 shadow-xs'
                            : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs'
                        }`}
                      >
                        <Banknote className="w-5 h-5 text-amber-700 shrink-0" />
                        <div className="truncate">
                          <div className="text-xs font-bold leading-tight">नकद काउंटर</div>
                          <div className="text-[10px] text-stone-500">कार्यालय रसीद</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMode('अन्य UPI (BHIM/Cred/Amazon)');
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                          paymentMode.includes('अन्य UPI')
                            ? 'border-teal-600 bg-teal-50 text-teal-950 font-bold ring-2 ring-teal-400/40 shadow-xs'
                            : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs'
                        }`}
                      >
                        <Smartphone className="w-5 h-5 text-teal-700 shrink-0" />
                        <div className="truncate">
                          <div className="text-xs font-bold leading-tight">अन्य UPI</div>
                          <div className="text-[10px] text-stone-500">BHIM / Cred</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      UTR / UPI संदर्भ संख्या (12 अंकों का UTR / Transaction No - वैकल्पिक)
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. 423489123011 (PhonePe, GPay या बैंक UTR)"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4d3a] focus:bg-white"
                    />
                    <p className="text-[11px] text-stone-500 mt-1">
                      💡 PhonePe, Google Pay या Paytm में सफल भुगतान के बाद दिखने वाला 12 अंकों का UTR नंबर यहाँ दर्ज कर सकते हैं।
                    </p>
                  </div>
                </div>

                {/* Submit / Generate Receipt Action */}
                <div className="pt-4 space-y-2">
                  {formError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold rounded-xl text-center animate-fadeIn">
                      ⚠️ {formError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 text-base font-bold text-white bg-gradient-to-r from-[#0f4d3a] via-[#145e47] to-[#0f4d3a] hover:from-[#135a44] hover:to-[#0f4d3a] rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 border border-amber-400/40 animate-sacred-glow"
                  >
                    <HeartHandshake className="w-5 h-5 text-amber-300" />
                    <span>
                      {isSubmitting ? 'रसीद तैयार हो रही है...' : `₹${currentAmount} का सहयोग दर्ज करें व रसीद प्राप्त करें`}
                    </span>
                  </button>
                  <p className="text-xs text-center text-stone-500 mt-2">
                    सुरक्षित डिजिटल पावती · दान का रिकॉर्ड ट्रस्ट बहीखाते में सुरक्षित रहेगा
                  </p>
                </div>

              </form>

            </div>
          </div>

        </div>

      </div>

      {/* Generated Official Receipt Modal */}
      {generatedReceipt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs p-2 sm:p-4 md:p-6">
          <div className="min-h-full flex items-start sm:items-center justify-center py-2 sm:py-6">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-8 shadow-2xl border-4 border-[#0f4d3a] relative animate-in zoom-in-95 duration-200 my-2 sm:my-auto">
              
              {/* Top Close Button for Mobile Accessibility */}
              <button
                onClick={() => setGeneratedReceipt(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-stone-500 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer z-30 shadow-xs no-print"
                title="रसीद बंद करें"
                aria-label="रसीद विंडो बंद करें"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Printable Receipt Container */}
              <div id="printable-receipt" className="space-y-6">
              
              {/* Header with Official Logo */}
              <div className="receipt-header text-center pb-4 border-b-2 border-stone-800">
                <div className="receipt-logo w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-amber-500 shadow mb-2 bg-[#08241b]">
                  <img src={TRUST_INFO.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                  ॥ श्री गणेशाय नमः ॥ श्री जानकीनाथ सहाय ॥
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#0f4d3a] mt-1">
                  {TRUST_INFO.name}
                </h2>
                <p className="text-xs sm:text-sm font-medium text-stone-700">
                  {TRUST_INFO.fullAddress}
                </p>
                <div className="text-xs text-stone-600 mt-1">
                  वेबसाइट: <span className="font-mono font-semibold text-emerald-800">https://prabhuramjitrustram.ai.studio/</span> | हेल्पलाइन: {TRUST_INFO.phone}
                </div>
                <div className="receipt-badge inline-block mt-2 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-900">
                  आधिकारिक दान पावती रसीद (Official Donation Receipt)
                </div>
              </div>

              {/* Receipt Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-stone-500 block">रसीद संख्या:</span>
                  <strong className="font-mono text-stone-900 font-bold">{generatedReceipt.receiptNo}</strong>
                </div>
                <div className="text-right">
                  <span className="text-stone-500 block">दिनांक:</span>
                  <strong className="text-stone-900">{generatedReceipt.date}</strong>
                </div>

                <div>
                  <span className="text-stone-500 block">दानदाता का नाम:</span>
                  <strong className="text-base text-stone-900 font-bold">{generatedReceipt.donorName}</strong>
                </div>
                <div className="text-right">
                  <span className="text-stone-500 block">मोबाइल नंबर:</span>
                  <strong className="font-mono text-stone-900">{generatedReceipt.mobile}</strong>
                </div>

                {generatedReceipt.pan && (
                  <div>
                    <span className="text-stone-500 block">पैन नंबर (PAN):</span>
                    <strong className="font-mono text-stone-900">{generatedReceipt.pan}</strong>
                  </div>
                )}

                <div className={generatedReceipt.pan ? 'text-right' : 'col-span-2'}>
                  <span className="text-stone-500 block">सहयोग प्रकल्प / उद्देश्य:</span>
                  <strong className="text-emerald-900 font-semibold">{generatedReceipt.cause}</strong>
                </div>
              </div>

              {/* Amount Box */}
              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-amber-300 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-500 block">प्राप्त सहयोग राशि:</span>
                  <span className="text-xl sm:text-2xl font-bold font-mono text-[#0f4d3a]">
                    ₹{generatedReceipt.amount.toLocaleString('en-IN')} /-
                  </span>
                </div>
                <div className="text-right text-xs text-stone-600">
                  <div>माध्यम: <strong>{generatedReceipt.paymentMode}</strong></div>
                  <div>संदर्भ: <span className="font-mono">{generatedReceipt.transactionRef}</span></div>
                </div>
              </div>

              {/* Legal Transparency Note */}
              <div className="text-[11px] text-stone-500 border-t border-stone-200 pt-3 leading-relaxed">
                <strong>पारदर्शिता सूचना:</strong> प्रभु रामजी ट्रस्ट द्वारा प्राप्त समस्त दान राशि का उपयोग नियमानुसार गौसेवा, प्रतिदिन चाय सेवा, शनिवार शाम भंडारा व आश्रम निर्माण में किया जाता है। ट्रस्ट का 12AB एवं 80G पंजीकरण आयकर विभाग में प्रक्रियाधीन है।
              </div>

              {/* Signatures & Official Stamp */}
              <div className="receipt-signatures pt-4 flex items-end justify-between text-xs">
                <div className="text-center">
                  <div className="receipt-stamp w-16 h-16 mx-auto rounded-full border-2 border-dashed border-emerald-700/60 flex items-center justify-center p-1 text-[10px] text-emerald-800 font-bold leading-tight">
                    प्रभु रामजी ट्रस्ट<br />गलगाँव
                  </div>
                  <span className="stamp-label text-[10px] text-stone-500 mt-1 block">आधिकारिक मुहर</span>
                </div>

                <div className="signatory-block text-right text-stone-700">
                  <div className="signatory-name font-serif italic font-bold text-stone-800 mb-1">दिनेश बिड़ला / गुलाबचंद</div>
                  <div className="signatory-role text-[11px] font-semibold text-stone-900">अधिकृत हस्ताक्षरकर्ता (Authorized Signatory)</div>
                  <div className="signatory-org text-[10px] text-stone-500">प्रभु रामजी ट्रस्ट, गलगाँव (सनावद)</div>
                </div>
              </div>

              {/* Dual Verification Security Notice for Future Downloads */}
              <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950 leading-relaxed no-print">
                🔒 <strong>सुरक्षित रसीद सूचना:</strong> भविष्य में वेबसाइट पर रसीद खोजने के लिए अपना 10 अंकों का मोबाइल नंबर एवं यह रसीद क्रमांक <strong>"{generatedReceipt.receiptNo}"</strong> सुरक्षित रखें। गोपनीयता सुरक्षा हेतु दोनों विवरण दर्ज करने पर ही रसीद प्राप्त होगी।
              </div>

              {/* Official Email Sending Utility Card */}
              <div className="mt-4 bg-gradient-to-br from-emerald-50 via-amber-50/40 to-emerald-50 border border-emerald-300 rounded-2xl p-4 shadow-sm no-print">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 pb-2 border-b border-emerald-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                      <Mail className="w-4 h-4 text-amber-300" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-emerald-950">
                        ईमेल पर आधिकारिक रसीद प्राप्त करें
                      </h4>
                      <p className="text-[11px] text-emerald-800">
                        ट्रस्ट के आधिकारिक ईमेल (<strong className="font-mono text-emerald-900">dineshbirla312@gmail.com</strong>) द्वारा रसीद सीधे इनबॉक्स में प्राप्त करें
                      </p>
                    </div>
                  </div>

                  {emailSendStatus.status === 'sent' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ईमेल भेजा गया
                    </span>
                  )}
                </div>

                {emailSendStatus.status === 'sending' ? (
                  <div className="p-3 bg-white rounded-xl border border-emerald-300 flex items-center gap-2.5 text-xs text-emerald-900 font-semibold shadow-xs">
                    <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                    <span>{emailSendStatus.message || 'dineshbirla312@gmail.com से ईमेल भेजा जा रहा है...'}</span>
                  </div>
                ) : emailSendStatus.status === 'sent' ? (
                  <div className="space-y-2.5 bg-white p-3 rounded-xl border border-emerald-300 shadow-xs">
                    <div className="flex items-start gap-2 text-xs text-emerald-950">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <strong className="block font-bold text-emerald-900">
                          {emailSendStatus.message}
                        </strong>
                        <div className="text-[11px] text-stone-600 space-y-0.5 mt-0.5">
                          <div>प्रेषक (Sender): <strong className="font-mono text-emerald-800">dineshbirla312@gmail.com</strong> (प्रभु रामजी ट्रस्ट)</div>
                          <div>प्राप्तकर्ता: <strong className="font-mono text-stone-900">{emailSendStatus.recipient}</strong> (इनबॉक्स / स्पैम फ़ोल्डर देखें)</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-100 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setEmailSendStatus({ status: 'idle', message: '' })}
                        className="text-emerald-800 hover:text-emerald-950 font-semibold underline cursor-pointer"
                      >
                        किसी अन्य ईमेल पते पर भी भेजें
                      </button>

                      <a
                        href={getReceiptMailtoLink(generatedReceipt, emailSendStatus.recipient || '')}
                        className="inline-flex items-center gap-1 text-stone-600 hover:text-stone-900 font-medium underline"
                      >
                        <Mail className="w-3 h-3" />
                        <span>Email App में ड्राफ्ट खोलें</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {emailSendStatus.status === 'error' && (
                      <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                        <span>{emailSendStatus.message}</span>
                      </div>
                    )}

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendEmailManually();
                      }}
                      className="flex flex-wrap sm:flex-nowrap items-center gap-2"
                    >
                      <div className="relative flex-1 min-w-[220px]">
                        <input
                          type="email"
                          required
                          placeholder="अपना ईमेल दर्ज करें (उदा. rahul@example.com)"
                          value={manualEmailInput || (manualEmailInput === '' && generatedReceipt.email ? generatedReceipt.email : '')}
                          onChange={(e) => setManualEmailInput(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-emerald-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0f4d3a] shadow-xs"
                        />
                      </div>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#0f4d3a] hover:bg-[#125a44] rounded-xl shadow-md transition-all cursor-pointer shrink-0"
                      >
                        <Send className="w-3.5 h-3.5 text-amber-300" />
                        <span>ईमेल पर भेजें</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Controls (Not printed) */}
            <div className="mt-6 pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 no-print">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#0f4d3a] hover:bg-[#125a44] rounded-xl shadow cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>रसीद प्रिंट / PDF सेव करें</span>
                </button>
              </div>

              <button
                onClick={() => setGeneratedReceipt(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-300 rounded-xl"
              >
                बंद करें
              </button>
            </div>

          </div>
        </div>
      </div>
      )}

      {/* QR Code Full Screen Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-heading font-bold text-[#0f4d3a] text-base sm:text-lg">
                {activePaymentTab === 'gpay'
                  ? 'Google Pay (GPay) अधिकृत QR'
                  : activePaymentTab === 'paytm'
                  ? 'Paytm / BHIM UPI अधिकृत QR'
                  : 'PhonePe अधिकृत QR कोड'}
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                activePaymentTab === 'gpay'
                  ? 'bg-blue-100 text-blue-900 border border-blue-200'
                  : activePaymentTab === 'paytm'
                  ? 'bg-sky-100 text-sky-900 border border-sky-200'
                  : 'bg-purple-100 text-purple-900 border border-purple-200'
              }`}>
                {activePaymentTab === 'gpay' ? 'Google Pay' : activePaymentTab === 'paytm' ? 'Paytm' : 'PhonePe'}
              </span>
            </div>

            <div className="w-full aspect-square p-2 border border-stone-200 rounded-2xl bg-white flex items-center justify-center relative">
              <img
                src={activePaymentTab === 'gpay' || activePaymentTab === 'paytm' ? (generatedQrUrl || TRUST_INFO.phonePeQrUrl) : TRUST_INFO.phonePeQrUrl}
                alt="Payment QR"
                className="w-full h-full object-contain"
              />
              {activePaymentTab === 'gpay' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded-md shadow-md border border-stone-200 pointer-events-none">
                  <span className="text-[11px] font-extrabold tracking-wide text-blue-600">GPay</span>
                </div>
              )}
            </div>

            <div className="space-y-1 text-xs">
              <p className="font-mono font-bold text-stone-800">{TRUST_INFO.accountHolder}</p>
              <p className="font-mono text-emerald-800">UPI ID: <strong>{TRUST_INFO.upiId}</strong></p>
              <div className="inline-block px-3 py-1 bg-amber-50 text-amber-900 font-bold rounded-lg border border-amber-200 text-xs">
                सहयोग राशि: ₹{currentAmount} /-
              </div>
            </div>

            <button
              onClick={() => setIsQrModalOpen(false)}
              className="w-full py-2.5 bg-stone-200 hover:bg-stone-300 rounded-xl text-xs font-bold text-stone-800 transition-colors cursor-pointer"
            >
              बंद करें
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
