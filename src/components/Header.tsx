import React, { useState } from 'react';
import { TRUST_INFO } from '../data/defaultData';
import { PWAInstallButton } from './PWAInstallButton';
import { GoogleTranslateWidget } from './GoogleTranslateWidget';
import { 
  HeartHandshake, 
  MapPin, 
  Phone, 
  Menu, 
  X, 
  Lock, 
  MessageCircle, 
  Search, 
  Coffee, 
  Youtube, 
  Instagram, 
  Facebook, 
  Users, 
  Award, 
  MessageSquare, 
  Building2 
} from 'lucide-react';

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onOpenAdmin: () => void;
  onOpenReceiptSearch: () => void;
  onOpenVolunteerModal?: () => void;
  onOpenCertificateModal?: () => void;
  onOpenComplaintModal?: () => void;
  onOpenConstructionProgress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onNavigate, 
  activeSection, 
  onOpenAdmin,
  onOpenReceiptSearch,
  onOpenVolunteerModal,
  onOpenCertificateModal,
  onOpenComplaintModal,
  onOpenConstructionProgress
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'मुख्य पृष्ठ' },
    { id: 'ashram-nirman', label: 'आश्रम निर्माण', highlight: true },
    { id: 'about', label: 'हमारा परिचय' },
    { id: 'objectives', label: 'ट्रस्ट के उद्देश्य' },
    { id: 'services', label: 'सेवा प्रकल्प' },
    { id: 'officials', label: 'न्यासी मंडल' },
    { id: 'gallery', label: 'सेवा दर्शन' },
    { id: 'transparency', label: 'वित्तीय शुचिता' },
    { id: 'news', label: 'समाचार व सूचनाएं' },
    { id: 'contact', label: 'संपर्क व मार्ग दर्शन' }
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 time-header backdrop-blur-md shadow-xs border-b w-full max-w-full notranslate-header">
      
      {/* Top Sacred Ribbon: Location, Routine, Social Links & Google Translate */}
      <div className="bg-[#0b382c] text-amber-200 text-xs py-2 px-3 sm:px-8 border-b border-emerald-950/40 w-full">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
          
          {/* Left: Location & Routine Notice */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 text-center md:text-left">
            <span className="inline-flex items-center gap-1 font-medium text-amber-100">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{TRUST_INFO.village}, {TRUST_INFO.tehsil}, {TRUST_INFO.district} (म.प्र.)</span>
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
              <span>प्रातः 6 बजे से नित्य निःशुल्क चाय सेवा</span>
            </span>
          </div>

          {/* Right: Official Social Media Channels & Google Translate Widget */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            
            {/* Social Channels Pill Box */}
            <div className="flex items-center gap-1 bg-black/35 px-2.5 py-1 rounded-full border border-amber-400/30">
              {/* YouTube */}
              <a
                href={TRUST_INFO.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white transition-all text-[11px] font-semibold"
                title="YouTube"
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
                title="WhatsApp चैनल"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>

              {/* Instagram */}
              <a
                href={TRUST_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-600/20 hover:bg-pink-600 text-pink-300 hover:text-white transition-all text-[11px] font-semibold"
                title="Instagram"
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
                title="Facebook"
              >
                <Facebook className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Facebook</span>
              </a>
            </div>

            {/* Custom Google Translate Dropdown in Header Top Bar */}
            <div className="shrink-0">
              <GoogleTranslateWidget variant="header" />
            </div>

            {/* Helpline Phone */}
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
                alt="प्रभु रामजी ट्रस्ट"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-lg sm:text-2xl md:text-3xl font-bold tracking-tight time-heading truncate">
                  प्रभु रामजी ट्रस्ट
                </span>
                <span className="hidden lg:inline text-[11px] font-bold px-2 py-0.5 rounded-full text-amber-900 bg-gradient-to-r from-amber-200 to-amber-300 border border-amber-400 shadow-xs">
                  आधिकारिक सेवा मंच
                </span>
              </div>
              <p className="text-[11px] sm:text-xs md:text-sm text-stone-600 dark:text-stone-300 font-medium truncate">
                सेवा ही संकल्प • सहयोग ही शक्ति
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-3 text-sm font-medium text-stone-700 dark:text-stone-200">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`whitespace-nowrap transition-all py-1 cursor-pointer border-b-2 text-xs font-semibold ${
                  item.highlight
                    ? activeSection === item.id
                      ? 'border-amber-500 text-amber-700 dark:text-amber-300 font-bold bg-amber-50 dark:bg-amber-500/20 px-2 rounded-t'
                      : 'border-transparent text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 font-bold bg-amber-50/70 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 px-2 rounded-t'
                    : activeSection === item.id 
                      ? 'border-[#0f4d3a] dark:border-amber-400 text-[#0f4d3a] dark:text-amber-300 font-bold' 
                      : 'border-transparent hover:text-[#0f4d3a] dark:hover:text-amber-300 hover:border-amber-400'
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
                className="hidden xl:inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/70 rounded-lg transition-colors border border-emerald-300 dark:border-emerald-700/60 cursor-pointer"
                title="स्वयंसेवक बनें"
              >
                <Users className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
                <span>स्वयंसेवक</span>
              </button>
            )}

            {/* Receipt Search Button */}
            <button
              onClick={onOpenReceiptSearch}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors border border-stone-300 dark:border-stone-700 cursor-pointer"
              title="रसीद खोजें"
            >
              <Search className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
              <span>रसीद खोजें</span>
            </button>

            {/* Donate CTA Button */}
            <button
              onClick={() => handleNavClick('donate')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#0f4d3a] via-[#125843] to-[#0f4d3a] hover:from-[#145d47] hover:to-[#0f4d3a] rounded-lg shadow-md hover:shadow-lg transition-all border border-amber-400/40 text-amber-200 animate-pulse-gold cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-amber-300" />
              <span>दान करें</span>
            </button>

            {/* Admin Login */}
            <button
              onClick={onOpenAdmin}
              className="p-2 text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
              title="व्यवस्थापक प्रवेश"
              aria-label="व्यवस्थापक प्रवेश"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Right Controls: Google Translate & Menu Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 xl:hidden shrink-0">
            <GoogleTranslateWidget variant="mobile" />

            <button
              onClick={() => handleNavClick('donate')}
              className="inline-flex sm:hidden items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-[#0f4d3a] rounded-lg shadow-xs shrink-0"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-amber-300" />
              <span>दान</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors shrink-0 cursor-pointer"
              aria-label="मेनू खोलें"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden time-card border-b px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          
          {/* Navigation Links Grid */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  item.highlight
                    ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-200 font-bold border border-amber-300 dark:border-amber-500/40'
                    : activeSection === item.id
                      ? 'bg-emerald-50 dark:bg-emerald-900/40 text-[#0f4d3a] dark:text-emerald-200 font-bold border border-emerald-200 dark:border-emerald-700'
                      : 'text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
            {/* PWA Mobile App Install Banner */}
            <div className="p-2.5 bg-gradient-to-r from-emerald-50 to-amber-50 dark:from-emerald-950/60 dark:to-amber-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between gap-2">
              <div className="text-left">
                <span className="font-bold text-xs time-heading block">प्रभु रामजी ट्रस्ट ऐप डाउनलोड करें</span>
                <span className="text-[10px] text-stone-500 dark:text-stone-300">बिना किसी रुकावट के सेवा, दान व रसीद की सुविधा मोबाइल पर</span>
              </div>
              <PWAInstallButton />
            </div>

            {/* Volunteer Registration */}
            {onOpenVolunteerModal && (
              <button
                onClick={() => {
                  onOpenVolunteerModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/70 rounded-lg border border-emerald-200 dark:border-emerald-800/60 cursor-pointer"
              >
                <Users className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />
                <span>स्वयंसेवक पंजीकरण</span>
              </button>
            )}

            {/* Digital Certificate */}
            {onOpenCertificateModal && (
              <button
                onClick={() => {
                  onOpenCertificateModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg border border-stone-300 dark:border-stone-700 cursor-pointer"
              >
                <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>सेवा सम्मान प्रमाण-पत्र</span>
              </button>
            )}

            {/* Feedback & Grievance */}
            {onOpenComplaintModal && (
              <button
                onClick={() => {
                  onOpenComplaintModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg border border-stone-300 dark:border-stone-700 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>सुझाव एवं सहायता</span>
              </button>
            )}

            {/* Construction Progress Report */}
            {onOpenConstructionProgress && (
              <button
                onClick={() => {
                  onOpenConstructionProgress();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 rounded-lg border border-amber-200 dark:border-amber-700/60 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>आश्रम निर्माण प्रगति रिपोर्ट</span>
              </button>
            )}

            {/* Search Receipt */}
            <button
              onClick={() => {
                onOpenReceiptSearch();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg border border-stone-300 dark:border-stone-700 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>रसीद खोजें व डाउनलोड करें</span>
            </button>

            {/* Official Social Channels in Mobile Menu */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-2 text-center">
                आधिकारिक सोशल मीडिया माध्यम
              </p>
              <div className="flex items-center justify-center gap-3">
                <a
                  href={TRUST_INFO.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/70"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href={TRUST_INFO.whatsappChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/70"
                  title="WhatsApp Channel"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href={TRUST_INFO.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 hover:bg-pink-200 dark:hover:bg-pink-900/70"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={TRUST_INFO.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/70"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </header>
  );
};
