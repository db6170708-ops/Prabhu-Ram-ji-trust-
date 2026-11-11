import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  HeartHandshake, 
  Award, 
  HelpCircle, 
  Search, 
  MessageSquareWarning, 
  FileSpreadsheet, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  PhoneCall, 
  MessageCircle, 
  MapPin, 
  ShieldCheck, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';
import { TRUST_INFO } from '../data/defaultData';

interface DevoteeServicesFolderProps {
  language?: Language;
  onOpenVolunteerModal: () => void;
  onOpenCertificateModal: () => void;
  onOpenComplaintModal: () => void;
  onOpenReceiptSearch: () => void;
  onNavigateToTransparency: () => void;
  onNavigateToContact: () => void;
}

export const DevoteeServicesFolder: React.FC<DevoteeServicesFolderProps> = ({
  language = 'hi',
  onOpenVolunteerModal,
  onOpenCertificateModal,
  onOpenComplaintModal,
  onOpenReceiptSearch,
  onNavigateToTransparency,
  onNavigateToContact
}) => {
  const isEn = language === 'en';
  const t = TRANSLATIONS[language] || TRANSLATIONS['hi'];
  const [isFolderOpen, setIsFolderOpen] = useState(true);

  const services = isEn
    ? [
        {
          id: 'volunteer',
          title: 'Volunteer Registration',
          desc: 'Join as a dedicated volunteer for Saturday Bhandara, morning tea distribution, cow welfare, or ashram work.',
          badge: 'Open for Devotees',
          icon: HeartHandshake,
          iconBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
          btnText: 'Register as Volunteer',
          onClick: onOpenVolunteerModal
        },
        {
          id: 'certificate',
          title: 'Digital Seva Certificate',
          desc: 'Search, verify, view, and print your official digitized Seva appreciation certificate with QR authentication.',
          badge: 'QR Verified',
          icon: Award,
          iconBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
          btnText: 'Get Seva Certificate',
          onClick: onOpenCertificateModal
        },
        {
          id: 'help',
          title: 'Devotee Helpline & Guide',
          desc: '24x7 helpline for Maa Narmada parikrama pilgrims, route guidance, accommodation support, and ashram visits.',
          badge: '24x7 Available',
          icon: HelpCircle,
          iconBg: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
          btnText: 'Contact Helpline',
          onClick: onNavigateToContact
        },
        {
          id: 'receipt',
          title: 'Donation Receipt Search',
          desc: 'Instant dual-verification search for official donation slips using your 10-digit mobile number and Receipt ID / UTR.',
          badge: 'Instant Verification',
          icon: Search,
          iconBg: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
          btnText: 'Find Donation Receipt',
          onClick: onOpenReceiptSearch
        },
        {
          id: 'complaint',
          title: 'Suggestions & Feedback',
          desc: 'Submit your valuable feedback, constructive suggestions, or grievances directly to the board of trustees.',
          badge: 'Direct Redressal',
          icon: MessageSquareWarning,
          iconBg: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
          btnText: 'Submit Suggestion / Query',
          onClick: onOpenComplaintModal
        },
        {
          id: 'transparency',
          title: 'Financial Transparency',
          desc: 'Open public inspection ledger detailing all donations received and dedicated expenses for cow care and bhandara.',
          badge: '100% Public Audit',
          icon: FileSpreadsheet,
          iconBg: 'bg-teal-500/20 text-teal-300 border-teal-400/40',
          btnText: 'View Monthly Ledger',
          onClick: onNavigateToTransparency
        }
      ]
    : [
        {
          id: 'volunteer',
          title: 'स्वयंसेवक सेवा पंजीकरण',
          desc: 'शनिवार शाम महाभंडारा, नित्य प्रातः चाय सेवा, गौशाला देखभाल अथवा आश्रम निर्माण में स्वयंसेवक बनकर पुण्य लाभ पाएँ।',
          badge: 'खुली सहभागिता',
          icon: HeartHandshake,
          iconBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
          btnText: 'स्वयंसेवक बनें',
          onClick: onOpenVolunteerModal
        },
        {
          id: 'certificate',
          title: 'डिजिटल सेवा सम्मान प्रमाण-पत्र',
          desc: 'दानदाताओं एवं समर्पित सेवादारों हेतु आधिकारिक डिजिटल सेवा सम्मान प्रमाण-पत्र QR सत्यापन सहित उपलब्ध।',
          badge: 'QR सत्यापित',
          icon: Award,
          iconBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
          btnText: 'प्रमाण-पत्र प्राप्त करें',
          onClick: onOpenCertificateModal
        },
        {
          id: 'help',
          title: 'श्रद्धालु सहायता व मार्गदर्शन केंद्र',
          desc: 'माँ नर्मदा परिक्रमावासियों, संतों व आगंतुकों हेतु 24x7 निःशुल्क मार्ग-दर्शन, विश्राम सहायता व अधिकृत हेल्पलाइन।',
          badge: '24x7 उपलब्ध',
          icon: HelpCircle,
          iconBg: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
          btnText: 'हेल्पलाइन से जुड़ें',
          onClick: onNavigateToContact
        },
        {
          id: 'receipt',
          title: 'दान पावती खोज एवं सत्यापन',
          desc: 'अपने 10 अंकों के पंजीकृत मोबाइल नंबर एवं रसीद ID / UPI UTR से अपनी आधिकारिक दान पावती तुरंत खोजें।',
          badge: 'तुरंत खोज',
          icon: Search,
          iconBg: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
          btnText: 'रसीद खोजें व डाउनलोड करें',
          onClick: onOpenReceiptSearch
        },
        {
          id: 'complaint',
          title: 'सुझाव, सहायता एवं शिकायत निवारण',
          desc: 'ट्रस्ट की व्यवस्थाओं, गौसेवा व अन्नक्षेत्र सुधार हेतु अपने बहुमूल्य सुझाव अथवा शिकायत सीधे न्यासी मंडल को भेजें।',
          badge: 'सीधा निवारण',
          icon: MessageSquareWarning,
          iconBg: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
          btnText: 'सुझाव / शिकायत दर्ज करें',
          onClick: onOpenComplaintModal
        },
        {
          id: 'transparency',
          title: 'वित्तीय पारदर्शिता एवं खुली बहीखाता नीति',
          desc: 'दानदाताओं द्वारा समर्पित एक-एक पाई का हिसाब सार्वजनिक निरीक्षणार्थ मासिक आय-व्यय तालिका में उपलब्ध।',
          badge: '100% सार्वजनिक लेखा',
          icon: FileSpreadsheet,
          iconBg: 'bg-teal-500/20 text-teal-300 border-teal-400/40',
          btnText: 'मासिक बहीखाता देखें',
          onClick: onNavigateToTransparency
        }
      ];

  const whatsappUrl = `https://api.whatsapp.com/send?phone=919575301233&text=${encodeURIComponent(
    isEn
      ? "Jai Shri Ram! I want guidance regarding volunteer seva, donation certificate, or visit to Prabhu Ramji Trust."
      : "जय श्री राम! मुझे प्रभु रामजी ट्रस्ट के स्वयंसेवक, सेवा प्रमाण-पत्र अथवा आश्रम दर्शन के संबंध में सहायता व जानकारी चाहिए।"
  )}`;

  return (
    <section className="py-8 bg-[#041610] border-b-2 border-emerald-900/60 relative overflow-hidden">
      {/* Background subtle aura */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Folder Box */}
        <div className="w-full bg-[#08241b] rounded-3xl p-5 sm:p-7 border-2 border-amber-400/70 shadow-2xl relative overflow-hidden">
          
          {/* Folder Top Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400/30 to-emerald-600/30 border border-amber-400/60 flex items-center justify-center shrink-0 shadow-inner">
                {isFolderOpen ? (
                  <FolderOpen className="w-7 h-7 sm:w-8 sm:h-8 text-amber-300" />
                ) : (
                  <Folder className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400" />
                )}
              </div>
              
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[11px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>{isEn ? "Devotee & Seva Services Hub" : "जनसेवा, स्वयंसेवक व सहायता केंद्र फोल्डर"}</span>
                  </span>
                  <span className="text-xs text-stone-300">
                    · {isEn ? "6 Core Services Available" : "6 मुख्य जनसेवाएँ उपलब्ध"}
                  </span>
                </div>
                
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-amber-100">
                  {isEn ? "Volunteer, Certificate & Devotee Assistance Center" : "स्वयंसेवक, सेवा प्रमाण-पत्र एवं श्रद्धालु सहायता केंद्र"}
                </h3>
                
                <p className="text-xs sm:text-sm text-stone-300 mt-0.5">
                  {isEn
                    ? "Direct access to volunteer registration, digital seva certificates, 24x7 devotee helpline, donation receipts, and public accountability."
                    : "प्रभु रामजी ट्रस्ट द्वारा संचालित समस्त जनसेवाएँ, स्वयंसेवक पंजीकरण, सेवा सम्मान प्रमाण-पत्र, 24x7 हेल्पलाइन एवं पारदर्शी सेवा सुविधाएँ।"}
                </p>
              </div>
            </div>

            {/* Folder Actions */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{isEn ? "WhatsApp Help" : "WhatsApp सहायता"}</span>
              </a>

              <button
                type="button"
                onClick={() => setIsFolderOpen(!isFolderOpen)}
                className="inline-flex items-center gap-1 px-3.5 py-2.5 rounded-xl bg-emerald-950/90 hover:bg-emerald-900 text-amber-200 border border-amber-400/50 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                <span>{isFolderOpen ? (isEn ? "Hide Services" : "सेवाएँ समेटें") : (isEn ? "Expand All 6 Services" : "सभी 6 सेवाएँ खोलें")}</span>
                {isFolderOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Item Pills Preview */}
          <div className="mt-4 pt-3 border-t border-emerald-800/60 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] text-amber-300/80 font-bold">
              {isEn ? "Quick Access:" : "त्वरित सेवा लिंक:"}
            </span>
            {services.map((srv) => (
              <button
                key={srv.id}
                onClick={srv.onClick}
                className="px-2.5 py-1 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-600/40 text-stone-200 hover:text-amber-300 text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1"
              >
                <span>{srv.title}</span>
              </button>
            ))}
          </div>

          {/* Expandable 6-Card Grid */}
          {isFolderOpen && (
            <div className="mt-5 pt-4 border-t-2 border-amber-400/40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 animate-slide-up-fade">
              {services.map((srv) => {
                const IconComponent = srv.icon;
                return (
                  <div
                    key={srv.id}
                    className="bg-black/40 hover:bg-black/55 rounded-2xl p-4 sm:p-5 border border-amber-400/35 hover:border-amber-400 transition-all flex flex-col justify-between group shadow-sm"
                  >
                    <div>
                      {/* Top bar with icon & status */}
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${srv.iconBg} group-hover:scale-110 transition-transform`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300">
                          {srv.badge}
                        </span>
                      </div>

                      <h4 className="font-heading font-bold text-base sm:text-lg text-amber-100 group-hover:text-amber-300 transition-colors mb-1.5">
                        {srv.title}
                      </h4>

                      <p className="text-xs text-stone-300 leading-relaxed line-clamp-3">
                        {srv.desc}
                      </p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-emerald-800/40">
                      <button
                        type="button"
                        onClick={srv.onClick}
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow transition-transform hover:scale-102"
                      >
                        <span>{srv.btnText}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Helpline Strip at Folder Bottom */}
          <div className="mt-4 pt-3.5 border-t border-emerald-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {isEn
                  ? "All services are non-commercial, authentic, and operated under Prabhu Ramji Trust guidelines."
                  : "समस्त सेवाएँ निःशुल्क, निष्काम एवं प्रभु रामजी ट्रस्ट के नैतिक सिद्धांतों के अंतर्गत संचालित हैं।"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="tel:+919575301233"
                className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-semibold"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>+91 95753 01233</span>
              </a>
              <span className="text-stone-600">|</span>
              <a
                href={TRUST_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200 font-semibold"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{isEn ? "Galgaon Route" : "गलगाँव मार्ग दर्शन"}</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
