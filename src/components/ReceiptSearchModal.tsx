import React, { useState } from 'react';
import { StorageService } from '../utils/storage';
import { DonationReceipt } from '../types';
import { TRUST_INFO } from '../data/defaultData';
import { 
  Search, 
  X, 
  Printer, 
  FileText, 
  ShieldCheck, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  Phone, 
  Hash, 
  RotateCcw,
  MessageCircle,
  ArrowRight,
  HelpCircle,
  Sparkles,
  Mail,
  Send,
  Loader2
} from 'lucide-react';
import { sendReceiptEmail, getReceiptMailtoLink } from '../utils/emailService';

interface ReceiptSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptSearchModal: React.FC<ReceiptSearchModalProps> = ({ isOpen, onClose }) => {
  const [phone, setPhone] = useState('');
  const [receiptId, setReceiptId] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<DonationReceipt | null>(null);
  const [emailStatus, setEmailStatus] = useState<{
    status: 'idle' | 'sending' | 'sent' | 'error';
    message: string;
    recipient?: string;
  }>({ status: 'idle', message: '' });
  const [searchEmailInput, setSearchEmailInput] = useState<string>('');

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setReceiptData(null);
    setEmailStatus({ status: 'idle', message: '' });

    const cleanPhoneDigits = phone.trim().replace(/[^0-9]/g, '');
    const cleanReceiptId = receiptId.trim();

    // Strict client-side validation: Both fields must be provided before querying StorageService
    if (cleanPhoneDigits.length < 10) {
      setErrorMessage('कृपया दानदाता का पूरा 10 अंकों का पंजीकृत मोबाइल नंबर (Phone) दर्ज करें।');
      setHasSearched(false);
      return;
    }

    if (!cleanReceiptId) {
      setErrorMessage('कृपया आधिकारिक रसीद क्रमांक (Receipt ID) या 12 अंकों का UPI UTR नंबर दर्ज करें।');
      setHasSearched(false);
      return;
    }

    // Strict lookup: require both 'phone' and 'receiptId' (or UPI UTR) to match existing entries in StorageService
    const matchedEntry = StorageService.findReceiptByPhoneAndReceiptId(cleanPhoneDigits, cleanReceiptId);

