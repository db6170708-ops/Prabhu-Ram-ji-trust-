import React, { useState } from 'react';
import { StorageService } from '../utils/storage';
import { VolunteerApplication } from '../types';
import { TRUST_INFO } from '../data/defaultData';
import { TRANSLATIONS, Language } from '../utils/translations';
import { X, HeartHandshake, CheckCircle2, Search, UserCheck, Phone, MapPin, Send } from 'lucide-react';

interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const VolunteerModal: React.FC<VolunteerModalProps> = ({ isOpen, onClose, language }) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'register' | 'status'>('register');

  // Form fields
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [preferredArea, setPreferredArea] = useState('शनिवार शाम भंडारा सेवा');
  const [availability, setAvailability] = useState('सप्ताहांत (शनिवार / रविवार)');
  const [notes, setNotes] = useState('');

  // Submission state
  const [submittedApp, setSubmittedApp] = useState<VolunteerApplication | null>(null);

  // Status check
  const [searchPhone, setSearchPhone] = useState('');
  const [foundApp, setFoundApp] = useState<VolunteerApplication | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !mobile.trim() || mobile.replace(/\D/g, '').length < 10) {
      alert('कृपया अपना पूरा नाम और 10 अंकों का मोबाइल नंबर दर्ज करें।');
      return;
    }

    const application: VolunteerApplication = {
      id: `VOL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      email: email.trim() || undefined,
      city: city.trim() || 'गलगाँव',
      preferredArea,
      availability,
      notes: notes.trim() || undefined,
      status: 'pending',
      appliedAt: new Date().toISOString(),
    };

    StorageService.saveVolunteer(application);
    setSubmittedApp(application);
  };

  const handleSearchStatus = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchPhone.replace(/\D/g, '');
    if (clean.length < 10) {
      alert('कृपया 10 अंकों का मोबाइल नंबर दर्ज करें।');
      return;
    }

    const volunteers = StorageService.getVolunteers();
    const match = volunteers.find(
      (v) => v.mobile.replace(/\D/g, '').includes(clean) || v.id.toLowerCase() === searchPhone.toLowerCase().trim()
    );
    setFoundApp(match || null);
    setHasSearched(true);
  };

  const resetForm = () => {
    setFullName('');
    setMobile('');
    setEmail('');
    setCity('');
    setNotes('');
    setSubmittedApp(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0f4d3a] to-[#175b45] p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {language === 'hi' ? 'स्वयंसेवक सेवा पंजीकरण' : 'Volunteer Registration'}
              </h3>
              <p className="text-xs text-amber-200/90">
                {language === 'hi'
                  ? 'प्रभु रामजी ट्रस्ट सेवा कार्यों में अपना योगदान दें'
                  : 'Join the sacred service initiatives of Prabhu Ramji Trust'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 bg-stone-50 shrink-0">
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold text-center border-b-2 transition-colors ${
              activeTab === 'register'
                ? 'border-[#0f4d3a] text-[#0f4d3a] bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {language === 'hi' ? '📝 नया स्वयंसेवक पंजीकरण' : '📝 New Registration'}
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold text-center border-b-2 transition-colors ${
              activeTab === 'status'
                ? 'border-[#0f4d3a] text-[#0f4d3a] bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {language === 'hi' ? '🔍 आवेदन स्थिति जांचें' : '🔍 Check Status'}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activeTab === 'register' ? (
            submittedApp ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-50">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-stone-900">
                    {language === 'hi' ? 'पंजीकरण सफल रहा!' : 'Registration Successful!'}
                  </h4>
                  <p className="text-sm text-stone-600 mt-1">
                    {language === 'hi'
                      ? 'जय श्री राम! आपका स्वयंसेवक आवेदन ट्रस्ट को प्राप्त हो गया है।'
                      : 'Jai Shri Ram! Your volunteer registration has been received by the trust.'}
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left max-w-md mx-auto space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500">आवेदन संदर्भ संख्या (ID):</span>
                    <span className="font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-amber-300">
                      {submittedApp.id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500">स्वयंसेवक का नाम:</span>
                    <span className="font-semibold text-stone-800">{submittedApp.fullName}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500">पसंदीदा सेवा:</span>
                    <span className="font-semibold text-stone-800">{submittedApp.preferredArea}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500">स्थिति (Status):</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      समीक्षाधीन (Under Review)
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                  <a
                    href={`https://wa.me/919977894957?text=${encodeURIComponent(
                      `जय श्री राम! मैंने प्रभु रामजी ट्रस्ट स्वयंसेवक के रूप में पंजीकरण किया है। मेरा आवेदन क्रमांक: ${submittedApp.id} है। नाम: ${submittedApp.fullName}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm transition-all"
                  >
                    <span>WhatsApp पर ट्रस्ट से पुष्टि करें</span>
                  </a>
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 text-xs sm:text-sm text-stone-600 hover:text-stone-900 border border-stone-300 rounded-xl font-medium"
                  >
                    अन्य पंजीकरण करें
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      पूरा नाम (Full Name) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. रमेश कुमार बिरला"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0f4d3a] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      मोबाइल नंबर (WhatsApp No.) *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10 अंकों का मोबाइल नंबर"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0f4d3a] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      ईमेल (Email - Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0f4d3a] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      गाँव / शहर व जिला (City/Village)
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. गलगाँव / सनावद / खरगोन"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0f4d3a] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    पसंदीदा सेवा क्षेत्र (Preferred Seva) *
                  </label>
                  <select
                    value={preferredArea}
                    onChange={(e) => setPreferredArea(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0f4d3a] focus:outline-none bg-white"
                  >
                    <option value="शनिवार शाम भंडारा सेवा">शनिवार शाम भंडारा सेवा (Saturday Evening Bhandara)</option>
                    <option value="दैनिक निःशुल्क चाय सेवा">दैनिक निःशुल्क चाय सेवा (Daily Free Tea Seva)</option>
                    <option value="गौशाला सेवा व चारा वितरण">गौशाला सेवा व चारा वितरण (Gaushala & Cow Care)</option>
                    <option value="आश्रम एवं मंदिर निर्माण">आश्रम एवं मंदिर निर्माण सहयोग (Ashram Construction)</option>
                    <option value="चिकित्सा एवं स्वास्थ्य शिविर">चिकित्सा एवं स्वास्थ्य शिविर (Health Camp Seva)</option>
                    <option value="डिजिटल व सोशल मीडिया प्रचार">डिजिटल व सोशल मीडिया प्रचार (Digital Outreach)</option>
                    <option value="सांस्कृतिक एवं धार्मिक उत्सव">सांस्कृतिक एवं धार्मिक उत्सव प्रबंधन (Event Management)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    उपलब्धता (Availability) *
                  </label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0f4d3a] focus:outline-none bg-white"
                  >
                    <option value="सप्ताहांत (शनिवार / रविवार)">सप्ताहांत (शनिवार / रविवार केवल)</option>
                    <option value="दैनिक 1-2 घंटे (सुबह या शाम)">दैनिक 1-2 घंटे (सुबह अथवा शाम)</option>
                    <option value="विशेष पर्व एवं उत्सवों पर">विशेष पर्व एवं धार्मिक उत्सवों पर</option>
                    <option value="पूर्णकालिक सेवा (Full Time)">पूर्णकालिक सेवा (Full Time Seva)</option>
                    <option value="घर बैठे ऑनलाइन सहयोग">घर बैठे ऑनलाइन / डिजिटल सहयोग</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    विशेष संदेश अथवा पूर्व अनुभव (Optional Note)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="यदि आप किसी विशेष हुनर (जैसे कुकिंग, ड्राइविंग, अकाउंटिंग, फोटोग्राफी) में दक्ष हैं तो लिखें..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0f4d3a] focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#0f4d3a] to-[#165a44] hover:from-[#135541] hover:to-[#0f4d3a] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>स्वयंसेवक पंजीकरण जमा करें (Submit Registration)</span>
                </button>
              </form>
            )
          ) : (
            <div className="space-y-4">
              <form onSubmit={handleSearchStatus} className="flex gap-2">
                <input
                  type="text"
                  placeholder="अपना 10 अंकों का मोबाइल नंबर या आवेदन ID दर्ज करें"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0f4d3a] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0f4d3a] hover:bg-[#135541] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  <span>खोजें</span>
                </button>
              </form>

              {hasSearched && (
                foundApp ? (
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                      <div className="font-bold text-stone-900">{foundApp.fullName}</div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                          foundApp.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : foundApp.status === 'rejected'
                            ? 'bg-red-100 text-red-800 border-red-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        {foundApp.status === 'approved'
                          ? '✅ स्वीकृत (Approved)'
                          : foundApp.status === 'rejected'
                          ? '❌ अस्वीकृत (Rejected)'
                          : '⏳ समीक्षाधीन (Under Review)'}
                      </span>
                    </div>

                    <div className="text-xs space-y-1.5 text-stone-600">
                      <div>
                        <span className="font-medium text-stone-500">आवेदन ID:</span>{' '}
                        <span className="font-mono font-bold text-stone-800">{foundApp.id}</span>
                      </div>
                      <div>
                        <span className="font-medium text-stone-500">सेवा क्षेत्र:</span>{' '}
                        <span className="text-stone-800 font-semibold">{foundApp.preferredArea}</span>
                      </div>
                      <div>
                        <span className="font-medium text-stone-500">समय उपलब्धता:</span>{' '}
                        <span className="text-stone-800">{foundApp.availability}</span>
                      </div>
                      <div>
                        <span className="font-medium text-stone-500">पंजीकरण दिनांक:</span>{' '}
                        <span className="text-stone-800">
                          {new Date(foundApp.appliedAt || foundApp.appliedDate || Date.now()).toLocaleDateString('hi-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-stone-500 text-xs sm:text-sm bg-stone-50 rounded-xl p-4 border border-dashed border-stone-300">
                    इस नंबर या ID से कोई स्वयंसेवक आवेदन नहीं मिला। कृपया पुनः जाँचें या नया पंजीकरण करें।
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 flex justify-between items-center text-xs text-stone-600 shrink-0">
          <span>हेल्पलाइन: {TRUST_INFO.phone}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 font-medium rounded-lg text-stone-700 transition-colors"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};
