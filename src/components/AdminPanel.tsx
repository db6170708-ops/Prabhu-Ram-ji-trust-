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
  RefreshCw
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onDataUpdated: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, onDataUpdated }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'news' | 'photos' | 'videos' | 'transparency' | 'receipts' | 'backup'>('photos');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Active in-memory state synced with storage
  const [photosList, setPhotosList] = useState<GalleryPhoto[]>([]);
  const [videosList, setVideosList] = useState<GalleryVideo[]>([]);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [transparencyList, setTransparencyList] = useState<TransparencyRecord[]>([]);

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

      </div>
    </div>
  );
};