    setHasSearched(true);
    setReceiptData(matchedEntry);
  };

  const handleSendSearchReceiptEmail = async () => {
    if (!receiptData) return;
    const target = (searchEmailInput || receiptData.email || '').trim();
    if (!target) {
      setEmailStatus({ status: 'error', message: 'कृपया वैध ईमेल पता दर्ज करें।' });
      return;
    }

    setEmailStatus({
      status: 'sending',
      message: `${target} पर आधिकारिक रसीद भेजी जा रही है...`,
      recipient: target
    });

    const res = await sendReceiptEmail(receiptData, target);
    if (res.success) {
      setEmailStatus({
        status: 'sent',
        message: res.message,
        recipient: target
      });
      setSearchEmailInput('');
    } else {
      setEmailStatus({
        status: 'error',
        message: res.message,
        recipient: target
      });
    }
  };

  const resetSearch = () => {
    setPhone('');
    setReceiptId('');
    setHasSearched(false);
    setErrorMessage(null);
    setReceiptData(null);
    setEmailStatus({ status: 'idle', message: '' });
    setSearchEmailInput('');
  };

  const handleGoToDonationForm = () => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById('donate');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const whatsappReceiptQueryUrl = `https://api.whatsapp.com/send?phone=919575301233&text=${encodeURIComponent(
    `नमस्ते प्रभु रामजी ट्रस्ट,\nमैंने UPI / बैंक द्वारा दान भेजा है। कृपया मुझे मेरा दान रसीद नंबर (Receipt ID) प्रदान करें।\nमेरा नाम: \nमोबाइल: ${phone || ''}\nदान राशि: \nUPI संदर्भ / UTR: ${receiptId || ''}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl border border-stone-200 relative animate-in zoom-in-95 duration-150 my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer z-10"
          title="बंद करें"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0f4d3a] shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#0f4d3a]">
              दान रसीद सत्यापन एवं खोज
            </h3>
            <p className="text-xs text-stone-500">
              प्रभु रामजी ट्रस्ट, ग्राम गलगाँव (सनावद, खरगोन)
            </p>
          </div>
        </div>

        {/* Strict Dual-Check Privacy Policy Banner */}
        <div className="mb-5 bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-[11px] sm:text-xs text-emerald-950 leading-relaxed">
            <strong className="text-emerald-900 font-bold">सख्त दोहरी सत्यापन नीति (Strict Lookup):</strong> दानदाता की गोपनीयता की सुरक्षा हेतु, किसी भी दान का विवरण केवल तभी स्क्रीन पर प्रदर्शित होगा जब आपका <strong>पंजीकृत मोबाइल नंबर (Phone)</strong> और <strong>रसीद संख्या (Receipt ID / UPI UTR)</strong> दोनों ट्रस्ट रिकॉर्ड से पूर्णतः मेल खाएँगे।
          </div>
        </div>

        {/* Strict Dual Lookup Form */}
        <form onSubmit={handleSearch} className="space-y-4 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* Field 1: Phone */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>1. पंजीकृत मोबाइल नंबर (Phone) *</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  maxLength={10}
                  required
                  placeholder="उदा. 98260XXXXX (10 अंक)"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0f4d3a] focus:bg-white"
                />
              </div>
              <span className="text-[10px] text-stone-500 mt-1 block">
                दान के समय दिया गया 10 अंकों का फोन नंबर
              </span>
            </div>

            {/* Field 2: Receipt ID or UPI UTR */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-amber-600" />
                <span>2. रसीद संख्या (Receipt ID) या UPI UTR *</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="उदा. PRT-2026-1091 या UPI UTR"
                  value={receiptId}
                  onChange={(e) => {
                    setReceiptId(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#0f4d3a] focus:bg-white"
                />
              </div>
              <span className="text-[10px] text-stone-500 mt-1 block">
                रसीद ID (PRT-XXXX) अथवा PhonePe/GPay का 12 अंकों का UTR
              </span>
            </div>

          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            <button
              type="submit"
              className="w-full sm:w-auto flex-1 px-6 py-3 bg-[#0f4d3a] hover:bg-[#125843] text-white font-bold text-xs sm:text-sm rounded-xl shadow cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>सत्यापित करें व रसीद खोजें</span>
            </button>

            {(phone || receiptId || hasSearched) && (
              <button
                type="button"
                onClick={resetSearch}
                className="w-full sm:w-auto px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>रीसेट</span>
              </button>
            )}
          </div>
        </form>

        {/* State 1: Unsearched State (Zero donation data rendered) */}
        {!hasSearched && (
          <div className="space-y-4">
            <div className="text-center py-6 px-4 bg-stone-50 rounded-2xl border border-dashed border-stone-300 space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                <Lock className="w-5 h-5 text-stone-400" />
              </div>
              <h4 className="font-heading font-bold text-stone-800 text-sm">
                मोबाइल नंबर और रसीद आईडी दोनों के मिलान पर ही डेटा दिखेगा
              </h4>
              <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                दानदाताओं के व्यक्तिगत रिकॉर्ड को सुरक्षित रखने के लिए बिना दोनों सत्यापन कुंजियों के कोई भी विवरण स्क्रीन पर प्रदर्शित नहीं किया जाता है।
              </p>
            </div>

            {/* Practical Helper Card: How to get Receipt ID if paid via UPI/Bank */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-900">
                <HelpCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <h4 className="font-heading text-sm font-bold">
                  UPI या बैंक से भेजा है और रसीद ID नहीं है? ऐसे प्राप्त करें:
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                
                {/* Option A: Fill confirmation form for instant Receipt ID */}
                <div className="p-3 bg-white rounded-xl border border-amber-200 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="font-bold text-stone-900 block flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      1. तुरंत ऑनलाइन रसीद संख्या पाएँ:
                    </span>
                    <p className="text-stone-600 text-[11px] mt-1 leading-relaxed">
                      यदि आपने अभी-अभी UPI/बैंक से पैसे भेजे हैं, तो 30 सेकंड में दान विवरण दर्ज करें और तुरंत अपनी रसीद संख्या स्क्रीन पर प्राप्त करें।
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGoToDonationForm}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-[11px] font-bold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>दान पुष्टि फॉर्म भरें (रसीद पाएँ)</span>
                    <ArrowRight className="w-3 h-3 text-emerald-800" />
                  </button>
                </div>

                {/* Option B: WhatsApp Receipt ID request */}
                <div className="p-3 bg-white rounded-xl border border-amber-200 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="font-bold text-stone-900 block flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      2. WhatsApp पर रसीद ID मँगवाएँ:
                    </span>
                    <p className="text-stone-600 text-[11px] mt-1 leading-relaxed">
                      यदि आपने पूर्व में भेजा था, तो WhatsApp पर भुगतान स्क्रीनशॉट या UTR भेजकर ट्रस्ट कार्यालय से अपनी रसीद संख्या मँगवा सकते हैं।
                    </p>
                  </div>
                  <a
                    href={whatsappReceiptQueryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-[11px] font-bold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>WhatsApp पर रसीद ID माँगें</span>
                  </a>
                </div>

              </div>

              <div className="text-[11px] text-amber-900 font-medium pt-1 border-t border-amber-200/80">
                💡 <strong>टिप:</strong> यदि आपके पास PhonePe, GPay या Paytm का <strong>12 अंकों का UPI UTR</strong> (संदर्भ संख्या) है, तो ऊपर रसीद ID की जगह वही UTR नंबर और अपना मोबाइल नंबर डालकर भी सीधे रसीद खोल सकते हैं।
              </div>
            </div>
          </div>
        )}

        {/* State 2: Searched with No Match (Strict zero-data state) */}
        {hasSearched && !receiptData && (
          <div className="space-y-4">
            <div className="text-center py-7 px-4 bg-amber-50/75 rounded-2xl border border-amber-200 space-y-2.5">
              <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
              <h4 className="font-heading font-bold text-amber-950 text-sm">
                सत्यापन विफल: कोई मेल खाती रसीद नहीं मिली
              </h4>
              <p className="text-xs text-amber-800 max-w-md mx-auto leading-relaxed">
                प्रविष्ट मोबाइल नंबर <strong>"{phone}"</strong> एवं रसीद संख्या / UTR <strong>"{receiptId}"</strong> का कोई संयुक्त रिकॉर्ड प्राप्त नहीं हुआ। सख्त सुरक्षा नीति के कारण केवल दोनों विवरण सही होने पर ही डेटा दिखाई देगा।
              </p>
              <div className="text-xs text-stone-600 pt-1">
                सहायता अथवा पुष्टि हेतु ट्रस्ट हेल्पलाइन <strong>{TRUST_INFO.phone}</strong> पर संपर्क करें।
              </div>
              <button
                type="button"
                onClick={resetSearch}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>पुनः विवरण दर्ज करें</span>
              </button>
            </div>

            {/* Quick action buttons for unresolved lookup */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
              <span className="text-stone-700 font-medium">
                क्या आपने अभी-अभी UPI या बैंक से भेजा है?
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleGoToDonationForm}
                  className="px-3 py-1.5 bg-[#0f4d3a] hover:bg-[#125843] text-white font-bold rounded-lg cursor-pointer"
                >
                  दान पुष्टि फॉर्म भरें →
                </button>
                <a
                  href={whatsappReceiptQueryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-lg inline-flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3 fill-current" />
                  <span>WhatsApp हेल्पलाइन</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* State 3: Searched with Successful Dual Match (Render verified donation data) */}
        {hasSearched && receiptData && (
          <div className="space-y-4">
            
            {/* Dual Match Verification Badge */}
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-950">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>सत्यापन सफल:</strong> फोन एवं रसीद आईडी <strong>{receiptData.receiptNo}</strong> का मिलान प्रमाणित है।
                </span>
              </div>
              <span className="font-semibold text-stone-600 hidden sm:inline">
                दिनांक: {receiptData.date}
              </span>
            </div>

            {/* Official Printable Receipt Card */}
            <div id="printable-receipt" className="bg-[#FAF7F2] p-5 sm:p-6 rounded-2xl border-2 border-amber-300 space-y-4 shadow-sm">
              
              {/* Header with Official Trust Logo */}
              <div className="receipt-header text-center pb-3 border-b-2 border-stone-800">
                <div className="receipt-logo w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-amber-500 shadow mb-1.5 bg-[#08241b]">
                  <img src={TRUST_INFO.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">
                  ॥ श्री गणेशाय नमः ॥ श्री जानकीनाथ सहाय ॥
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#0f4d3a]">
                  {TRUST_INFO.name}
                </h3>
                <p className="text-xs font-medium text-stone-700">
                  {TRUST_INFO.fullAddress}
                </p>
                <div className="text-[11px] text-stone-600 mt-0.5">
                  वेबसाइट: <span className="font-mono font-semibold text-emerald-800">https://prabhuramjitrustram.ai.studio/</span> | हेल्पलाइन: {TRUST_INFO.phone}
                </div>
                <div className="receipt-badge inline-block mt-2 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-900">
                  आधिकारिक डिजिटल दान पावती रसीद
                </div>
              </div>

              {/* Receipt Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div>
                  <span className="text-stone-500 block text-[11px]">रसीद संख्या (Receipt ID):</span>
                  <strong className="font-mono text-stone-900 font-bold">{receiptData.receiptNo}</strong>
                </div>
                <div className="text-right">
                  <span className="text-stone-500 block text-[11px]">दिनांक:</span>
                  <strong className="text-stone-900">{receiptData.date}</strong>
                </div>

                <div>
                  <span className="text-stone-500 block text-[11px]">दानदाता का नाम:</span>
                  <strong className="text-sm sm:text-base text-stone-900 font-bold">{receiptData.donorName}</strong>
                </div>
                <div className="text-right">
                  <span className="text-stone-500 block text-[11px]">पंजीकृत फोन (Phone):</span>
                  <strong className="font-mono text-stone-900">{receiptData.mobile}</strong>
                </div>

                {receiptData.pan && (
                  <div>
                    <span className="text-stone-500 block text-[11px]">पैन नंबर (PAN):</span>
                    <strong className="font-mono text-stone-900">{receiptData.pan}</strong>
                  </div>
                )}

                <div className={receiptData.pan ? 'text-right' : 'col-span-2'}>
                  <span className="text-stone-500 block text-[11px]">सहयोग प्रकल्प / उद्देश्य:</span>
                  <strong className="text-emerald-900 font-semibold">{receiptData.cause}</strong>
                </div>
              </div>

              {/* Amount Box */}
              <div className="bg-white p-3.5 rounded-xl border border-amber-300 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-stone-500 block">प्राप्त सहयोग राशि:</span>
                  <span className="text-xl font-bold font-mono text-[#0f4d3a]">
                    ₹{receiptData.amount.toLocaleString('en-IN')} /-
                  </span>
                </div>
                <div className="text-right text-xs text-stone-600">
                  <div>माध्यम: <strong>{receiptData.paymentMode}</strong></div>
                  <div>संदर्भ: <span className="font-mono">{receiptData.transactionRef}</span></div>
                </div>
              </div>

              {/* Legal Transparency Note */}
              <div className="text-[10px] sm:text-[11px] text-stone-500 border-t border-stone-200 pt-2 leading-relaxed">
                <strong>पारदर्शिता सूचना:</strong> प्रभु रामजी ट्रस्ट द्वारा प्राप्त समस्त दान राशि का उपयोग नियमानुसार गौसेवा, प्रतिदिन चाय सेवा, शनिवार शाम भंडारा व आश्रम निर्माण में किया जाता है। ट्रस्ट का 12AB एवं 80G पंजीकरण आयकर विभाग में प्रक्रियाधीन है।
              </div>

              {/* Signatures & Official Stamp */}
              <div className="receipt-signatures pt-2 flex items-end justify-between text-xs">
                <div className="text-center">
                  <div className="receipt-stamp w-16 h-16 mx-auto rounded-full border-2 border-dashed border-emerald-700/60 flex items-center justify-center p-1 text-[10px] text-emerald-800 font-bold leading-tight">
                    प्रभु रामजी ट्रस्ट<br />गलगाँव
                  </div>
                  <span className="stamp-label text-[10px] text-stone-500 mt-1 block">आधिकारिक मुहर</span>
                </div>

                <div className="signatory-block text-right text-stone-700">
                  <div className="signatory-name font-serif italic font-bold text-stone-800 mb-1">दिनेश बिड़ला / गुलाबचंद</div>
                  <div className="signatory-role text-[11px] font-semibold text-stone-900">अधिकृत हस्ताक्षरकर्ता / व्यवस्थापक</div>
                  <div className="signatory-org text-[10px] text-stone-500">प्रभु रामजी ट्रस्ट, गलगाँव (सनावद)</div>
                </div>
              </div>

              {/* Official Email Receipt Delivery Card */}
              <div className="mt-3.5 bg-gradient-to-br from-emerald-50 via-amber-50/30 to-emerald-50 border border-emerald-300 rounded-2xl p-3.5 shadow-xs no-print">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-1.5 border-b border-emerald-200">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                      <Mail className="w-3.5 h-3.5 text-amber-300" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-950">
                        ईमेल पर यह रसीद प्राप्त करें
                      </h4>
                      <p className="text-[10px] text-emerald-800">
                        डिजिटल रसीद सीधे अपने ईमेल इनबॉक्स में सुरक्षित रूप से मँगवाएँ
                      </p>
                    </div>
                  </div>

                  {emailStatus.status === 'sent' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                      <CheckCircle2 className="w-3 h-3" />
                      ईमेल प्रेषित
                    </span>
                  )}
                </div>

                {emailStatus.status === 'sending' ? (
                  <div className="p-2.5 bg-white rounded-xl border border-emerald-300 flex items-center gap-2 text-xs text-emerald-900 font-semibold shadow-xs">
                    <Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                    <span>{emailStatus.message || 'ईमेल भेजा जा रहा है...'}</span>
                  </div>
                ) : emailStatus.status === 'sent' ? (
                  <div className="space-y-2 bg-white p-2.5 rounded-xl border border-emerald-300 shadow-xs text-xs">
                    <div className="flex items-start gap-2 text-emerald-950">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <strong className="block font-bold text-emerald-900">
                          {emailStatus.message}
                        </strong>
                        <span className="text-[10px] text-stone-600">
                          ईमेल: <strong className="font-mono text-emerald-800">{emailStatus.recipient}</strong> (इनबॉक्स / स्पैम फ़ोल्डर देखें)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setEmailStatus({ status: 'idle', message: '' })}
                        className="text-emerald-800 hover:text-emerald-950 font-semibold underline cursor-pointer"
                      >
                        अन्य ईमेल पते पर भेजें
                      </button>

                      <a
                        href={getReceiptMailtoLink(receiptData, emailStatus.recipient || '')}
                        className="inline-flex items-center gap-1 text-stone-600 hover:text-stone-900 underline"
                      >
                        <Mail className="w-3 h-3" />
                        <span>Email App में ड्राफ्ट खोलें</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {emailStatus.status === 'error' && (
                      <div className="p-2 bg-red-50 border border-red-200 rounded-xl flex items-center gap-1.5 text-[11px] text-red-700">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600" />
                        <span>{emailStatus.message}</span>
                      </div>
                    )}

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendSearchReceiptEmail();
                      }}
                      className="flex flex-wrap sm:flex-nowrap items-center gap-2"
                    >
                      <input
                        type="email"
                        required
                        placeholder="अपना ईमेल दर्ज करें (उदा. donor@gmail.com)"
                        value={searchEmailInput || (searchEmailInput === '' && receiptData.email ? receiptData.email : '')}
                        onChange={(e) => setSearchEmailInput(e.target.value)}
                        className="flex-1 min-w-[200px] px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0f4d3a] shadow-xs"
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#0f4d3a] hover:bg-[#125a44] rounded-xl shadow transition-all cursor-pointer shrink-0"
                      >
                        <Send className="w-3 h-3 text-amber-300" />
                        <span>ईमेल पर भेजें</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>

            </div>

            {/* Print Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 no-print pt-2">
              <button
                type="button"
                onClick={resetSearch}
                className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>अन्य रसीद खोजें</span>
              </button>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-[#0f4d3a] hover:bg-[#135d47] rounded-xl shadow cursor-pointer transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>प्रिंट करें / PDF के रूप में सहेजें</span>
              </button>
            </div>

          </div>
        )}

        <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            बंद करें
          </button>
        </div>

      </div>
    </div>
  );
};
