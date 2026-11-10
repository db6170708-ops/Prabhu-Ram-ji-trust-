import React, { useState } from 'react';
import { TRUST_INFO } from '../data/defaultData';
import { TRANSLATIONS, Language } from '../utils/translations';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  HeartHandshake, 
  MapPin, 
  Phone, 
  Menu, 
  X, 
  Lock, 
  MessageCircle, 
  Sparkles,
  Search,
  Building,
  Coffee,
  Languages,
  Youtube,
  Instagram,
  Facebook,
  Globe,
  Users,
  Award,
  MessageSquare,
  Building2,
  Download
} from 'lucide-react';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onOpenAdmin: () => void;
  onOpenReceiptSearch: () => void;
  onOpenLanguageModal?: () => void;
  onOpenVolunteerModal?: () => void;
  onOpenCertificateModal?: () => void;
  onOpenComplaintModal?: () => void;
  onOpenConstructionProgress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  language,
  onToggleLanguage,
  onNavigate, 
  activeSection, 
  onOpenAdmin,
  onOpenReceiptSearch,
  onOpenLanguageModal,
  onOpenVolunteerModal,
  onOpenCertificateModal,
  onOpenComplaintModal,
  onOpenConstructionProgress
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[language];

  const navItems = [
    { id: 'home', label: t.navHome },
    { id: 'ashram-nirman', label: t.navAshram, highlight: true },
    { id: 'about', label: t.navAbout },
    { id: 'objectives', label: t.navObjectives },
    { id: 'services', label: t.navServices },
    { id: 'officials', label: t.navOfficials },
    { id: 'gallery', label: t.navGallery },
    { id: 'transparency', label: t.navTransparency },
    { id: 'news', label: t.navNews },
    { id: 'contact', label: t.navContact }
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200 w-full max-w-full overflow-hidden">
      
      {/* Top Sacred Ribbon: Location, Routines & Official Social Channels */}
      <div className="bg-[#0b382c] text-amber-200 text-xs py-2 px-3 sm:px-8 border-b border-emerald-950/40 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
          
          {/* Left: Location & Routine */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 text-center md:text-left">
            <span className="inline-flex items-center gap-1 font-medium text-amber-100">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{TRUST_INFO.village}, {TRUST_INFO.tehsil}, {TRUST_INFO.district}</span>
            </span>
            <span className="hidden sm:inline text-emerald-600/70">|</span>
            <a 
              href="https://prabhuramjitrustram.ai.studio/" 
              className="hidden md:inline-flex items-center gap-1 font-mono text-[11px] text-amber-300 hover:text-white transition-colors"
              title="प्रभु रामजी ट्रस्ट आधिकारिक वेबसाइट"
            >
              <span>prabhuramjitrustram.ai.studio</span>
            </a>
            <span className="hidden md:inline text-emerald-600/70">|</span>
            <span className="hidden lg:inline-flex items-center gap-1.5 text-amber-300 font-semibold">
              <Coffee className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{t.dailyTeaNotice}</span>
            </span>
          </div>

          {/* Right: Official Social Media Channels (YouTube, WhatsApp Channel, Instagram, Facebook), Language & Phone */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            
            {/* Social Channels Pill Box (YouTube, WhatsApp Channel, Instagram, Facebook) */}
            <div className="flex items-center gap-1 bg-black/35 px-2.5 py-1 rounded-full border border-amber-400/30">
              
              {/* YouTube */}
              <a
                href={TRUST_INFO.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white transition-all text-[11px] font-semibold"
                title="प्रभु रामजी ट्रस्ट - आधिकारिक YouTube चैनल"
              >
                <Youtube className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">YouTube</span>
              </a>

              {/* WhatsApp Channel */}
              <a
                href={TRUST_INFO.whatsappChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600/25 hover:bg-emerald-600 text-emerald-300 hover:text-white transition-all text-[11px] font-semibold"
                title="प्रभु रामजी ट्रस्ट - आधिकारिक WhatsApp चैनल"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">WhatsApp चैनल</span>
              </a>

              {/* Instagram */}
              <a
                href={TRUST_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-600/20 hover:bg-pink-600 text-pink-300 hover:text-white transition-all text-[11px] font-semibold"
                title="प्रभु रामजी ट्रस्ट - आधिकारिक Instagram"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <span className="hidden sm:inline">Instagram</span>
              </a>

              {/* Facebook */}
              <a
                href={TRUST_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white transition-all text-[11px] font-semibold"
                title="प्रभु रामजी ट्रस्ट - आधिकारिक Facebook पेज"
              >
                <Facebook className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Facebook</span>
              </a>

            </div>

            {/* 17 Languages Modal Trigger */}
            {onOpenLanguageModal && (
              <button
                onClick={onOpenLanguageModal}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/25 hover:bg-amber-400/40 text-amber-200 border border-amber-400/50 text-[11px] font-bold transition-all cursor-pointer"
                title="17 भाषाएं चुनें / 17 Indian & World Languages"
              >
                <Globe className="w-3 h-3 text-amber-300" />
                <span>17 भाषाएं (Languages)</span>
              </button>
            )}

            {/* Quick 2-Language Switcher Pill */}
            <button
              onClick={onToggleLanguage}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-[11px] font-bold transition-all cursor-pointer"
              title="भाषा बदलें / Switch Language"
            >
              <Languages className="w-3 h-3 text-amber-400" />
              <span>{language === 'hi' ? 'English' : 'हिंदी'}</span>
            </button>

            {/* Phone */}
            <a 
              href={`tel:${TRUST_INFO.phone.replace(/[^0-9+]/g, '')}`} 
              className="hidden xl:inline-flex items-center gap-1 text-amber-200 hover:text-white transition-colors text-[11px] font-medium"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>{TRUST_INFO.phone}</span>
            </a>

          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-20 sm:h-24 gap-2 sm:gap-4 w-full">
          
          {/* Official Brand Logo */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-4 text-left group cursor-pointer focus:outline-none min-w-0 flex-1 sm:flex-initial"
          >
            <div className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full overflow-hidden border-2.5 border-amber-500 shadow-lg animate-sacred-glow transition-transform group-hover:scale-105 shrink-0 bg-[#08241b] ring-2 ring-amber-300/40">
              <img
                src={TRUST_INFO.logoUrl}
                alt="प्रभु रामजी ट्रस्ट लोगो"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-[#0f4d3a] truncate">
                  {t.trustName}
                </span>
                <span className="hidden lg:inline text-[11px] font-bold px-2 py-0.5 rounded-full text-amber-900 bg-gradient-to-r from-amber-200 to-amber-300 border border-amber-400 shadow-xs">
                  {t.officialBadge}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs md:text-sm text-stone-600 font-medium truncate">
                {t.tagline}
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-3 text-sm font-medium text-stone-700">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`whitespace-nowrap transition-all py-1 cursor-pointer border-b-2 text-xs font-semibold ${
                  item.highlight
                    ? activeSection === item.id
                      ? 'border-amber-500 text-amber-700 font-bold bg-amber-50 px-2 rounded-t'
                      : 'border-transparent text-amber-700 hover:text-amber-800 font-bold bg-amber-50/70 hover:bg-amber-100 px-2 rounded-t'
                    : activeSection === item.id 
                      ? 'border-[#0f4d3a] text-[#0f4d3a] font-bold' 
                      : 'border-transparent hover:text-[#0f4d3a] hover:border-amber-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            
            {/* PWA Install Button */}
            <PWAInstallButton className="hidden lg:inline-flex" />

            {/* Volunteer Button */}
            {onOpenVolunteerModal && (
              <button
                onClick={onOpenVolunteerModal}
                className="hidden xl:inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-300 cursor-pointer"
                title="स्वयंसेवक बनें / Join as Volunteer"
              >
                <Users className="w-3.5 h-3.5 text-emerald-700" />
                <span>स्वयंसेवक</span>
              </button>
            )}

            {/* Language switch button */}
            <button
              onClick={onToggleLanguage}
              className="px-2.5 py-1.5 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors border border-stone-300 flex items-center gap-1 cursor-pointer"
              title="भाषा बदलें (Hindi / English)"
            >
              <Languages className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'hi' ? 'EN' : 'हिंदी'}</span>
            </button>

            <button
              onClick={onOpenReceiptSearch}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors border border-stone-300 cursor-pointer"
              title="दान रसीद खोजें व डाउनलोड करें"
            >
              <Search className="w-3.5 h-3.5 text-stone-600" />
              <span>{t.searchReceiptBtn}</span>
            </button>

            <button
              onClick={() => handleNavClick('donate')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#0f4d3a] via-[#125843] to-[#0f4d3a] hover:from-[#145d47] hover:to-[#0f4d3a] rounded-lg shadow-md hover:shadow-lg transition-all border border-amber-400/40 text-amber-200 animate-pulse-gold cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-amber-300" />
              <span>{t.donateBtn}</span>
            </button>

            <button
              onClick={onOpenAdmin}
              className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              title={t.adminLogin}
              aria-label="Admin Login"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu & Language Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 xl:hidden shrink-0">
            <button
              onClick={onToggleLanguage}
              className="px-2 py-1 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-300 shrink-0"
              title="भाषा बदलें (Hindi / English)"
            >
              {language === 'hi' ? 'EN' : 'हिं'}
            </button>

            <button
              onClick={() => handleNavClick('donate')}
              className="inline-flex sm:hidden items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-[#0f4d3a] rounded-lg shadow-sm shrink-0"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-amber-300" />
              <span>दान</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-stone-700 hover:bg-stone-100 rounded-lg transition-colors shrink-0"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  item.highlight
                    ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                    : activeSection === item.id
                      ? 'bg-emerald-50 text-[#0f4d3a] font-bold border border-emerald-200'
                      : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="space-y-2 pt-2 border-t border-stone-100">
            {/* PWA Mobile App Install Banner */}
            <div className="p-2.5 bg-gradient-to-r from-emerald-50 to-amber-50 rounded-xl border border-emerald-200/80 flex items-center justify-between gap-2">
              <div className="text-left">
                <span className="font-bold text-xs text-[#0f4d3a] block">📲 मोबाइल ऐप डाउनलोड करें</span>
                <span className="text-[10px] text-stone-500">HD लोगो व ऑफलाइन सपोर्ट के साथ</span>
              </div>
              <PWAInstallButton />
            </div>

            {/* 17 Languages Modal Button */}
            {onOpenLanguageModal && (
              <button
                onClick={() => {
                  onOpenLanguageModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-bold text-amber-950 bg-amber-100/70 hover:bg-amber-100 rounded-lg border border-amber-300"
              >
                <Globe className="w-4 h-4 text-amber-700" />
                <span>🌐 17 भाषाएं चुनें (Select from 17 Languages)</span>
              </button>
            )}

            {/* Volunteer Registration */}
            {onOpenVolunteerModal && (
              <button
                onClick={() => {
                  onOpenVolunteerModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200"
              >
                <Users className="w-4 h-4 text-emerald-700" />
                <span>🤝 स्वयंसेवक सेवा पंजीकरण (Volunteer)</span>
              </button>
            )}

            {/* Digital Certificate */}
            {onOpenCertificateModal && (
              <button
                onClick={() => {
                  onOpenCertificateModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-300"
              >
                <Award className="w-4 h-4 text-amber-600" />
                <span>🏆 सेवा सम्मान प्रमाण-पत्र (Certificate)</span>
              </button>
            )}

            {/* Feedback & Grievance */}
            {onOpenComplaintModal && (
              <button
                onClick={() => {
                  onOpenComplaintModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-300"
              >
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>💬 सुझाव, शिकायत व सहायता केंद्र</span>
              </button>
            )}

            {/* Construction Progress Report */}
            {onOpenConstructionProgress && (
              <button
                onClick={() => {
                  onOpenConstructionProgress();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200"
              >
                <Building2 className="w-4 h-4 text-amber-700" />
                <span>🏗️ निर्माण प्रगति व बजट रिपोर्ट</span>
              </button>
            )}

            <button
              onClick={() => {
                onOpenReceiptSearch();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-300 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{t.searchReceiptBtn}</span>
            </button>

            {/* Official Social Channels in Mobile Menu */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold text-stone-500 mb-2 text-center">
                आधिकारिक सोशल चैनल से जुड़ें:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={TRUST_INFO.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200"
                >
                  <Youtube className="w-4 h-4 text-red-600" />
                  <span>YouTube</span>
                </a>

                <a
                  href={TRUST_INFO.whatsappChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp चैनल</span>
                </a>

                <a
                  href={TRUST_INFO.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-pink-700 bg-pink-50 hover:bg-pink-100 rounded-lg border border-pink-200"
                >
                  <Instagram className="w-4 h-4 text-pink-600" />
                  <span>Instagram</span>
                </a>

                <a
                  href={TRUST_INFO.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200"
                >
                  <Facebook className="w-4 h-4 text-blue-600" />
                  <span>Facebook</span>
                </a>
              </div>
            </div>

            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-medium text-stone-500 hover:text-stone-800"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t.adminLogin}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
