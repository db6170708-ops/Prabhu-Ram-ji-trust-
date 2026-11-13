import React from 'react';
import { TRUST_INFO } from '../data/defaultData';
import { Language, TRANSLATIONS } from '../utils/translations';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Heart, 
  Building, 
  UtensilsCrossed, 
  Coffee,
  Globe,
  Youtube,
  MessageCircle,
} from 'lucide-react';

interface FooterProps {
  language?: Language;
  onNavigate: (sectionId: string) => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenAdmin: () => void;
  onOpenReceiptSearch: () => void;
  onOpenVolunteerModal?: () => void;
  onOpenCertificateModal?: () => void;
  onOpenComplaintModal?: () => void;
  onOpenConstructionProgress?: () => void;
  onOpenLanguageModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenPrivacy,
  onOpenTerms,
  onOpenAdmin,
  onOpenReceiptSearch,
  onOpenVolunteerModal,
  onOpenCertificateModal,
  onOpenComplaintModal,
  onOpenConstructionProgress,
  onOpenLanguageModal,
}) => {
  const t = TRANSLATIONS['hi'];

  return (
    <footer className="bg-[#08241b] text-stone-300 pt-16 pb-8 border-t-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-emerald-900/60">
          
          {/* Col 1: Official Logo, Trust Identity & Motto */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2.5 border-amber-400 shadow-lg bg-[#08241b] shrink-0 ring-2 ring-amber-400/30">
                <img
                  src={TRUST_INFO.logoUrl}
                  alt={t.trustName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-amber-100">
                  {t.trustName}
                </h3>
                <p className="text-xs text-amber-300/80">
                  {t.tagline}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              सेवा, संस्कार और समाज कल्याण को समर्पित न्यास। प्रतिदिन प्रातः 6 बजे से नित्य निःशुल्क चाय सेवा, हर शनिवार शाम भव्य महाभंडारा, निराश्रित गौसेवा एवं प्रभु रामजी आश्रम व मंदिर निर्माण।
            </p>

            <div className="text-xs font-heading text-amber-300 italic pt-1">
              “{t.motto}”
            </div>

            {/* Social Channels */}
            <div className="pt-2 flex items-center gap-2.5">
              <a
                href={TRUST_INFO.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 flex items-center justify-center transition-colors"
                title="YouTube Channel"
              >
                <Youtube className="w-4 h-4" />
              </a>

              <a
                href={TRUST_INFO.whatsappContactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 flex items-center justify-center transition-colors"
                title={t.contactChatBtn}
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href={TRUST_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 flex items-center justify-center transition-colors"
                title="Facebook Page"
              >
                <span className="font-bold text-sm">f</span>
              </a>

              <a
                href={TRUST_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-pink-600/20 hover:bg-pink-600 text-pink-400 hover:text-white border border-pink-500/30 flex items-center justify-center transition-colors"
                title="Instagram Page"
              >
                <span className="font-bold text-xs">IG</span>
              </a>
            </div>
          </div>

          {/* Col 2: Fast Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              {t.footerQuickLinks}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button onClick={() => onNavigate('hero')} className="hover:text-amber-200 transition-colors cursor-pointer">
                  {t.navHome}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-amber-200 transition-colors cursor-pointer">
                  {t.navAbout}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('objectives')} className="hover:text-amber-200 transition-colors cursor-pointer">
                  {t.navObjectives}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ashram-nirman')} className="hover:text-amber-200 transition-colors cursor-pointer text-amber-300 font-bold">
                  {t.navAshramNirman}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-amber-200 transition-colors cursor-pointer">
                  {t.navServices}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('officials')} className="hover:text-amber-200 transition-colors cursor-pointer">
                  {t.navOfficials}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('transparency')} className="hover:text-amber-200 transition-colors cursor-pointer">
                  {t.navTransparency}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-amber-200 transition-colors cursor-pointer">
                  {t.navContact}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Services & Support */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              {t.footerServices}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button onClick={() => onNavigate('ashram-nirman')} className="hover:text-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Building className="w-3.5 h-3.5 text-amber-400" />
                  <span>आश्रम व मंदिर निर्माण</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
                  <span>हर शनिवार शाम भंडारा</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Coffee className="w-3.5 h-3.5 text-amber-400" />
                  <span>प्रतिदिन निःशुल्क चाय सेवा</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('donate')} className="text-amber-300 font-bold hover:underline cursor-pointer">
                  • PhonePe QR / बैंक विवरण
                </button>
              </li>
              <li>
                <button onClick={onOpenReceiptSearch} className="text-emerald-300 font-semibold hover:underline cursor-pointer">
                  • डिजिटल दान रसीद खोजें
                </button>
              </li>
              {onOpenVolunteerModal && (
                <li>
                  <button onClick={onOpenVolunteerModal} className="text-amber-200 hover:underline cursor-pointer">
                    • {t.navVolunteer}
                  </button>
                </li>
              )}
              {onOpenCertificateModal && (
                <li>
                  <button onClick={onOpenCertificateModal} className="text-amber-200 hover:underline cursor-pointer">
                    • {t.navCertificate}
                  </button>
                </li>
              )}
              {onOpenConstructionProgress && (
                <li>
                  <button onClick={onOpenConstructionProgress} className="text-amber-300 hover:underline cursor-pointer">
                    • {t.navConstructionProgress}
                  </button>
                </li>
              )}
              {onOpenComplaintModal && (
                <li>
                  <button onClick={onOpenComplaintModal} className="text-stone-300 hover:underline cursor-pointer">
                    • {t.navComplaint}
                  </button>
                </li>
              )}
              {onOpenLanguageModal && (
                <li>
                  <button onClick={onOpenLanguageModal} className="text-amber-400 font-semibold hover:underline cursor-pointer flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" />
                    <span>{t.languageSelectBtn}</span>
                  </button>
                </li>
              )}
            </ul>

            <div className="pt-2">
              <span className="text-[11px] text-stone-400 block">
                अधिकृत UPI ID: <strong className="font-mono text-amber-200">{TRUST_INFO.upiId}</strong>
              </span>
            </div>
          </div>

          {/* Col 4: Trust Office & Contact */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              {t.footerContact}
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  {TRUST_INFO.fullAddress}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${TRUST_INFO.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-amber-200 font-mono">
                  {TRUST_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${TRUST_INFO.email}`} className="hover:text-amber-200 font-mono text-xs">
                  {TRUST_INFO.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5 pt-1">
                <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="https://prabhuramjitrustram.ai.studio/" className="text-amber-300 font-mono text-xs hover:underline">
                  prabhuramjitrustram.ai.studio
                </a>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/90 border border-emerald-700/60 text-stone-300 hover:text-white text-xs transition-colors cursor-pointer"
              >
                <span>{t.adminLogin}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Legal Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="text-center sm:text-left">
            <p>© {new Date().getFullYear()} {t.trustName}. {t.footerRights}.</p>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {t.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button onClick={onOpenPrivacy} className="hover:text-amber-200 transition-colors cursor-pointer">
              गोपनीयता नीति
            </button>
            <span>•</span>
            <button onClick={onOpenTerms} className="hover:text-amber-200 transition-colors cursor-pointer">
              नियम व शर्तें
            </button>
            <span>•</span>
            <button onClick={onOpenReceiptSearch} className="hover:text-amber-200 transition-colors cursor-pointer">
              {t.searchReceiptBtn}
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
