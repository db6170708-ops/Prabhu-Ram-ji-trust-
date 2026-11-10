import React, { useState } from 'react';
import { StorageService } from '../utils/storage';
import { ComplaintFeedback } from '../types';
import { TRUST_INFO } from '../data/defaultData';
import { Language } from '../utils/translations';
import { X, MessageSquare, Search, CheckCircle2, Send, HelpCircle, Phone, Clock } from 'lucide-react';

interface ComplaintFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const ComplaintFeedbackModal: React.FC<ComplaintFeedbackModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>('submit');

  // Submit form state
  const [type, setType] = useState<'feedback' | 'complaint' | 'inquiry'>('feedback');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('सुझाव (General Feedback)');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const [submittedTicket, setSubmittedTicket] = useState<ComplaintFeedback | null>(null);

  // Track state
  const [trackRef, setTrackRef] = useState('');
  const [foundTicket, setFoundTicket] = useState<ComplaintFeedback | null>(null);
  const [hasTracked, setHasTracked] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !subject.trim() || !description.trim()) {
      alert('कृपया सभी आवश्यक जानकारी भरें।');
      return;
    }

    const ticket: ComplaintFeedback = {
      id: `TKT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      type,
      name: name.trim(),
      phone: phone.trim(),
      category,
      subject: subject.trim(),
      description: description.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    StorageService.saveComplaint(ticket);
    setSubmittedTicket(ticket);
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackRef.trim()) return;
    const ticket = StorageService.findComplaint(trackRef.trim());
    setFoundTicket(ticket || null);
    setHasTracked(true);
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setSubject('');
    setDescription('');
    setSubmittedTicket(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0f4d3a] to-[#165a44] p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {language === 'hi' ? 'सुझाव, शिकायत व सहायता केंद्र' : 'Feedback & Grievance Center'}
              </h3>
              <p className="text-xs text-amber-200/90">
                {language === 'hi'
                  ? 'पारदर्शिता एवं निरंतर सेवा सुधार हेतु अपनी बात सीधे ट्रस्ट तक पहुँचाएँ'
                  : 'Submit feedback, inquiries or grievances directly to trust trustees'}
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
            onClick={() => setActiveTab('submit')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold text-center border-b-2 transition-colors ${
              activeTab === 'submit'
                ? 'border-[#0f4d3a] text-[#0f4d3a] bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {language === 'hi' ? '📝 नया संदेश / शिकायत दर्ज करें' : '📝 Submit Ticket'}
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold text-center border-b-2 transition-colors ${
              activeTab === 'track'
                ? 'border-[#0f4d3a] text-[#0f4d3a] bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {language === 'hi' ? '🔍 स्थिति ट्रैक करें (Track)' : '🔍 Track Status'}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activeTab === 'submit' ? (
            submittedTicket ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-50">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-stone-900">
                    {language === 'hi' ? 'संदेश सफलतापूर्वक दर्ज हुआ!' : 'Ticket Submitted Successfully!'}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1">
                    आपका संदर्भ क्रमांक नीचे दिया गया है। ट्रस्ट प्रबंधन द्वारा इसका शीघ्र संज्ञान लिया जाएगा।
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left max-w-md mx-auto space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500">टिकट संदर्भ संख्या (ID):</span>
                    <span className="font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-amber-300">
                      {submittedTicket.id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500">प्रकार / वर्ग:</span>
                    <span className="font-semibold text-stone-800">{submittedTicket.category}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500">विषय:</span>
                    <span className="font-semibold text-stone-800 truncate max-w-[200px]">{submittedTicket.subject}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500">वर्तमान स्थिति:</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      प्रक्रियाधीन (Pending Review)
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                  <a
                    href={`https://wa.me/919977894957?text=${encodeURIComponent(
                      `जय श्री राम! मैंने प्रभु रामजी ट्रस्ट पोर्टल पर संदेश/शिकायत दर्ज की है। टिकट ID: ${submittedTicket.id}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm transition-all"
                  >
                    <span>WhatsApp पर तुरंत सूचित करें</span>
                  </a>
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 text-xs sm:text-sm text-stone-600 hover:text-stone-900 border border-stone-300 rounded-xl font-medium"
                  >
                    अन्य संदेश लिखें
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Type Selection */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setType('feedback')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      type === 'feedback'
                        ? 'border-[#0f4d3a] bg-emerald-50 text-[#0f4d3a]'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    💡 सुझाव (Feedback)
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('complaint')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      type === 'complaint'
                        ? 'border-amber-600 bg-amber-50 text-amber-900'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    ⚠️ शिकायत (Complaint)
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('inquiry')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      type === 'inquiry'
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    ❓ पूछताछ (Inquiry)
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      आपका नाम (Name) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="पूरा नाम दर्ज करें"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0f4d3a] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      मोबाइल नंबर (Mobile No.) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10 अंकों का फोन नंबर"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0f4d3a] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    संबंधित श्रेणी (Category) *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0f4d3a] focus:outline-none bg-white"
                  >
                    <option value="सुझाव (General Feedback)">सामान्य सुझाव (General Feedback)</option>
                    <option value="दान एवं रसीद सत्यापन">दान एवं रसीद सत्यापन सहायता (Donation & Receipt)</option>
                    <option value="आश्रम एवं मंदिर निर्माण">आश्रम एवं मंदिर निर्माण प्रकल्प (Ashram Construction)</option>
                    <option value="शनिवार शाम भंडारा सेवा">शनिवार शाम भंडारा व्यवस्था (Saturday Bhandara)</option>
                    <option value="दैनिक निःशुल्क चाय सेवा">दैनिक निःशुल्क चाय सेवा (Daily Tea Seva)</option>
                    <option value="गौशाला एवं चारा वितरण">गौशाला एवं जीव सेवा (Gaushala Seva)</option>
                    <option value="वेबसाइट व तकनीकी सहायता">वेबसाइट व तकनीकी सहायता (Technical Issue)</option>
                    <option value="अन्य">अन्य (Other)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    विषय (Subject) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="संदेश का संक्षिप्त शीर्षक"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0f4d3a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    विस्तृत विवरण (Description) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="अपनी समस्या, सुझाव अथवा जिज्ञासा का स्पष्ट विवरण लिखें..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0f4d3a] focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-[#0f4d3a] to-[#165a44] hover:from-[#135541] hover:to-[#0f4d3a] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>दर्ज करें (Submit Ticket)</span>
                </button>
              </form>
            )
          ) : (
            <div className="space-y-4">
              <form onSubmit={handleTrack} className="flex gap-2">
                <input
                  type="text"
                  placeholder="टिकट संदर्भ ID दर्ज करें (उदा. TKT-2026-101)..."
                  value={trackRef}
                  onChange={(e) => setTrackRef(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0f4d3a] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0f4d3a] hover:bg-[#135541] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>ट्रैक करें</span>
                </button>
              </form>

              {hasTracked && (
                foundTicket ? (
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                      <div>
                        <div className="font-bold text-stone-900 text-sm">{foundTicket.subject}</div>
                        <div className="text-[11px] text-stone-500 font-mono">ID: {foundTicket.id}</div>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                          foundTicket.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : foundTicket.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        {foundTicket.status === 'resolved'
                          ? '✅ समाधान पूर्ण (Resolved)'
                          : foundTicket.status === 'in_progress'
                          ? '⏳ कार्यवाही जारी (In Progress)'
                          : '⏱️ समीक्षाधीन (Pending)'}
                      </span>
                    </div>

                    <div className="text-xs space-y-1.5 text-stone-700 bg-white p-3 rounded-lg border border-stone-200">
                      <div>
                        <span className="text-stone-500">श्रेणी:</span>{' '}
                        <span className="font-semibold">{foundTicket.category}</span>
                      </div>
                      <div>
                        <span className="text-stone-500">विवरण:</span> {foundTicket.description}
                      </div>
                      {foundTicket.adminResponse && (
                        <div className="mt-2 pt-2 border-t border-stone-200 text-emerald-800 font-medium bg-emerald-50/60 p-2 rounded">
                          <span className="font-bold">ट्रस्ट प्रबंधन उत्तर:</span>{' '}
                          {foundTicket.adminResponse}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-stone-500 text-xs sm:text-sm bg-stone-50 rounded-xl p-4 border border-dashed border-stone-300">
                    इस ID से कोई टिकट प्राप्त नहीं हुआ। कृपया ID पुनः जाँचें।
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 flex justify-between items-center text-xs text-stone-600 shrink-0">
          <span>कार्यालय संपर्क: {TRUST_INFO.phone}</span>
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
