import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AshramNirmanSection } from './components/AshramNirmanSection';
import { AboutSection } from './components/AboutSection';
import { ObjectivesSection } from './components/ObjectivesSection';
import { KeyServices } from './components/KeyServices';
import { OfficialsSection } from './components/OfficialsSection';
import { DonationSystem } from './components/DonationSystem';
import { TransparencySection } from './components/TransparencySection';
import { GallerySection } from './components/GallerySection';
import { NewsSection } from './components/NewsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ReceiptSearchModal } from './components/ReceiptSearchModal';
import { AdminPanel } from './components/AdminPanel';
import { LegalModal } from './components/LegalModals';
import { StorageService } from './utils/storage';
import { TRUST_INFO } from './data/defaultData';
import { Language } from './utils/translations';
import { NewsItem, GalleryPhoto, GalleryVideo, TransparencyRecord, Official, DonationReceipt } from './types';
import { MessageCircle, Heart, Phone, ArrowUp } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('prt_language') as Language) || 'hi';
  });

  const [news, setNews] = useState<NewsItem[]>([]);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [transparency, setTransparency] = useState<TransparencyRecord[]>([]);
  const [officials, setOfficials] = useState<Official[]>([]);

  // Modals & Panels
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isReceiptSearchOpen, setIsReceiptSearchOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);
  const [donationCausePreselect, setDonationCausePreselect] = useState<string>('आश्रम एवं मंदिर निर्माण सहयोग');
  const [donationAmountPreselect, setDonationAmountPreselect] = useState<number>(1100);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Toggle Language
  const toggleLanguage = () => {
    const nextLang: Language = language === 'hi' ? 'en' : 'hi';
    setLanguage(nextLang);
    localStorage.setItem('prt_language', nextLang);
  };

  // Load latest state from StorageService
  const refreshData = () => {
    setNews(StorageService.getNews());
    setPhotos(StorageService.getPhotos());
    setVideos(StorageService.getVideos());
    setTransparency(StorageService.getTransparency());
    setOfficials(StorageService.getOfficials());
  };

  useEffect(() => {
    refreshData();

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      const sections = ['home', 'ashram-nirman', 'about', 'objectives', 'services', 'officials', 'donate', 'transparency', 'gallery', 'news', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDonateForCause = (cause: string, amount?: number) => {
    setDonationCausePreselect(cause);
    if (amount && amount > 0) {
      setDonationAmountPreselect(amount);
    }
    scrollToSection('donate');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-stone-800 font-sans">
      
      {/* Official Header with Language Switcher */}
      <Header
        language={language}
        onToggleLanguage={toggleLanguage}
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenReceiptSearch={() => setIsReceiptSearchOpen(true)}
      />

      <main className="flex-1">
        
        {/* Section 1: Hero */}
        <div id="home">
          <Hero
            language={language}
            onDonateClick={() => scrollToSection('donate')}
            onAshramClick={() => scrollToSection('ashram-nirman')}
            onExploreClick={() => scrollToSection('services')}
            onOpenReceiptSearch={() => setIsReceiptSearchOpen(true)}
          />
        </div>

        {/* Section 2: Dedicated Ashram & Mandir Nirman Campaign Folder */}
        <AshramNirmanSection onDonateForAshram={handleDonateForCause} />

        {/* Section 3: About Prabhu Ramji Trust */}
        <AboutSection />

        {/* Section 4: The 8 Objectives */}
        <ObjectivesSection />

        {/* Section 5: Key Seva Services (Daily Tea Seva, Saturday Evening Bhandara, Gaushala) */}
        <KeyServices onDonateForCause={(cause) => handleDonateForCause(cause)} />

        {/* Section 6: Trust Officials */}
        <OfficialsSection officials={officials} />

        {/* Section 7: Online Donation & Digital Receipt Generator */}
        <DonationSystem
          initialCause={donationCausePreselect}
          initialAmount={donationAmountPreselect}
          onReceiptGenerated={(receipt: DonationReceipt) => {
            refreshData();
          }}
        />

        {/* Section 8: Financial Transparency & Open Ledger */}
        <TransparencySection records={transparency} />

        {/* Section 9: Photo & Video Gallery */}
        <GallerySection photos={photos} videos={videos} />

        {/* Section 10: News, Updates & Saturday Bhandara */}
        <NewsSection
          news={news}
          onDonateClick={() => handleDonateForCause('शनिवार शाम भंडारा महाप्रसाद')}
        />

        {/* Section 11: Contact & Directions */}
        <ContactSection />

      </main>

      {/* Official Footer */}
      <Footer
        onNavigate={scrollToSection}
        onOpenPrivacy={() => setLegalModalType('privacy')}
        onOpenTerms={() => setLegalModalType('terms')}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenReceiptSearch={() => setIsReceiptSearchOpen(true)}
      />

      {/* Floating Quick Action Widget for Mobile/Desktop */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 no-print">
        
        {/* Scroll To Top Button */}
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3 bg-white hover:bg-stone-100 text-stone-700 rounded-full shadow-lg border border-stone-200 transition-all hover:scale-105 cursor-pointer"
            title="ऊपर जाएं (Top)"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5 text-[#0f4d3a]" />
          </button>
        )}

        {/* Floating Quick WhatsApp Chat */}
        <a
          href={TRUST_INFO.whatsappContactUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-2xl transition-all transform hover:scale-105 group font-medium text-xs sm:text-sm animate-pulse"
          title="व्हाट्सएप पर संपर्क जोड़ें / चैट करें"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="hidden sm:inline font-bold">
            {language === 'hi' ? 'WhatsApp संपर्क' : 'WhatsApp Contact'}
          </span>
        </a>

      </div>

      {/* Modals */}
      <ReceiptSearchModal
        isOpen={isReceiptSearchOpen}
        onClose={() => setIsReceiptSearchOpen(false)}
      />

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onDataUpdated={refreshData}
      />

      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

    </div>
  );
}
