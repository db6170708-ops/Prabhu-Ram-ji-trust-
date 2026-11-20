import React from 'react';
import { TRUST_INFO } from '../data/defaultData';
import { Language, TRANSLATIONS } from '../utils/translations';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  UtensilsCrossed, 
  Coffee,
  Globe,
  Youtube,
  MessageCircle,
  Facebook,
  Instagram,
  ExternalLink,
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

const XLogoIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const ThreadsLogoIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32l-1.757-1.182c.98-1.454 2.513-2.259 4.448-2.259h.048c3.194.02 5.094 1.988 5.382 5.437.338.15.654.324.946.523 1.283.868 2.138 2.085 2.473 3.52.548 2.345-.19 4.92-1.98 6.672C18.001 23.164 15.69 23.978 12.186 24Zm.143-8.198c-.974.054-1.69.314-2.126.774-.415.438-.582.976-.553 1.505.055.995.924 1.737 2.266 1.664 1.448-.079 2.435-.906 2.743-2.463a11.093 11.093 0 0 0-2.33.52Z" />
  </svg>
);

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

  const socialChannels = [
    {
      name: 'YouTube',
      handle: '@ramjitrust',
      href: TRUST_INFO.youtube,
      title: 'YouTube Channel',
      icon: <Youtube className="w-4 h-4" />,
      badgeClass: 'bg-red-600/20 text-red-400 border-red-500/30 group-hover:bg-red-600 group-hover:text-white',
    },
    {
      name: 'WhatsApp',
      handle: 'आधिकारिक चैनल',
      href: TRUST_INFO.whatsappChannel,
      title: 'WhatsApp चैनल',
      icon: <MessageCircle className="w-4 h-4" />,
      badgeClass: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30 group-hover:bg-emerald-600 group-hover:text-white',
    },
    {
      name: 'Facebook',
      handle: 'Prabhu Ramji Trust',
      href: TRUST_INFO.facebook,
      title: 'Facebook Page',
      icon: <Facebook className="w-4 h-4" />,
      badgeClass: 'bg-blue-600/20 text-blue-400 border-blue-500/30 group-hover:bg-blue-600 group-hover:text-white',
    },
    {
      name: 'Instagram',
      handle: '@prabhushriramtrust',
      href: TRUST_INFO.instagram,
      title: 'Instagram Page',
      icon: <Instagram className="w-4 h-4" />,
      badgeClass: 'bg-pink-600/20 text-pink-400 border-pink-500/30 group-hover:bg-pink-600 group-hover:text-white',
    },
    {
      name: 'X (Twitter)',
      handle: '@PrabhuRamjj4',
      href: TRUST_INFO.x,
      title: 'X (Twitter) Profile',
      icon: <XLogoIcon className="w-3.5 h-3.5" />,
      badgeClass: 'bg-stone-700/50 text-stone-100 border-stone-500/40 group-hover:bg-black group-hover:text-white',
    },
    {
      name: 'Threads',
      handle: '@prabhushriramtrust',
      href: TRUST_INFO.threads,
      title: 'Threads Profile',
      icon: <ThreadsLogoIcon className="w-4 h-4" />,
      badgeClass: 'bg-zinc-700/50 text-zinc-100 border-zinc-500/40 group-hover:bg-zinc-950 group-hover:text-white',
    },
  ];

  return (
    <footer className="bg-[#08241b] text-stone-300 pt-14 sm:pt-16 pb-8 border-t-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-emerald-900/60">
          
          {/* Col 1: Official Logo, Trust Identity & Motto */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-amber-400 shadow-lg bg-[#08241b] shrink-0 ring-2 ring-amber-400/30">
                <img
                  src={TRUST_INFO.logoUrl}
                  alt={t.trustName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-heading text-xl font-bold text-amber-100 leading-snug">
                  {t.trustName}
                </h3>
                <p className="text-xs text-amber-300/80 mt-0.5">
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
          </div>

          {/* Col 2: Fast Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold tracking-wider text-amber-400">
              {t.footerQuickLinks}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button onClick={() => onNavigate('hero')} className="hover:text-amber-200 transition-colors cursor-pointer text-left">
                  {t.navHome}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-amber-200 transition-colors cursor-pointer text-left">
                  {t.navAbout}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('objectives')} className="hover:text-amber-200 transition-colors cursor-pointer text-left">
                  {t.navObjectives}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ashram-nirman')} className="hover:text-amber-200 transition-colors cursor-pointer text-amber-300 font-bold text-left">
                  {t.navAshramNirman}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-amber-200 transition-colors cursor-pointer text-left">
                  {t.navServices}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('officials')} className="hover:text-amber-200 transition-colors cursor-pointer text-left">
                  {t.navOfficials}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('transparency')} className="hover:text-amber-200 transition-colors cursor-pointer text-left">
                  {t.navTransparency}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-amber-200 transition-colors cursor-pointer text-left">
                  {t.navContact}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Services & Support */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold tracking-wider text-amber-400">
              {t.footerServices}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button onClick={() => onNavigate('ashram-nirman')} className="hover:text-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer text-left">
                  <Building className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>आश्रम व मंदिर निर्माण</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer text-left">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>हर शनिवार शाम भंडारा</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer text-left">
                  <Coffee className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>प्रतिदिन निःशुल्क चाय सेवा</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('donate')} className="text-amber-300 font-bold hover:underline cursor-pointer text-left">
                  • PhonePe QR / बैंक विवरण
                </button>
              </li>
              <li>
                <button onClick={onOpenReceiptSearch} className="text-emerald-300 font-semibold hover:underline cursor-pointer text-left">
                  • डिजिटल दान रसीद खोजें
                </button>
              </li>
              {onOpenVolunteerModal && (
                <li>
                  <button onClick={onOpenVolunteerModal} className="text-amber-200 hover:underline cursor-pointer text-left">
                    • {t.navVolunteer}
                  </button>
                </li>
              )}
              {onOpenCertificateModal && (
                <li>
                  <button onClick={onOpenCertificateModal} className="text-amber-200 hover:underline cursor-pointer text-left">
                    • {t.navCertificate}
                  </button>
                </li>
              )}
              {onOpenConstructionProgress && (
                <li>
                  <button onClick={onOpenConstructionProgress} className="text-amber-300 hover:underline cursor-pointer text-left">
                    • {t.navConstructionProgress}
                  </button>
                </li>
              )}
              {onOpenComplaintModal && (
                <li>
                  <button onClick={onOpenComplaintModal} className="text-stone-300 hover:underline cursor-pointer text-left">
                    • {t.navComplaint}
                  </button>
                </li>
              )}
              {onOpenLanguageModal && (
                <li>
                  <button onClick={onOpenLanguageModal} className="text-amber-400 font-semibold hover:underline cursor-pointer flex items-center gap-1 text-left">
                    <Globe className="w-3.5 h-3.5 shrink-0" />
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
            <h4 className="text-sm font-bold tracking-wider text-amber-400">
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
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={TRUST_INFO.whatsappContactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-200 transition-colors"
                >
                  {t.contactChatBtn}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${TRUST_INFO.email}`} className="hover:text-amber-200 font-mono text-xs break-all">
                  {TRUST_INFO.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5 pt-0.5">
                <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="https://prabhuramjitrustram.ai.studio/" className="text-amber-300 font-mono text-xs hover:underline break-all">
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

        {/* Dedicated Official Social Media Section */}
        <section aria-label="आधिकारिक सोशल मीडिया चैनल" className="py-7 sm:py-8 border-b border-emerald-900/60">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
            <div className="space-y-1">
              <h4 className="font-heading text-sm sm:text-base font-bold text-amber-300">
                आधिकारिक सोशल मीडिया चैनल (Official Social Media)
              </h4>
              <p className="text-xs sm:text-sm text-stone-400">
                गौसेवा, शनिवार महाभंडारा, नर्मदा परिक्रमा सेवा व आश्रम निर्माण के नित्य अपडेट के लिए जुड़ें।
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {socialChannels.map((channel) => (
              <a
                key={channel.name}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                title={channel.title}
                aria-label={`${channel.name} - ${channel.handle}`}
                className="group flex items-center gap-3 min-h-[52px] px-3 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-800/60 hover:border-amber-400/50 transition-colors focus-visible:outline-2 focus-visible:outline-amber-400 min-w-0"
              >
                <span
                  className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 transition-colors ${channel.badgeClass}`}
                >
                  {channel.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-stone-100 group-hover:text-amber-200 truncate">
                    <span className="truncate">{channel.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-70 shrink-0 transition-opacity" aria-hidden="true" />
                  </span>
                  <span className="block text-[11px] text-stone-400 truncate">
                    {channel.handle}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Bottom Legal Copyright */}
        <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="text-center sm:text-left">
            <p>© {new Date().getFullYear()} {t.trustName}. {t.footerRights}.</p>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {t.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs">
            <button onClick={onOpenPrivacy} className="hover:text-amber-200 transition-colors cursor-pointer">
              गोपनीयता नीति
            </button>
            <span aria-hidden="true">•</span>
            <button onClick={onOpenTerms} className="hover:text-amber-200 transition-colors cursor-pointer">
              नियम व शर्तें
            </button>
            <span aria-hidden="true">•</span>
            <button onClick={onOpenReceiptSearch} className="hover:text-amber-200 transition-colors cursor-pointer">
              {t.searchReceiptBtn}
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
