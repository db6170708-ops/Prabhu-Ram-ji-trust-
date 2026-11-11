import React, { useState } from 'react';
import { TRUST_INFO } from '../data/defaultData';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  MessageCircle, 
  Navigation, 
  CheckCircle2,
  ExternalLink,
  Globe,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';

interface ContactSectionProps {
  language?: Language;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ language = 'hi' }) => {
  const isEn = language === 'en';
  const t = TRANSLATIONS[language] || TRANSLATIONS['hi'];
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [subject, setSubject] = useState(isEn ? 'Fodder Contribution for Gaushala' : 'गौसेवा हेतु चारा सहयोग');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedWhatsAppUrl, setSubmittedWhatsAppUrl] = useState<string>('');
  const [contactError, setContactError] = useState<string | null>(null);
  const [mapView, setMapView] = useState<'k' | 'h' | 'm'>('k');
  const [zoomLevel, setZoomLevel] = useState<number>(17);
  const [isInteractiveMapActive, setIsInteractiveMapActive] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactError(null);
    if (!name.trim() || !mobile.trim() || !message.trim()) {
      setContactError(
        isEn
          ? 'Please enter all required fields (Name, Mobile, and Message).'
          : 'कृपया सभी आवश्यक जानकारी (नाम, मोबाइल नंबर एवं संदेश) दर्ज करें।'
      );
      return;
    }

    const whatsappText = encodeURIComponent(
      `नमस्ते प्रभु रामजी ट्रस्ट,\nName: ${name}\nMobile: ${mobile}\nSubject: ${subject}\nMessage: ${message}`
    );
    const targetUrl = `https://api.whatsapp.com/send?phone=919575301233&text=${whatsappText}`;
    setSubmittedWhatsAppUrl(targetUrl);
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-16 md:py-24 pb-28 md:pb-28 bg-[#FAF7F2] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-300">
            {t.contactTag}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0f4d3a] mt-3">
            {t.contactTitle}
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
          <p className="text-stone-600 mt-4 text-base sm:text-lg">
            {isEn 
              ? "Visit or contact us anytime for cow welfare, Saturday Bhandara, or Narmada Parikrama pilgrim service."
              : "गौसेवा, शनिवार भंडारा या नर्मदा परिक्रमा सहयोग हेतु कभी भी पधारें अथवा संपर्क करें।"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Official Contact & Address Details */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-6">
              
              <div>
                <h3 className="font-heading text-xl font-bold text-[#0f4d3a]">
                  {isEn ? "Prabhu Ramji Trust Office" : "प्रभु रामजी ट्रस्ट कार्यालय"}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  {isEn ? "Authorized Center & Gaushala Premises" : "अधिकृत सेवा केंद्र एवं मुख्य गौशाला परिसर"}
                </p>
              </div>

              {/* Full Address */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0f4d3a] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-stone-700 uppercase">{t.contactFullAddressLabel}</h4>
                  <p className="text-sm text-stone-800 font-medium mt-0.5 leading-relaxed break-words">
                    {isEn ? "Prabhu Ramji Trust, Village Galgaon, Tehsil Sanawad, Dist. Khargone (M.P.) - 451111" : TRUST_INFO.fullAddress}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold font-mono break-all">
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>Plus Code: 5X5W+4JR Galgaon, Madhya Pradesh</span>
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    {isEn ? "(Approx. 10-12 km from Sanawad, near Maa Narmada Parikrama Route)" : "(सनावद से लगभग 10-12 किमी, माँ नर्मदा परिक्रमा मार्ग के समीप)"}
                  </p>
                </div>
              </div>

              {/* Mobile Phone & WhatsApp Helpline */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                  <Phone className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-stone-700 uppercase">{t.contactHelplineLabel}</h4>
                  <div className="mt-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={`tel:${TRUST_INFO.phone.replace(/[^0-9+]/g, '')}`}
                        className="text-base text-stone-900 font-bold hover:text-[#0f4d3a] transition-colors font-mono tracking-tight"
                      >
                        {TRUST_INFO.phone}
                      </a>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <MessageCircle className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" />
                        {isEn ? "WhatsApp & Calls" : "WhatsApp व कॉलिंग"}
                      </span>
                    </div>

                    {TRUST_INFO.secondaryPhone && (
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <a
                          href={`tel:${TRUST_INFO.secondaryPhone.replace(/[^0-9+]/g, '')}`}
                          className="text-sm text-stone-700 font-semibold hover:text-[#0f4d3a] transition-colors font-mono"
                        >
                          {TRUST_INFO.secondaryPhone}
                        </a>
                        <span className="text-[11px] text-stone-500 font-normal">
                          {isEn ? "(Office Contact)" : "(कार्यालय संपर्क)"}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    {isEn ? "(Shri Dinesh Ji / President Shri Gulabchand Ji)" : "(श्री दिनेश जी / अध्यक्ष श्री गुलाबचंद जी)"}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0f4d3a] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-stone-700 uppercase">{t.contactEmailLabel}</h4>
                  <a
                    href={`mailto:${TRUST_INFO.email}`}
                    className="text-xs sm:text-sm font-medium text-stone-900 hover:text-[#0f4d3a] transition-colors block mt-0.5 font-mono break-all"
                  >
                    {TRUST_INFO.email}
                  </a>
                </div>
              </div>

              {/* Official Website */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-stone-700 uppercase">{isEn ? "Official Portal" : "आधिकारिक पोर्टल"}</h4>
                  <a
                    href="https://prabhuramjitrustram.ai.studio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm font-semibold text-emerald-800 hover:text-[#0f4d3a] transition-colors block mt-0.5 font-mono underline underline-offset-2 break-all"
                  >
                    https://prabhuramjitrustram.ai.studio/
                  </a>
                </div>
              </div>

              {/* Visiting Hours */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-stone-700 uppercase">{t.contactVisitingLabel}</h4>
                  <p className="text-xs sm:text-sm text-stone-800 mt-0.5">
                    {isEn ? "7:00 AM to 7:30 PM Daily" : "प्रातः 07:00 बजे से सायं 07:30 बजे तक"}
                  </p>
                  <p className="text-xs text-amber-700 font-semibold mt-0.5">
                    {isEn ? "Saturday Community Bhandara: Prasad from 11:30 AM" : "शनिवार महाभंडारा: प्रातः 11:30 बजे से प्रसादी"}
                  </p>
                </div>
              </div>

              {/* Direct Buttons */}
              <div className="pt-4 border-t border-stone-100 space-y-2.5 pb-2">
                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={`tel:${TRUST_INFO.phone.replace(/[^0-9+]/g, '')}`}
                    className="inline-flex items-center justify-center gap-2 py-3 px-3 text-xs font-bold text-white bg-[#0f4d3a] hover:bg-[#125843] rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t.contactCallBtn}</span>
                  </a>

                  <a
                    href={TRUST_INFO.whatsappContactUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-3 px-3 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>{t.contactChatBtn}</span>
                  </a>
                </div>

                <a
                  href={TRUST_INFO.whatsappContactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 sm:px-4 text-xs font-bold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-all border border-emerald-300 text-center cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>{t.contactAddMeBtn}</span>
                </a>

                <div className="text-center pt-1 pb-1">
                  <a
                    href={TRUST_INFO.whatsappChannel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors text-center cursor-pointer"
                  >
                    <span>{t.contactChannelBtn}</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Directions Guidance Card */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-stone-200">
              <div className="flex items-center gap-2 mb-3">
                <Navigation className="w-5 h-5 text-amber-600" />
                <h4 className="font-heading text-base font-bold text-stone-900">
                  {isEn ? "How to Reach from Sanawad / Omkareshwar?" : "सनावद / ओंकारेश्वर से कैसे पहुँचें?"}
                </h4>
              </div>
              <ul className="text-xs text-stone-600 space-y-1.5 leading-relaxed">
                <li>• <strong>{isEn ? "From Sanawad:" : "सनावद से:"}</strong> {isEn ? "10-12 km by auto or private vehicle from Sanawad Bus Stand / Railway Station to Village Galgaon." : "सनावद बस स्टैंड / रेलवे स्टेशन से ऑटो या निजी वाहन द्वारा ग्राम गलगाँव (10-12 किमी)।"}</li>
                <li>• <strong>{isEn ? "From Omkareshwar Jyotirlinga:" : "ओंकारेश्वर ज्योतिर्लिंग से:"}</strong> {isEn ? "Approx. 22 km distance along the Nimar valley highway." : "मात्र 22 किमी दूरी पर निमाड़ अंचल मार्ग।"}</li>
                <li>• <strong>{isEn ? "From Indore:" : "इंदौर से:"}</strong> {isEn ? "Reach Sanawad via Indore-Icchapur Highway, then turn towards Galgaon." : "इंदौर-इच्छापुर हाइवे होकर सनावद पहुँचें, वहां से गलगाँव।"}</li>
              </ul>
              <div className="mt-4 pt-3 border-t border-stone-100">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=5X5W%2B4JR+Galgaon,+Madhya+Pradesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-[#0f4d3a] bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isEn ? "Open in Google Maps (5X5W+4JR)" : "Google Maps पर लोकेशन खोलें (5X5W+4JR)"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Inquiry Form & Map Preview */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-stone-200">
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#0f4d3a] mb-2">
                {isEn ? "Send a Message or Proposal" : "संदेश या सहयोग प्रस्ताव भेजें"}
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mb-6">
                {isEn 
                  ? "Write to us regarding Saturday Bhandara sponsorship, cow welfare support, or any inquiries."
                  : "शनिवार भंडारा प्रायोजन, गौसेवा सहयोग या किसी भी जिज्ञासा हेतु नीचे दिए फॉर्म में लिखें।"}
              </p>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center space-y-3.5">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-heading text-lg font-bold text-emerald-900">
                    {isEn ? "Your Message is Ready!" : "आपका संदेश तैयार है!"}
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-800">
                    {isEn ? "Click the button below to send your message directly to the Trust WhatsApp:" : "नीचे दिए गए बटन पर क्लिक करके सीधे ट्रस्ट के अधिकृत WhatsApp पर अपना संदेश भेजें:"}
                  </p>
                  
                  {submittedWhatsAppUrl && (
                    <div className="pt-1">
                      <a
                        href={submittedWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md transition-all cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-200" />
                        <span>{isEn ? "Send on WhatsApp Now →" : "WhatsApp पर संदेश अभी भेजें →"}</span>
                      </a>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setMobile('');
                      setMessage('');
                      setSubmittedWhatsAppUrl('');
                    }}
                    className="mt-2 text-xs font-semibold text-emerald-900 hover:underline cursor-pointer block mx-auto"
                  >
                    {isEn ? "Write another message" : "अन्य संदेश लिखें"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        {isEn ? "Your Name *" : "आपका नाम *"}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={isEn ? "e.g. Rahul Sharma" : "उदा. राहुल शर्मा"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4d3a] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        {isEn ? "Mobile Number *" : "मोबाइल नंबर *"}
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="98260XXXXX"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4d3a] focus:bg-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {isEn ? "Subject" : "विषय"}
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4d3a]"
                    >
                      <option value={isEn ? "Fodder Contribution for Gaushala" : "गौसेवा हेतु चारा सहयोग"}>
                        {isEn ? "Fodder Contribution for Gaushala" : "गौसेवा हेतु चारा सहयोग"}
                      </option>
                      <option value={isEn ? "Saturday Bhandara Sponsorship" : "शनिवार भंडारा प्रायोजन"}>
                        {isEn ? "Saturday Bhandara Sponsorship" : "शनिवार भंडारा प्रायोजन (जन्मदिन/पुण्यतिथि)"}
                      </option>
                      <option value={isEn ? "Narmada Parikrama Seva Participation" : "नर्मदा परिक्रमा सेवा में सहभागिता"}>
                        {isEn ? "Narmada Parikrama Seva Participation" : "नर्मदा परिक्रमा सेवा में सहभागिता"}
                      </option>
                      <option value={isEn ? "General Inquiry or Visit" : "सामान्य जिज्ञासा या भेंट हेतु"}>
                        {isEn ? "General Inquiry or Visit" : "सामान्य जिज्ञासा या भेंट हेतु"}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {isEn ? "Your Message / Details *" : "आपका संदेश / विवरण *"}
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder={isEn ? "Write your message in detail here..." : "यहाँ अपना संदेश विस्तार से लिखें..."}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4d3a] focus:bg-white resize-none"
                    />
                  </div>

                  {contactError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold rounded-xl text-center animate-fadeIn">
                      ⚠️ {contactError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 text-sm font-bold text-white bg-[#0f4d3a] hover:bg-[#125843] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-amber-300" />
                    <span>{isEn ? "Send Message via WhatsApp" : "संदेश भेजें (सीधे WhatsApp से जुड़ें)"}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Embedded Google Maps visual frame */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-stone-200 overflow-hidden space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0f4d3a]">
                    <Globe className="w-4 h-4 text-emerald-600 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-heading text-sm font-bold text-stone-900">
                        {isEn ? "Google Maps Live Location" : "Google Maps लाइव लोकेशन"}
                      </h4>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                        {isEn ? "Satellite View" : "सैटेलाइट व्यू"}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-emerald-800 font-semibold">
                      Plus Code: 5X5W+4JR Galgaon, Madhya Pradesh
                    </p>
                  </div>
                </div>

                <a
                  href={TRUST_INFO.googleMapsSatelliteUrl || "https://www.google.com/maps/search/?api=1&query=5X5W%2B4JR+Galgaon,+Madhya+Pradesh&data=!3m1!1e3"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#0f4d3a] hover:bg-[#125843] rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isEn ? "Open in Google Maps" : "Google Maps में खोलें"}</span>
                  <ExternalLink className="w-3 h-3 text-emerald-200" />
                </a>
              </div>

              {!isInteractiveMapActive ? (
                <div className="relative rounded-2xl overflow-hidden border border-emerald-900/30 bg-gradient-to-br from-[#062017] via-[#0b3326] to-[#124d3a] p-6 text-white shadow-md">
                  <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
                  
                  <div className="relative z-10 space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          <span>{isEn ? "Sacred Ashram & Gaushala Premises" : "पवित्र आश्रम एवं गौशाला स्थल"}</span>
                        </div>
                        <h5 className="font-heading text-lg sm:text-xl font-bold text-amber-100 mt-2">
                          {t.trustName}, {isEn ? "Gram Galgaon" : "ग्राम गलगाँव"}
                        </h5>
                        <p className="text-xs text-stone-300 mt-0.5">
                          {t.tagline}
                        </p>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-xs font-mono text-emerald-300 font-bold block">
                          5X5W+4JR
                        </span>
                        <span className="text-[10px] text-stone-400">
                          Google Plus Code
                        </span>
                      </div>
                    </div>

                    <div className="bg-black/35 border border-white/10 rounded-xl p-3 text-xs text-stone-200 space-y-1.5">
                      <p className="flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{isEn ? "Only 10-12 km from Sanawad Bus Stand / Railway Station" : "सनावद बस स्टैंड / रेलवे स्टेशन से मात्र 10-12 किमी"}</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-stone-300">
                        <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{isEn ? "Distance from Omkareshwar Jyotirlinga: Approx. 22 km" : "ओंकारेश्वर ज्योतिर्लिंग से दूरी: लगभग 22 किमी"}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsInteractiveMapActive(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-[#08241b] bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 rounded-xl shadow-md transition-all cursor-pointer"
                      >
                        <Globe className="w-4 h-4 text-[#08241b]" />
                        <span>{isEn ? "Load Live Satellite Map" : "लाइव सैटेलाइट मैप लोड करें"}</span>
                      </button>

                      <a
                        href="https://www.google.com/maps/dir/?api=1&destination=5X5W%2B4JR+Galgaon,+Madhya+Pradesh"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5 text-amber-300" />
                        <span>{isEn ? "Directions in Google Maps" : "Google Maps में दिशाएं देखें"}</span>
                        <ExternalLink className="w-3 h-3 text-stone-300" />
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-100/80 p-1.5 rounded-xl border border-stone-200 text-xs">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setMapView('k')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          mapView === 'k'
                            ? 'bg-[#0f4d3a] text-white shadow-xs'
                            : 'text-stone-700 hover:bg-white/80'
                        }`}
                      >
                        <span>{isEn ? "Satellite" : "सैटेलाइट"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMapView('h')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          mapView === 'h'
                            ? 'bg-[#0f4d3a] text-white shadow-xs'
                            : 'text-stone-700 hover:bg-white/80'
                        }`}
                      >
                        <span>{isEn ? "Hybrid" : "हाइब्रिड"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMapView('m')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          mapView === 'm'
                            ? 'bg-[#0f4d3a] text-white shadow-xs'
                            : 'text-stone-700 hover:bg-white/80'
                        }`}
                      >
                        <span>{isEn ? "Road Map" : "रोड मैप"}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-stone-600">
                        <button
                          type="button"
                          onClick={() => setZoomLevel((z) => Math.min(z + 1, 19))}
                          className="p-1 rounded bg-white hover:bg-stone-200 border border-stone-300 text-stone-700 transition-colors cursor-pointer"
                          title={isEn ? "Zoom In" : "ज़ूम इन"}
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setZoomLevel((z) => Math.max(z - 1, 13))}
                          className="p-1 rounded bg-white hover:bg-stone-200 border border-stone-300 text-stone-700 transition-colors cursor-pointer"
                          title={isEn ? "Zoom Out" : "ज़ूम आउट"}
                        >
                          <ZoomOut className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsInteractiveMapActive(false)}
                        className="px-2.5 py-1 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 rounded-lg border border-stone-300 transition-colors cursor-pointer"
                      >
                        ✕ {isEn ? "Close" : "बंद करें"}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-inner relative bg-stone-900">
                    <iframe
                      title="Google Maps Location 5X5W+4JR Galgaon, Madhya Pradesh"
                      src={`https://maps.google.com/maps?q=5X5W%2B4JR+Galgaon,+Madhya+Pradesh&t=${mapView}&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`}
                      width="100%"
                      height="340"
                      className="w-full border-0 block"
                      loading="lazy"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              <div className="text-[11px] text-stone-500 text-center flex items-center justify-center gap-1.5 pt-1">
                <Navigation className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {isEn 
                    ? "Click the button above for turn-by-turn navigation, or enter Plus Code 5X5W+4JR into your GPS."
                    : "नेविगेशन हेतु ऊपर दिए बटन पर क्लिक करें या GPS में Plus Code 5X5W+4JR दर्ज करें।"}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
