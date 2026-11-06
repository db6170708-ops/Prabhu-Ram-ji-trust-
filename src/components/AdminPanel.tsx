import React, { useState, useEffect } from 'react';
import { StorageService } from '../utils/storage';
import { NewsItem, GalleryPhoto, GalleryVideo, TransparencyRecord, Official, DonationReceipt } from '../types';
import { 
  Lock, 
  Unlock, 
  X, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  Key, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Video,
  FileSpreadsheet,
  Settings,
  Eye,
  EyeOff,
  ShieldCheck,
  RefreshCw,
  Receipt,
  Printer,
  Search,
  FileDown
} from 'lucide-react';
import { TRUST_INFO } from '../data/defaultData';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onDataUpdated: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, onDataUpdated }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'news' | 'photos' | 'videos' | 'transparency' | 'receipts' | 'backup'>('receipts');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Active in-memory state synced with storage
  const [photosList, setPhotosList] = useState<GalleryPhoto[]>([]);
  const [videosList, setVideosList] = useState<GalleryVideo[]>([]);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [transparencyList, setTransparencyList] = useState<TransparencyRecord[]>([]);
  const [receiptsList, setReceiptsList] = useState<DonationReceipt[]>([]);

  // Donation Receipts Admin state
  const [adminReceiptSearch, setAdminReceiptSearch] = useState('');
  const [adminReceiptCauseFilter, setAdminReceiptCauseFilter] = useState('all');
  const [isAddManualReceiptOpen, setIsAddManualReceiptOpen] = useState(false);
  const [selectedReceiptForPrint, setSelectedReceiptForPrint] = useState<DonationReceipt | null>(null);

  // Manual Receipt Form State
  const [manualDonorName, setManualDonorName] = useState('');
  const [manualDonorMobile, setManualDonorMobile] = useState('');
  const [manualDonorAmount, setManualDonorAmount] = useState('');
  const [manualDonorCause, setManualDonorCause] = useState('आश्रम एवं मंदिर निर्माण सहयोग');
  const [manualDonorPaymentMode, setManualDonorPaymentMode] = useState('नकद (Cash Office)');
  const [manualDonorPan, setManualDonorPan] = useState('');
  const [manualDonorRef, setManualDonorRef] = useState('');

  // Form states - Photos
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoCategory, setPhotoCategory] = useState<'gauseva' | 'narmada' | 'annadan' | 'chaiseva' | 'ashram' | 'all'>('gauseva');
  const [photoDesc, setPhotoDesc] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Form states - Videos
  const [videoTitle, setVideoTitle] = useState('');
  const [youtubeInput, setYoutubeInput] = useState('');
  const [videoCategory, setVideoCategory] = useState<'gauseva' | 'narmada' | 'annadan' | 'chaiseva' | 'ashram' | 'all'>('gauseva');
  const [videoDesc, setVideoDesc] = useState('');
  const [videoPreviewId, setVideoPreviewId] = useState<string | null>(null);

  // Form states - News
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsCategory, setNewsCategory] = useState<'bhandara' | 'utsav' | 'gauseva' | 'suchna'>('bhandara');
  const [newsImportant, setNewsImportant] = useState(false);

  // Form states - Transparency
  const [transMonth, setTransMonth] = useState('');
  const [transDonation, setTransDonation] = useState('');
  const [transGau, setTransGau] = useState('');
  const [transBhandara, setTransBhandara] = useState('');
  const [transNarmada, setTransNarmada] = useState('');
  const [transOther, setTransOther] = useState('');
  const [transRemarks, setTransRemarks] = useState('');

  // Security - Password Management
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Load state whenever panel opens or authenticates
  useEffect(() => {
    if (isOpen) {
      setPhotosList(StorageService.getPhotos());
      setVideosList(StorageService.getVideos());
      setNewsList(StorageService.getNews());
      setTransparencyList(StorageService.getTransparency());
      setReceiptsList(StorageService.getReceipts());
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (StorageService.verifyAdminPassword(passwordInput)) {
      setIsAuthenticated(true);
      setPasswordInput('');
      showStatus('सफलता पूर्वक लॉगिन हुआ! आपका स्वागत है।', 'success');
    } else {
      showStatus('अमान्य पासवर्ड! कृपया सही एडमिन पासवर्ड दर्ज करें।', 'error');
    }
  };

  // Helper to extract YouTube video ID from any format
  const extractYouTubeId = (url: string): string => {
    const trimmed = url.trim();
    if (!trimmed) return '';
    
    // Check standard patterns
    const watchMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/live\/)([^"&?\/\s]{11})/i);
    if (watchMatch && watchMatch[1]) {
      return watchMatch[1];
    }
    
    // If it's already an 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }
    
    return trimmed;
  };

  // Handle Photo File Upload directly from Mobile/Camera/PC
  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showStatus('कृपया केवल फोटो (JPG/PNG) फ़ाइल चुनें।', 'error');
      return;
    }

    setIsUploadingPhoto(true);
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      
      // Auto-compress image using canvas to ensure it fits comfortably in LocalStorage
      const img = new window.Image();
      img.src = result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          setPhotoUrl(compressedDataUrl);
          setPhotoPreview(compressedDataUrl);
        } else {
          setPhotoUrl(result);
          setPhotoPreview(result);
        }
        setIsUploadingPhoto(false);
      };
      img.onerror = () => {
        setPhotoUrl(result);
        setPhotoPreview(result);
        setIsUploadingPhoto(false);
      };
    };
    reader.readAsDataURL(file);
  };

  // 1. Add Photo
  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = photoUrl.trim() || photoPreview;
    if (!photoTitle.trim()) {
      showStatus('कृपया फोटो का शीर्षक दर्ज करें।', 'error');
      return;
    }
    if (!finalUrl) {
      showStatus('कृपया मोबाइल/कंप्यूटर से फोटो चुनें या फोटो लिंक (URL) दर्ज करें।', 'error');
      return;
    }

    try {
      const current = StorageService.getPhotos();
      const newPhoto: GalleryPhoto = {
        id: `photo_${Date.now()}`,
        title: photoTitle.trim(),
        imageUrl: finalUrl,
        category: photoCategory,
        date: new Date().toLocaleDateString('hi-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
        description: photoDesc.trim() || photoTitle.trim()
      };

      const updated = [newPhoto, ...current];
      StorageService.savePhotos(updated);
      setPhotosList(updated);
      onDataUpdated();

      // Reset form
      setPhotoTitle('');
      setPhotoUrl('');
      setPhotoDesc('');
      setPhotoPreview(null);
      showStatus('फोटो सफलतापूर्वक गैलरी में जोड़ी गई!', 'success');
    } catch (err) {
      console.error(err);
      showStatus('फोटो सहेजने में त्रुटि हुई। कृपया फ़ोटो का साइज़ कम करके पुनः प्रयास करें।', 'error');
    }
  };

  // 2. Delete Photo (Direct, robust with state update)
  const handleDeletePhoto = (id: string, title: string) => {
    const current = StorageService.getPhotos();
    const updated = current.filter(p => p.id !== id);
    StorageService.savePhotos(updated);
    setPhotosList(updated);
    onDataUpdated();
    showStatus(`"${title}" फोटो सफलतापूर्वक हटा दी गई।`, 'success');
  };

  // 3. Add Video
  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim()) {
      showStatus('कृपया वीडियो का शीर्षक दर्ज करें।', 'error');
      return;
    }
    const cleanId = extractYouTubeId(youtubeInput);
    if (!cleanId) {
      showStatus('कृपया मान्य YouTube वीडियो लिंक या ID दर्ज करें।', 'error');
      return;
    }

    const current = StorageService.getVideos();
    const newVideo: GalleryVideo = {
      id: `vid_${Date.now()}`,
      title: videoTitle.trim(),
      youtubeId: cleanId,
      category: videoCategory,
      date: new Date().toLocaleDateString('hi-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
      description: videoDesc.trim() || videoTitle.trim()
    };

    const updated = [newVideo, ...current];
    StorageService.saveVideos(updated);
    setVideosList(updated);
    onDataUpdated();

    // Reset form
    setVideoTitle('');
    setYoutubeInput('');
    setVideoDesc('');
    setVideoPreviewId(null);
    showStatus('YouTube वीडियो सफलतापूर्वक जोड़ा गया!', 'success');
  };

  // 4. Delete Video
  const handleDeleteVideo = (id: string, title: string) => {
    const current = StorageService.getVideos();
    const updated = current.filter(v => v.id !== id);
    StorageService.saveVideos(updated);
    setVideosList(updated);
    onDataUpdated();
    showStatus(`"${title}" वीडियो सफलतापूर्वक हटा दिया गया।`, 'success');
  };

  // 5. Add News
  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsContent.trim()) {
      showStatus('कृपया शीर्षक व विवरण दोनों भरें।', 'error');
      return;
    }
    const current = StorageService.getNews();
    const newItem: NewsItem = {
      id: `news_${Date.now()}`,
      title: newsTitle.trim(),
      date: new Date().toISOString().split('T')[0],
      content: newsContent.trim(),
      category: newsCategory,
      isImportant: newsImportant
    };
    const updated = [newItem, ...current];
    StorageService.saveNews(updated);
    setNewsList(updated);
    onDataUpdated();
    setNewsTitle('');
    setNewsContent('');
    showStatus('नई सूचना / भंडारा सूचना प्रकाशित की गई!', 'success');
  };

  const handleDeleteNews = (id: string) => {
    const current = StorageService.getNews();
    const updated = current.filter(n => n.id !== id);
    StorageService.saveNews(updated);
    setNewsList(updated);
    onDataUpdated();
    showStatus('सूचना सफलतापूर्वक हटा दी गई।', 'success');
  };

  // 6. Add Transparency Ledger Record
  const handleAddTransparency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transMonth.trim()) {
      showStatus('कृपया माह व वर्ष लिखें।', 'error');
      return;
    }
    const current = StorageService.getTransparency();
    const d = parseInt(transDonation) || 0;
    const g = parseInt(transGau) || 0;
    const b = parseInt(transBhandara) || 0;
    const n = parseInt(transNarmada) || 0;
    const o = parseInt(transOther) || 0;

    const newRec: TransparencyRecord = {
      id: `trans_${Date.now()}`,
      monthYear: transMonth.trim(),
      totalDonation: d,
      totalExpense: g + b + n + o,
      gauSevaExpense: g,
      bhandaraExpense: b,
      narmadaSevaExpense: n,
      otherExpense: o,
      remarks: transRemarks.trim() || 'नियमित सेवा संचालन'
    };

    const updated = [newRec, ...current];
    StorageService.saveTransparency(updated);
    setTransparencyList(updated);
    onDataUpdated();

    setTransMonth('');
    setTransDonation('');
    setTransGau('');
    setTransBhandara('');
    setTransNarmada('');
    setTransOther('');
    setTransRemarks('');
    showStatus('मासिक बहीखाता रिकॉर्ड दर्ज हुआ!', 'success');
  };

  // 6.5 Donation Receipts Management Handlers
  const handleAddManualReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualDonorName.trim()) {
      showStatus('कृपया दानदाता का नाम दर्ज करें।', 'error');
      return;
    }
    const amt = parseInt(manualDonorAmount, 10);
    if (!amt || amt <= 0) {
      showStatus('कृपया वैध दान राशि दर्ज करें।', 'error');
      return;
    }
    const cleanPhone = manualDonorMobile.trim().replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      showStatus('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।', 'error');
      return;
    }

    const receiptNo = `PRT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReceipt: DonationReceipt = {
      receiptNo,
      donorName: manualDonorName.trim(),
      mobile: manualDonorMobile.trim(),
      pan: manualDonorPan.trim().toUpperCase() || undefined,
      amount: amt,
      cause: manualDonorCause,
      date: new Date().toLocaleDateString('hi-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      paymentMode: manualDonorPaymentMode,
      transactionRef: manualDonorRef.trim() || `OFFICE/${Date.now().toString().slice(-6)}`
    };

    StorageService.saveReceipt(newReceipt);
    const updated = StorageService.getReceipts();
    setReceiptsList(updated);
    onDataUpdated();

    // Reset form
    setManualDonorName('');
    setManualDonorMobile('');
    setManualDonorAmount('');
    setManualDonorPan('');
    setManualDonorRef('');
    setIsAddManualReceiptOpen(false);
    showStatus(`रसीद संख्या ${receiptNo} (${newReceipt.donorName} - ₹${amt}) सफलतापूर्वक दर्ज हुई!`, 'success');
  };

  const handleDeleteReceipt = (receiptNo: string, donorName: string) => {
    const updated = StorageService.deleteReceipt(receiptNo);
    setReceiptsList(updated);
    onDataUpdated();
    showStatus(`रसीद संख्या ${receiptNo} (${donorName}) सफलतापूर्वक हटा दी गई।`, 'success');
  };

  const handleExportReceiptsCsv = () => {
    const receipts = StorageService.getReceipts();
    if (receipts.length === 0) {
      showStatus('कोई दान रसीद उपलब्ध नहीं है।', 'error');
      return;
    }

    const headers = ['रसीद संख्या (Receipt No)', 'दिनांक (Date)', 'दानदाता का नाम (Donor Name)', 'मोबाइल नंबर (Mobile)', 'राशि (Amount INR)', 'सहयोग प्रकल्प (Cause)', 'भुगतान माध्यम (Mode)', 'पैन नंबर (PAN)', 'संदर्भ (Ref)'];
    const rows = receipts.map(r => [
      `"${r.receiptNo}"`,
      `"${r.date}"`,
      `"${r.donorName.replace(/"/g, '""')}"`,
      `"${r.mobile}"`,
      r.amount,
      `"${r.cause.replace(/"/g, '""')}"`,
      `"${r.paymentMode.replace(/"/g, '""')}"`,
      `"${r.pan || ''}"`,
      `"${r.transactionRef || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `prabhu_ramji_trust_donation_receipts_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showStatus('सभी दान रसीदों की Excel/CSV फ़ाइल डाउनलोड हो गई!', 'success');
  };

  // 7. Security Password change
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!StorageService.verifyAdminPassword(oldPassword)) {
      showStatus('वर्तमान पासवर्ड सही नहीं है!', 'error');
      return;
    }
    if (newPassword.trim().length < 4) {
      showStatus('नया पासवर्ड कम से कम 4 अक्षरों या अंकों का होना चाहिए।', 'error');
      return;
    }
    if (newPassword.trim() !== confirmPassword.trim()) {
      showStatus('नए पासवर्ड की पुष्टि मेल नहीं खाती!', 'error');
      return;
    }

    StorageService.setAdminPassword(newPassword.trim());
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showStatus('एडमिन सुरक्षा पासवर्ड सफलतापूर्वक बदल दिया गया है!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-8 shadow-2xl border border-stone-200 relative animate-in zoom-in-95 duration-200 my-6 max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isAuthenticated ? (
          /* Secure Login Screen */
          <div className="max-w-md mx-auto py-8 text-center space-y-6 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#0f4d3a] flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheck className="w-8 h-8 text-[#0f4d3a]" />
            </div>

            <div>
              <h3 className="font-heading text-2xl font-bold text-[#0f4d3a]">
                ट्रस्ट प्रशासनिक नियंत्रण कक्ष (Admin)
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                प्रभु रामजी ट्रस्ट, ग्राम गलगाँव (सनावद, खरगोन)
              </p>
            </div>

            {statusMessage && (
              <div className={`p-3 rounded-xl text-xs font-semibold ${
                statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {statusMessage.text}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  गोपनीय एडमिन पासवर्ड:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="गोपनीय पासवर्ड दर्ज करें"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full py-3.5 pl-4 pr-11 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f4d3a] text-sm font-medium tracking-wide"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                    title={showPassword ? "पासवर्ड छिपाएं" : "पासवर्ड देखें"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 font-bold text-white bg-[#0f4d3a] hover:bg-[#125843] rounded-xl shadow transition-all cursor-pointer text-sm flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>सुरक्षित लॉगिन करें</span>
              </button>
            </form>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-left space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>गोपनीय नियंत्रण सुरक्षा:</span>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                यह प्रशासनिक कक्ष केवल अधिकृत ट्रस्ट पदाधिकारियों के लिए आरक्षित है। यहाँ से वेबसाइट के फोटो, वीडियो, समाचार एवं दान लेखा का सुरक्षित प्रबंधन किया जाता है।
              </p>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-stone-200 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    प्रशासनिक सत्र सक्रिय (Admin Session Active)
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold text-[#0f4d3a] mt-1">
                  प्रभु रामजी ट्रस्ट · सामग्री प्रबंधन डैशबोर्ड
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setPhotosList(StorageService.getPhotos());
                    setVideosList(StorageService.getVideos());
                    setNewsList(StorageService.getNews());
                    setTransparencyList(StorageService.getTransparency());
                    setReceiptsList(StorageService.getReceipts());
                    showStatus('डेटा रीफ्रेश किया गया।', 'success');
                  }}
                  className="p-1.5 text-stone-600 hover:text-stone-900 bg-stone-100 rounded-lg text-xs flex items-center gap-1"
                  title="रीफ्रेश करें"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">रीफ्रेश</span>
                </button>
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg"
                >
                  लॉगआउट
                </button>
              </div>
            </div>

            {statusMessage && (
              <div className={`my-2 p-2.5 rounded-xl text-xs font-semibold shrink-0 ${
                statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {statusMessage.text}
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-1.5 my-3 border-b border-stone-200 pb-2 shrink-0">
              <button
                onClick={() => setActiveTab('receipts')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'receipts' ? 'bg-[#0f4d3a] text-white shadow-xs ring-1 ring-amber-400' : 'bg-emerald-50 text-emerald-950 hover:bg-emerald-100 border border-emerald-300'
                }`}
              >
                <Receipt className="w-3.5 h-3.5 text-amber-500" />
                <span>दान रिकॉर्ड ({receiptsList.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('photos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'photos' ? 'bg-[#0f4d3a] text-white shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>फोटो प्रबंधन ({photosList.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('videos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'videos' ? 'bg-[#0f4d3a] text-white shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>वीडियो प्रबंधन ({videosList.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('news')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'news' ? 'bg-[#0f4d3a] text-white shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>समाचार व भंडारा</span>
              </button>

              <button
                onClick={() => setActiveTab('transparency')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'transparency' ? 'bg-[#0f4d3a] text-white shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>पारदर्शिता बहीखाता</span>
              </button>

              <button
                onClick={() => setActiveTab('backup')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'backup' ? 'bg-[#0f4d3a] text-white shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>बैकअप व पासवर्ड</span>
              </button>
            </div>

            {/* TAB CONTENTS - Scrollable Container */}
            <div className="flex-1 overflow-y-auto pr-1 pb-4">
              
              {/* TAB: DONATION RECEIPTS MANAGEMENT */}
              {activeTab === 'receipts' && (
                <div className="space-y-6">
                  
                  {/* Top Financial KPI Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase block">कुल रसीदें</span>
                      <span className="text-xl sm:text-2xl font-bold font-mono text-[#0f4d3a]">
                        {receiptsList.length}
                      </span>
                    </div>

                    <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200">
                      <span className="text-[11px] font-bold text-amber-800 uppercase block">कुल प्राप्त दान</span>
                      <span className="text-xl sm:text-2xl font-bold font-mono text-[#0f4d3a]">
                        ₹{receiptsList.reduce((acc, r) => acc + (Number(r.amount) || 0), 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                      <span className="text-[11px] font-bold text-stone-600 uppercase block">आश्रम निर्माण</span>
                      <span className="text-base sm:text-lg font-bold font-mono text-stone-900">
                        ₹{receiptsList.filter(r => r.cause.includes('आश्रम') || r.cause.includes('निर्माण')).reduce((acc, r) => acc + (Number(r.amount) || 0), 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                      <span className="text-[11px] font-bold text-stone-600 uppercase block">भंडारा व गौसेवा</span>
                      <span className="text-base sm:text-lg font-bold font-mono text-stone-900">
                        ₹{receiptsList.filter(r => !r.cause.includes('आश्रम')).reduce((acc, r) => acc + (Number(r.amount) || 0), 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Actions & Filters Bar */}
                  <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-3">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                      <div className="relative flex-1">
                        <Search className="absolute inset-y-0 left-3 my-auto w-3.5 h-3.5 text-stone-400" />
                        <input
                          type="text"
                          placeholder="नाम, मोबाइल नंबर या रसीद क्र. खोजें..."
                          value={adminReceiptSearch}
                          onChange={(e) => setAdminReceiptSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:ring-1 focus:ring-[#0f4d3a]"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          value={adminReceiptCauseFilter}
                          onChange={(e) => setAdminReceiptCauseFilter(e.target.value)}
                          className="px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
                        >
                          <option value="all">सभी प्रकल्प (All Causes)</option>
                          <option value="आश्रम">आश्रम व मंदिर निर्माण</option>
                          <option value="भंडारा">शनिवार भंडारा महाप्रसाद</option>
                          <option value="चाय">प्रतिदिन चाय सेवा</option>
                          <option value="गौसेवा">गौसेवा व चारा</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => setIsAddManualReceiptOpen(!isAddManualReceiptOpen)}
                          className="px-3.5 py-2 bg-[#0f4d3a] hover:bg-[#125843] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isAddManualReceiptOpen ? 'फॉर्म बंद करें' : 'ऑफ़िस दान रसीद बनाएं'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleExportReceiptsCsv}
                          className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl border border-stone-300 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                          title="Excel / CSV डाउनलोड करें"
                        >
                          <FileDown className="w-3.5 h-3.5 text-emerald-700" />
                          <span className="hidden sm:inline">Excel/CSV</span>
                        </button>
                      </div>
                    </div>

                    {/* Manual Receipt Form (when open) */}
                    {isAddManualReceiptOpen && (
                      <form onSubmit={handleAddManualReceipt} className="mt-3 pt-3 border-t border-stone-200 bg-white p-4 rounded-xl border border-emerald-300 space-y-3 animate-in fade-in">
                        <div className="flex items-center justify-between pb-1">
                          <h5 className="font-heading font-bold text-sm text-[#0f4d3a] flex items-center gap-1.5">
                            <Plus className="w-4 h-4 text-emerald-600" />
                            <span>कार्यालय में प्राप्त दान की नई रसीद बनाएं (Manual Entry)</span>
                          </h5>
                          <span className="text-[11px] text-stone-500">नकद, चेक अथवा आश्रम काउंटर पर प्राप्त सहयोग</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-stone-700 mb-1">
                              दानदाता का नाम *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="उदा. श्री राहुल वर्मा"
                              value={manualDonorName}
                              onChange={(e) => setManualDonorName(e.target.value)}
                              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-stone-700 mb-1">
                              मोबाइल नंबर * (10 अंक)
                            </label>
                            <input
                              type="tel"
                              required
                              maxLength={10}
                              placeholder="उदा. 98260XXXXX"
                              value={manualDonorMobile}
                              onChange={(e) => setManualDonorMobile(e.target.value)}
                              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-stone-700 mb-1">
                              सहयोग राशि (₹) *
                            </label>
                            <input
                              type="number"
                              required
                              min="1"
                              placeholder="उदा. 1100"
                              value={manualDonorAmount}
                              onChange={(e) => setManualDonorAmount(e.target.value)}
                              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono font-bold text-[#0f4d3a]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-stone-700 mb-1">
                              सहयोग प्रकल्प (Cause)
                            </label>
                            <select
                              value={manualDonorCause}
                              onChange={(e) => setManualDonorCause(e.target.value)}
                              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                            >
                              <option value="आश्रम एवं मंदिर निर्माण सहयोग">आश्रम एवं मंदिर निर्माण सहयोग</option>
                              <option value="शनिवार शाम भंडारा महाप्रसाद">शनिवार शाम भंडारा महाप्रसाद</option>
                              <option value="प्रतिदिन चाय सेवा">प्रतिदिन चाय सेवा (नर्मदा परिक्रमा)</option>
                              <option value="गौसेवा एवं चारा व्यवस्था">गौसेवा एवं चारा व्यवस्था</option>
                              <option value="सामान्य सेवा कोष">सामान्य सेवा कोष</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-stone-700 mb-1">
                              भुगतान का माध्यम
                            </label>
                            <select
                              value={manualDonorPaymentMode}
                              onChange={(e) => setManualDonorPaymentMode(e.target.value)}
                              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                            >
                              <option value="नकद (Cash at Office)">नकद (आश्रम कार्यालय, गलगाँव)</option>
                              <option value="PhonePe QR / UPI">PhonePe QR / UPI</option>
                              <option value="Direct Bank Transfer">IDBI बैंक ट्रांसफर (NEFT/IMPS)</option>
                              <option value="चेक / ड्राफ्ट">चेक / बैंक ड्राफ्ट</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-stone-700 mb-1">
                              पैन नंबर या संदर्भ (वैकल्पिक)
                            </label>
                            <input
                              type="text"
                              placeholder="उदा. ABCDE1234F / UTR"
                              value={manualDonorPan}
                              onChange={(e) => setManualDonorPan(e.target.value)}
                              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs uppercase"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setIsAddManualReceiptOpen(false)}
                            className="px-3.5 py-1.5 text-xs text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg cursor-pointer"
                          >
                            रद्द करें
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 text-xs font-bold text-white bg-[#0f4d3a] hover:bg-[#125843] rounded-lg shadow cursor-pointer flex items-center gap-1.5"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>रसीद बनाएं व सहेजें</span>
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Filtered Receipts Table / Cards View */}
                  <div>
                    {(() => {
                      const filtered = receiptsList.filter((r) => {
                        const term = adminReceiptSearch.toLowerCase().trim();
                        const matchesTerm = !term || (
                          r.donorName.toLowerCase().includes(term) ||
                          r.mobile.includes(term) ||
                          r.receiptNo.toLowerCase().includes(term) ||
                          (r.transactionRef && r.transactionRef.toLowerCase().includes(term))
                        );
                        const matchesCause = adminReceiptCauseFilter === 'all' || r.cause.includes(adminReceiptCauseFilter);
                        return matchesTerm && matchesCause;
                      });

                      if (filtered.length === 0) {
                        return (
                          <div className="text-center py-10 bg-stone-50 rounded-2xl border border-stone-200">
                            <p className="text-xs text-stone-500">कोई दान रसीद नहीं मिली। ऊपर से नई रसीद दर्ज करें या सर्च फ़िल्टर बदलें।</p>
                          </div>
                        );
                      }

                      return (
                        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                          {/* Desktop Table View */}
                          <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                                <tr>
                                  <th className="py-2.5 px-3">रसीद क्र.</th>
                                  <th className="py-2.5 px-3">दिनांक</th>
                                  <th className="py-2.5 px-3">दानदाता का नाम</th>
                                  <th className="py-2.5 px-3">मोबाइल</th>
                                  <th className="py-2.5 px-3">सहयोग प्रकल्प</th>
                                  <th className="py-2.5 px-3 text-right">राशि (₹)</th>
                                  <th className="py-2.5 px-3">माध्यम</th>
                                  <th className="py-2.5 px-3 text-center">कार्रवाई</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-stone-100 text-stone-800">
                                {filtered.map((r) => (
                                  <tr key={r.receiptNo} className="hover:bg-emerald-50/40 transition-colors">
                                    <td className="py-2.5 px-3 font-mono font-bold text-[#0f4d3a]">
                                      {r.receiptNo}
                                    </td>
                                    <td className="py-2.5 px-3 text-stone-500 whitespace-nowrap">
                                      {r.date}
                                    </td>
                                    <td className="py-2.5 px-3 font-bold text-stone-900">
                                      {r.donorName}
                                    </td>
                                    <td className="py-2.5 px-3 font-mono text-stone-600">
                                      {r.mobile}
                                    </td>
                                    <td className="py-2.5 px-3 text-stone-700">
                                      <span className="inline-block px-2 py-0.5 rounded bg-stone-100 text-stone-800 text-[11px] font-medium">
                                        {r.cause}
                                      </span>
                                    </td>
                                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-900 text-sm whitespace-nowrap">
                                      ₹{Number(r.amount).toLocaleString('en-IN')}
                                    </td>
                                    <td className="py-2.5 px-3 text-stone-500 text-[11px]">
                                      {r.paymentMode}
                                    </td>
                                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                                      <div className="inline-flex items-center gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => setSelectedReceiptForPrint(r)}
                                          className="p-1.5 text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg cursor-pointer transition-colors"
                                          title="रसीद प्रिंट / PDF देखें"
                                        >
                                          <Printer className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteReceipt(r.receiptNo, r.donorName)}
                                          className="p-1.5 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer transition-colors"
                                          title="रसीद हटाएँ"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile Cards View */}
                          <div className="md:hidden divide-y divide-stone-100">
                            {filtered.map((r) => (
                              <div key={r.receiptNo} className="p-3.5 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="font-mono font-bold text-xs text-[#0f4d3a]">{r.receiptNo}</span>
                                  <span className="font-mono font-bold text-sm text-emerald-900">₹{Number(r.amount).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="text-xs">
                                  <div className="font-bold text-stone-900">{r.donorName}</div>
                                  <div className="text-stone-500 text-[11px]">मो: {r.mobile} · {r.date}</div>
                                  <div className="text-emerald-800 font-medium text-[11px] mt-0.5">{r.cause} ({r.paymentMode})</div>
                                </div>
                                <div className="flex items-center justify-end gap-2 pt-1 border-t border-stone-100">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedReceiptForPrint(r)}
                                    className="px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-1 cursor-pointer"
                                  >
                                    <Printer className="w-3 h-3" />
                                    <span>प्रिंट रसीद</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteReceipt(r.receiptNo, r.donorName)}
                                    className="px-2.5 py-1 text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-center gap-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>हटाएँ</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                        </div>
                      );
                    })()}
                  </div>

                </div>
              )}

              {/* TAB: PHOTOS MANAGEMENT */}
              {activeTab === 'photos' && (
                <div className="space-y-6">
                  
                  {/* Photo Upload & Add Form */}
                  <form onSubmit={handleAddPhoto} className="bg-stone-50 p-4 sm:p-5 rounded-2xl border-2 border-emerald-900/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-bold text-base text-[#0f4d3a] flex items-center gap-2">
                        <Plus className="w-4 h-4 text-emerald-700" />
                        <span>नई फोटो जोड़ें (Add New Photo)</span>
                      </h4>
                      <span className="text-[11px] text-stone-500">मोबाइल या कंप्यूटर से फ़ाइल चुनें</span>
                    </div>

                    {/* Method 1: File Picker directly from device */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center bg-white p-3.5 rounded-xl border border-stone-200">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          1. मोबाइल / डिवाइस से फोटो चुनें:
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoFileUpload}
                          className="w-full text-xs text-stone-600 file:mr-2.5 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#0f4d3a] file:text-white hover:file:bg-[#125843] cursor-pointer"
                        />
                        {isUploadingPhoto && (
                          <span className="text-[11px] text-amber-600 font-medium">फोटो प्रोसेस हो रही है...</span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          अथवा फोटो का वेब URL पेस्ट करें:
                        </label>
                        <input
                          type="text"
                          placeholder="https://example.com/photo.jpg"
                          value={photoUrl.startsWith('data:') ? '' : photoUrl}
                          onChange={(e) => {
                            setPhotoUrl(e.target.value);
                            setPhotoPreview(e.target.value);
                          }}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    {/* Photo Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          फोटो का शीर्षक (Title) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="उदा. शनिवार भंडारा प्रसादी वितरण"
                          value={photoTitle}
                          onChange={(e) => setPhotoTitle(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-[#0f4d3a]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          सेवा श्रेणी (Category)
                        </label>
                        <select
                          value={photoCategory}
                          onChange={(e: any) => setPhotoCategory(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                        >
                          <option value="annadan">शनिवार भंडारा व अन्नदान</option>
                          <option value="gauseva">गौसेवा व गौशाला</option>
                          <option value="ashram">आश्रम व मंदिर निर्माण</option>
                          <option value="chaiseva">प्रतिदिन चाय सेवा</option>
                          <option value="narmada">माँ नर्मदा परिक्रमा सेवा</option>
                          <option value="all">सामान्य / अन्य</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        छोटा विवरण (Description)
                      </label>
                      <input
                        type="text"
                        placeholder="उदा. ग्राम गलगाँव में सैकड़ों श्रद्धालुओं की पंगत प्रसादी"
                        value={photoDesc}
                        onChange={(e) => setPhotoDesc(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                      />
                    </div>

                    {/* Live Preview */}
                    {photoPreview && (
                      <div className="flex items-center gap-3 p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-lg border border-emerald-300 shrink-0"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-emerald-900 block">फोटो तैयार है!</span>
                          <span className="text-emerald-700">{photoTitle || 'बिना शीर्षक'}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        disabled={isUploadingPhoto}
                        className="px-5 py-2.5 bg-[#0f4d3a] hover:bg-[#125a44] text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>गैलरी में फोटो जोड़ें (Publish Photo)</span>
                      </button>
                    </div>
                  </form>

                  {/* Existing Photos List with Instant Deletion */}
                  <div>
                    <h4 className="font-bold text-sm text-stone-800 mb-3 flex items-center justify-between">
                      <span>मौजूदा गैलरी छायाचित्र ({photosList.length})</span>
                      <span className="text-xs font-normal text-stone-500">लाल बटन से सीधे हटा सकते हैं</span>
                    </h4>

                    {photosList.length === 0 ? (
                      <p className="text-xs text-stone-400 text-center py-6">कोई फोटो उपलब्ध नहीं है। ऊपर से नई फोटो जोड़ें।</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {photosList.map((photo) => (
                          <div
                            key={photo.id}
                            className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between group"
                          >
                            <div className="aspect-4/3 overflow-hidden bg-stone-100 relative">
                              <img
                                src={photo.imageUrl}
                                alt={photo.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                              <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                                {photo.category}
                              </span>
                            </div>

                            <div className="p-2.5 space-y-2">
                              <div>
                                <h5 className="font-bold text-xs text-stone-900 truncate" title={photo.title}>
                                  {photo.title}
                                </h5>
                                <p className="text-[10px] text-stone-500 mt-0.5 truncate">
                                  {photo.description}
                                </p>
                              </div>

                              <button
                                onClick={() => handleDeletePhoto(photo.id, photo.title)}
                                className="w-full py-1.5 px-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg border border-red-200 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                title="यह फोटो गैलरी से हटाएँ"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>हटाएँ (Delete)</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB: VIDEOS MANAGEMENT */}
              {activeTab === 'videos' && (
                <div className="space-y-6">
                  
                  {/* Video Add Form */}
                  <form onSubmit={handleAddVideo} className="bg-stone-50 p-4 sm:p-5 rounded-2xl border-2 border-emerald-900/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-bold text-base text-[#0f4d3a] flex items-center gap-2">
                        <Plus className="w-4 h-4 text-emerald-700" />
                        <span>नया YouTube वीडियो जोड़ें (Add Video)</span>
                      </h4>
                      <span className="text-[11px] text-stone-500">कोई भी YouTube लिंक चलेगा</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          वीडियो का शीर्षक (Title) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="उदा. शनिवार शाम भंडारा दर्शन - गलगाँव"
                          value={videoTitle}
                          onChange={(e) => setVideoTitle(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-[#0f4d3a]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          YouTube लिंक या Video ID *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="https://youtu.be/... या ID"
                          value={youtubeInput}
                          onChange={(e) => {
                            setYoutubeInput(e.target.value);
                            const extracted = extractYouTubeId(e.target.value);
                            setVideoPreviewId(extracted);
                          }}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          श्रेणी (Category)
                        </label>
                        <select
                          value={videoCategory}
                          onChange={(e: any) => setVideoCategory(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                        >
                          <option value="annadan">शनिवार शाम भंडारा</option>
                          <option value="gauseva">गौसेवा दर्शन</option>
                          <option value="ashram">आश्रम व मंदिर निर्माण</option>
                          <option value="chaiseva">प्रतिदिन चाय सेवा</option>
                          <option value="narmada">नर्मदा परिक्रमा सेवा</option>
                          <option value="all">सामान्य</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          संक्षिप्त विवरण
                        </label>
                        <input
                          type="text"
                          placeholder="उदा. भक्तों द्वारा भोजन प्रसादी सेवा"
                          value={videoDesc}
                          onChange={(e) => setVideoDesc(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    {/* Video ID Preview */}
                    {videoPreviewId && (
                      <div className="flex items-center gap-3 p-2.5 bg-red-50 rounded-xl border border-red-200">
                        <img
                          src={`https://img.youtube.com/vi/${videoPreviewId}/hqdefault.jpg`}
                          alt="Thumbnail preview"
                          className="w-20 h-14 object-cover rounded-md border border-red-300 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="text-xs">
                          <span className="font-bold text-red-900 block">YouTube ID पहचानी गई:</span>
                          <span className="font-mono text-stone-700">{videoPreviewId}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#0f4d3a] hover:bg-[#125a44] text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>वीडियो जोड़ें (Publish Video)</span>
                      </button>
                    </div>
                  </form>

                  {/* Existing Videos List with Instant Deletion */}
                  <div>
                    <h4 className="font-bold text-sm text-stone-800 mb-3 flex items-center justify-between">
                      <span>मौजूदा वीडियो सूची ({videosList.length})</span>
                      <span className="text-xs font-normal text-stone-500">हटाने के लिए लाल बटन दबाएँ</span>
                    </h4>

                    {videosList.length === 0 ? (
                      <p className="text-xs text-stone-400 text-center py-6">कोई वीडियो नहीं है। ऊपर से नया वीडियो जोड़ें।</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {videosList.map((video) => (
                          <div
                            key={video.id}
                            className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs flex flex-col justify-between"
                          >
                            <div className="aspect-video bg-stone-900 relative">
                              <img
                                src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                YouTube
                              </span>
                            </div>

                            <div className="p-3 space-y-2">
                              <div>
                                <h5 className="font-bold text-xs text-stone-900 line-clamp-1" title={video.title}>
                                  {video.title}
                                </h5>
                                <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">
                                  ID: {video.youtubeId} · {video.date}
                                </p>
                              </div>

                              <button
                                onClick={() => handleDeleteVideo(video.id, video.title)}
                                className="w-full py-1.5 px-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg border border-red-200 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>हटाएँ (Delete Video)</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB: NEWS & BHANDARA ANNOUNCEMENTS */}
              {activeTab === 'news' && (
                <div className="space-y-6">
                  
                  <form onSubmit={handleAddNews} className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-3">
                    <h4 className="font-bold text-sm text-[#0f4d3a]">नई सूचना या आगामी भंडारा विवरण जोड़ें</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="शीर्षक (उदा. शनिवार महाभंडारा सूचना)"
                        value={newsTitle}
                        onChange={(e) => setNewsTitle(e.target.value)}
                        className="px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-[#0f4d3a]"
                      />
                      <select
                        value={newsCategory}
                        onChange={(e: any) => setNewsCategory(e.target.value)}
                        className="px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                      >
                        <option value="bhandara">शनिवार भंडारा</option>
                        <option value="gauseva">गौसेवा समाचार</option>
                        <option value="utsav">धार्मिक उत्सव</option>
                        <option value="suchna">सामान्य सूचना</option>
                      </select>
                    </div>

                    <textarea
                      required
                      rows={2}
                      placeholder="सूचना का पूरा विवरण लिखें..."
                      value={newsContent}
                      onChange={(e) => setNewsContent(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                    />

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newsImportant}
                          onChange={(e) => setNewsImportant(e.target.checked)}
                        />
                        <span>महत्वपूर्ण सूचना के रूप में हाइलाइट करें</span>
                      </label>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#0f4d3a] text-white text-xs font-bold rounded-lg cursor-pointer"
                      >
                        प्रकाशित करें
                      </button>
                    </div>
                  </form>

                  <div className="space-y-2">
                    {newsList.map((n) => (
                      <div key={n.id} className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-stone-900">{n.title}</div>
                          <div className="text-stone-500">{n.date} · {n.category}</div>
                        </div>
                        <button
                          onClick={() => handleDeleteNews(n.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                          title="हटाएँ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* TAB: TRANSPARENCY LEDGER */}
              {activeTab === 'transparency' && (
                <div className="space-y-6">
                  
                  <form onSubmit={handleAddTransparency} className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-3">
                    <h4 className="font-bold text-sm text-[#0f4d3a]">मासिक आय-व्यय बहीखाता प्रविष्टि</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="माह व वर्ष (उदा. नवंबर 2026)"
                        value={transMonth}
                        onChange={(e) => setTransMonth(e.target.value)}
                        className="px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                      />
                      <input
                        type="number"
                        required
                        placeholder="कुल प्राप्त दान (₹)"
                        value={transDonation}
                        onChange={(e) => setTransDonation(e.target.value)}
                        className="px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                      />
                      <input
                        type="number"
                        required
                        placeholder="गौसेवा व्यय (₹)"
                        value={transGau}
                        onChange={(e) => setTransGau(e.target.value)}
                        className="px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                      />
                      <input
                        type="number"
                        required
                        placeholder="भंडारा व्यय (₹)"
                        value={transBhandara}
                        onChange={(e) => setTransBhandara(e.target.value)}
                        className="px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                      />
                      <input
                        type="number"
                        required
                        placeholder="नर्मदा सेवा व्यय (₹)"
                        value={transNarmada}
                        onChange={(e) => setTransNarmada(e.target.value)}
                        className="px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                      />
                      <input
                        type="number"
                        placeholder="अन्य व्यय (₹)"
                        value={transOther}
                        onChange={(e) => setTransOther(e.target.value)}
                        className="px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="टिप्पणी / मुख्य सेवा कार्य विवरण"
                      value={transRemarks}
                      onChange={(e) => setTransRemarks(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#0f4d3a] text-white text-xs font-bold rounded-lg cursor-pointer"
                      >
                        बहीखाता रिकॉर्ड दर्ज करें
                      </button>
                    </div>
                  </form>

                  <div className="space-y-2">
                    {transparencyList.map((t) => (
                      <div key={t.id} className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-stone-900">{t.monthYear}</div>
                          <div className="text-stone-500">दान: ₹{t.totalDonation} | कुल व्यय: ₹{t.totalExpense}</div>
                        </div>
                        <div className="text-xs text-stone-600 max-w-xs truncate">{t.remarks}</div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* TAB: BACKUP & PIN */}
              {activeTab === 'backup' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
                    <h4 className="font-bold text-sm text-[#0f4d3a] flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      <span>डेटा बैकअप डाउनलोड</span>
                    </h4>
                    <p className="text-xs text-stone-600">
                      सभी फोटो, वीडियो, समाचार और दान रसीदों का सुरक्षित डेटा JSON फ़ाइल के रूप में सहेजें।
                    </p>
                    <button
                      onClick={() => StorageService.exportBackup()}
                      className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#0f4d3a] rounded-xl flex items-center justify-center gap-2 shadow"
                    >
                      <Download className="w-4 h-4" />
                      <span>संपूर्ण बैकअप फ़ाइल डाउनलोड करें</span>
                    </button>
                  </div>

                  <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
                    <h4 className="font-bold text-sm text-[#0f4d3a] flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-600" />
                      <span>गोपनीय एडमिन पासवर्ड बदलें</span>
                    </h4>
                    <p className="text-xs text-stone-500">
                      अपना व्यक्तिगत गुप्त पासवर्ड निर्धारित करें ताकि केवल आपको ही इसकी जानकारी रहे।
                    </p>
                    <form onSubmit={handleChangePassword} className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          वर्तमान पासवर्ड:
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="वर्तमान पासवर्ड दर्ज करें"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-[#0f4d3a]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          नया पासवर्ड:
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="नया गुप्त पासवर्ड बनाएं (कम से कम 4 अक्षर/अंक)"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-[#0f4d3a]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          नए पासवर्ड की पुष्टि करें:
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="नया पासवर्ड पुनः दर्ज करें"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-[#0f4d3a]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 px-3 text-xs font-bold text-stone-900 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl cursor-pointer shadow transition-all flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>नया पासवर्ड सुरक्षित करें</span>
                      </button>
                    </form>
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

        {/* Printable Receipt Modal for Admin */}
        {selectedReceiptForPrint && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-6 animate-in zoom-in-95">
              
              <button
                type="button"
                onClick={() => setSelectedReceiptForPrint(null)}
                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                title="बंद करें"
              >
                <X className="w-5 h-5" />
              </button>

              <div id="printable-receipt" className="bg-[#FAF7F2] p-5 sm:p-6 rounded-2xl border-2 border-amber-300 space-y-4 shadow-sm">
                
                {/* Header with Official Logo */}
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
                    <span className="text-stone-500 block text-[11px]">रसीद संख्या:</span>
                    <strong className="font-mono text-stone-900 font-bold">{selectedReceiptForPrint.receiptNo}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-stone-500 block text-[11px]">दिनांक:</span>
                    <strong className="text-stone-900">{selectedReceiptForPrint.date}</strong>
                  </div>

                  <div>
                    <span className="text-stone-500 block text-[11px]">दानदाता का नाम:</span>
                    <strong className="text-sm sm:text-base text-stone-900 font-bold">{selectedReceiptForPrint.donorName}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-stone-500 block text-[11px]">मोबाइल नंबर:</span>
                    <strong className="font-mono text-stone-900">{selectedReceiptForPrint.mobile}</strong>
                  </div>

                  {selectedReceiptForPrint.pan && (
                    <div>
                      <span className="text-stone-500 block text-[11px]">पैन नंबर (PAN):</span>
                      <strong className="font-mono text-stone-900">{selectedReceiptForPrint.pan}</strong>
                    </div>
                  )}

                  <div className={selectedReceiptForPrint.pan ? 'text-right' : 'col-span-2'}>
                    <span className="text-stone-500 block text-[11px]">सहयोग प्रकल्प / उद्देश्य:</span>
                    <strong className="text-emerald-900 font-semibold">{selectedReceiptForPrint.cause}</strong>
                  </div>
                </div>

                {/* Amount Box */}
                <div className="bg-white p-3.5 rounded-xl border border-amber-300 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-stone-500 block">प्राप्त सहयोग राशि:</span>
                    <span className="text-xl font-bold font-mono text-[#0f4d3a]">
                      ₹{selectedReceiptForPrint.amount.toLocaleString('en-IN')} /-
                    </span>
                  </div>
                  <div className="text-right text-xs text-stone-600">
                    <div>माध्यम: <strong>{selectedReceiptForPrint.paymentMode}</strong></div>
                    <div>संदर्भ: <span className="font-mono">{selectedReceiptForPrint.transactionRef}</span></div>
                  </div>
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

              </div>

              <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-stone-200 no-print">
                <button
                  type="button"
                  onClick={() => setSelectedReceiptForPrint(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-300 rounded-xl cursor-pointer"
                >
                  बंद करें
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-[#0f4d3a] hover:bg-[#125843] rounded-xl shadow cursor-pointer transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>रसीद प्रिंट / PDF सेव करें</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
