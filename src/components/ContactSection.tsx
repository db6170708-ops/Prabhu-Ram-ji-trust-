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
  Layers,
  Globe,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [mapView, setMapView] = useState<'k' | 'h' | 'm'>('k'); // Default to Satellite ('k')
  const [zoomLevel, setZoomLevel] = useState<number>(17);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactError(null);
    if (!name.trim() || !mobile.trim() || !message.trim()) {
      setContactError('कृपया सभी आवश्यक जानकारी (नाम, मोबाइल नंबर एवं संदेश) दर्ज करें।');
      return;
    }

    setSubmitted(true);
    // WhatsApp direct prefilled link with updated official Trust number
    const whatsappText = encodeURIComponent(
      `नमस्ते प्रभु रामजी ट्रस्ट,\nमेरा नाम: ${name}\nमोबाइल: ${mobile}\nविषय: ${subject || 'सेवा कार्य संबंधी'}\nसंदेश: ${message}`
    );
    window.open(`https://api.whatsapp.com/send?phone=919575301233&text=${whatsappText}`, '_blank');
  };

  return (
    <section id="contact" className="py-16 md:py-24 pb-28 md:pb-28 bg-[#FAF7F2] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-300">
            हमसे संपर्क करें
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0f4d3a] mt-3">
            पता, दिशा-निर्देश एवं संवाद सूत्र
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
          <p className="text-stone-600 mt-4 text-base sm:text-lg">
            गौसेवा, शनिवार भंडारा या नर्मदा परिक्रमा सहयोग हेतु कभी भी पधारें अथवा संपर्क करें।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Official Contact & Address Details */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6">
              
              <div>
                <h3 className="font-heading text-xl font-bold text-[#0f4d3a]">
                  प्रभु रामजी ट्रस्ट कार्यालय
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  अधिकृत सेवा केंद्र एवं मुख्य गौशाला परिसर
                </p>
              </div>

              {/* Full Address */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0f4d3a] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-stone-700 uppercase">पूरा आधिकारिक पता</h4>
                  <p className="text-sm text-stone-800 font-medium mt-0.5 leading-relaxed break-words">
                    {TRUST_INFO.fullAddress}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold font-mono break-all">
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>Plus Code: 5X5W+4JR Galgaon, Madhya Pradesh</span>
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    (सनावद से लगभग 10-12 किमी, माँ नर्मदा परिक्रमा मार्ग के समीप)
                  </p>
                </div>
              </div>

              {/* Mobile Phone & WhatsApp Helpline */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                  <Phone className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-stone-700 uppercase">अधिकृत संपर्क व WhatsApp नंबर</h4>
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
                        WhatsApp & कॉलिंग
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
                          (कार्यालय संपर्क)
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    (श्री दिनेश जी / अध्यक्ष श्री गुलाबचंद जी)
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0f4d3a] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-stone-700 uppercase">ईमेल संपर्क</h4>
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
                  <h4 className="text-xs font-bold text-stone-700 uppercase">आधिकारिक पोर्टल (Official Website)</h4>
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
                  <h4 className="text-xs font-bold text-stone-700 uppercase">दर्शन एवं सेवा समय</h4>
                  <p className="text-xs sm:text-sm text-stone-800 mt-0.5">
                    प्रातः 07:00 बजे से सायं 07:30 बजे तक
                  </p>
                  <p className="text-xs text-amber-700 font-semibold mt-0.5">
                    शनिवार महाभंडारा: प्रातः 11:30 बजे से प्रसादी
                  </p>
                </div>
              </div>

              {/* Direct Buttons */}
              <div className="pt-4 border-t border-stone-100 space-y-2.5 pb-2">
                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={`tel:${TRUST_INFO.phone.replace(/[^0-9+]/g, '')}`}
                    className="inline-flex items-center justify-center gap-2 py-3 px-3 text-xs font-bold text-white bg-[#0f4d3a] hover:bg-[#125843] rounded-xl transition-all shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>कॉल करें</span>
                  </a>

                  <a
                    href={TRUST_INFO.whatsappContactUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-3 px-3 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl transition-all shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>WhatsApp चैट</span>
                  </a>
                </div>

                <a
                  href={TRUST_INFO.whatsappContactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 sm:px-4 text-xs font-bold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-all border border-emerald-300 text-center"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>WhatsApp पर संपर्क जोड़ें (Add on WhatsApp)</span>
                </a>

                <div className="text-center pt-1 pb-1">
                  <a
                    href={TRUST_INFO.whatsappChannel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors text-center"
                  >
                    <span>प्रभु रामजी ट्रस्ट WhatsApp चैनल से जुड़ें →</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Google Maps Directions Guidance Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200">
              <div className="flex items-center gap-2 mb-3">
                <Navigation className="w-5 h-5 text-amber-600" />
                <h4 className="font-heading text-base font-bold text-stone-900">
                  सनावद / ओंकारेश्वर से कैसे पहुँचें?
                </h4>
              </div>
              <ul className="text-xs text-stone-600 space-y-1.5 leading-relaxed">
                <li>• <strong>सनावद से:</strong> सनावद बस स्टैंड / रेलवे स्टेशन से ऑटो या निजी वाहन द्वारा ग्राम गलगाँव (10-12 किमी)।</li>
                <li>• <strong>ओंकारेश्वर ज्योतिर्लिंग से:</strong> मात्र 22 किमी दूरी पर निमाड़ अंचल मार्ग।</li>
                <li>• <strong>इंदौर से:</strong> इंदौर-इच्छापुर हाइवे होकर सनावद पहुँचें, वहां से गलगाँव।</li>
              </ul>
              <div className="mt-4 pt-3 border-t border-stone-100">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=5X5W%2B4JR+Galgaon,+Madhya+Pradesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-[#0f4d3a] bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Google Maps पर लोकेशन खोलें (5X5W+4JR)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Inquiry Form & Map Preview */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200">
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#0f4d3a] mb-2">
                संदेश या सहयोग प्रस्ताव भेजें
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mb-6">
                शनिवार भंडारा प्रायोजन, गौसेवा सहयोग या किसी भी जिज्ञासा हेतु नीचे दिए फॉर्म में लिखें।
              </p>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-heading text-lg font-bold text-emerald-900">
                    आपका संदेश सफलता पूर्वक तैयार है!
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-800">
                    WhatsApp पर संदेश भेज दिया गया है। ट्रस्ट के प्रतिनिधि शीघ्र आपसे संपर्क करेंगे।
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setMobile('');
                      setMessage('');
                    }}
                    className="mt-3 px-4 py-2 text-xs font-bold text-white bg-[#0f4d3a] rounded-lg"
                  >
                    अन्य संदेश भेजें
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        आपका नाम *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="उदा. राहुल शर्मा"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4d3a] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        मोबाइल नंबर *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="उदा. 98260XXXXX"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4d3a] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      विषय
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4d3a]"
                    >
                      <option value="गौसेवा हेतु चारा सहयोग">गौसेवा हेतु चारा सहयोग</option>
                      <option value="शनिवार भंडारा प्रायोजन">शनिवार भंडारा प्रायोजन (जन्मदिन/पुण्यतिथि)</option>
                      <option value="नर्मदा परिक्रमा सेवा में सहभागिता">नर्मदा परिक्रमा सेवा में सहभागिता</option>
                      <option value="सामान्य जिज्ञासा या भेंट हेतु">सामान्य जिज्ञासा या भेंट हेतु</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      आपका संदेश / विवरण *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="यहाँ अपना संदेश विस्तार से लिखें..."
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
                    <span>संदेश भेजें (सीधे WhatsApp से जुड़ें)</span>
                  </button>
                </form>
              )}
            </div>

            {/* Embedded Google Maps visual frame with Satellite View for Plus Code: 5X5W+4JR Galgaon, Madhya Pradesh */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-200 overflow-hidden space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0f4d3a]">
                    <Globe className="w-4 h-4 text-emerald-600 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-heading text-sm font-bold text-stone-900">
                        Google Maps लाइव लोकेशन
                      </h4>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                        सैटेलाइट व्यू
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#0f4d3a] hover:bg-[#125843] rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-amber-300" />
                  <span>Google Maps सैटेलाइट में खोलें</span>
                  <ExternalLink className="w-3 h-3 text-emerald-200" />
                </a>
              </div>

              {/* Satellite / Hybrid / Roadmap Mode Selector & Zoom Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-100/80 p-1.5 rounded-xl border border-stone-200 text-xs">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setMapView('k')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                      mapView === 'k'
                        ? 'bg-[#0f4d3a] text-white shadow-sm'
                        : 'text-stone-700 hover:bg-white/80'
                    }`}
                  >
                    <span>🛰️ सैटेलाइट</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMapView('h')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                      mapView === 'h'
                        ? 'bg-[#0f4d3a] text-white shadow-sm'
                        : 'text-stone-700 hover:bg-white/80'
                    }`}
                  >
                    <span>🛰️🏷️ हाइब्रिड</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMapView('m')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                      mapView === 'm'
                        ? 'bg-[#0f4d3a] text-white shadow-sm'
                        : 'text-stone-700 hover:bg-white/80'
                    }`}
                  >
                    <span>🗺️ रोड मैप</span>
                  </button>
                </div>

                {/* Zoom level controls */}
                <div className="flex items-center gap-1 text-stone-600">
                  <span className="text-[11px] font-medium text-stone-500 mr-1 hidden sm:inline">ज़ूम:</span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(z + 1, 19))}
                    className="p-1 rounded bg-white hover:bg-stone-200 border border-stone-300 text-stone-700 transition-colors"
                    title="ज़ूम इन करें (+)"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(z - 1, 13))}
                    className="p-1 rounded bg-white hover:bg-stone-200 border border-stone-300 text-stone-700 transition-colors"
                    title="ज़ूम आउट करें (-)"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Satellite Map iframe */}
              <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-inner relative bg-stone-900">
                <iframe
                  title="Google Maps Location 5X5W+4JR Galgaon, Madhya Pradesh - प्रभु रामजी ट्रस्ट (सैटेलाइट दृश्य)"
                  src={`https://maps.google.com/maps?q=5X5W%2B4JR+Galgaon,+Madhya+Pradesh&t=${mapView}&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="320"
                  className="w-full border-0 block"
                  loading="lazy"
                  allowFullScreen
                />
              </div>

              <div className="text-[11px] text-stone-500 text-center flex items-center justify-center gap-1.5 pt-1">
                <Navigation className="w-3.5 h-3.5 text-amber-600" />
                <span>नेविगेशन हेतु ऊपर दिए बटन पर क्लिक करें या GPS में Plus Code <strong>5X5W+4JR</strong> दर्ज करें।</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
