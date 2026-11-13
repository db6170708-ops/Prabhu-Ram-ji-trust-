import React, { useState, useEffect } from 'react';
import { TRUST_INFO, ASHRAM_NIRMAN_INFO } from '../data/defaultData';
import { HINDI_TEXT } from '../utils/translations';
import { TimeThemeCard } from './TimeThemeCard';
import { 
  HeartHandshake, 
  ChevronRight, 
  ChevronLeft,
  Sparkles, 
  Building, 
  Coffee, 
  UtensilsCrossed, 
  Heart,
  MessageCircle, 
  FileText,
  Folder, 
  FolderOpen, 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';

export const ASHRAM_ACTIVE_WORKS = [
  {
    id: 1,
    title: 'प्रभु रामजी आश्रम एवं परिक्रमा विश्राम भवन निर्माण',
    desc: 'माँ नर्मदा परिक्रमा मार्ग पर संतों व पदयात्रियों हेतु नींव, पिलर व पक्का निर्माण कार्य तीव्र गति से प्रगति पर',
    badge: 'सक्रिय प्रगति पर',
    icon: '🏛️',
    actionType: 'ashram'
  },
  {
    id: 2,
    title: 'प्रतिदिन नित्य निःशुल्क चाय व शीतल जल सेवा',
    desc: 'हनुमान मंदिर व आश्रम परिसर में प्रतिदिन प्रातः 6 बजे से नित्य ताज़ी चाय, जल व विश्राम सेवा संचालित',
    badge: 'प्रतिदिन नित्य संचालित',
    icon: '🍵',
    actionType: 'donate'
  },
  {
    id: 3,
    title: 'प्रत्येक शनिवार शाम भव्य महाभंडारा व महाप्रसाद',
    desc: 'परिक्रमावासी संतों, साधुओं एवं सैकड़ों ग्रामीण श्रद्धालुओं हेतु प्रति शनिवार शाम भव्य भंडारा पंगत',
    badge: 'प्रत्येक शनिवार शाम',
    icon: '🍲',
    actionType: 'donate'
  },
  {
    id: 4,
    title: 'निराश्रित एवं अशक्त गौवंश संरक्षण व चारा सेवा',
    desc: 'बेसहारा गोमाता हेतु नित्य हरा चारा, दलिया, गुड़, शुद्ध जल एवं प्राथमिक पशु चिकित्सा सेवा संचालित',
    badge: 'दैनिक निरंतर सेवा',
    icon: '🐄',
    actionType: 'donate'
  },
  {
    id: 5,
    title: 'आश्रम परिसर में पावन नींव, पिलर एवं दीवार निर्माण',
    desc: '1 बोरी सीमेंट, 100 ईंटें, 1 क्विंटल सरिया एवं पिलर सहयोग से दिव्य आश्रम भवन का निर्माण जारी',
    badge: 'निर्माण महायज्ञ',
    icon: '🧱',
    actionType: 'ashram'
  },
  {
    id: 6,
    title: 'श्रीराम-हनुमान मंदिर एवं दिव्य सत्संग मंडप निर्माण',
    desc: 'माँ नर्मदा के पावन प्रवाह के समीप ग्रामीण जनसमूह एवं संतों हेतु आध्यात्मिक केंद्र निर्माण संकल्प',
    badge: 'योजनाधीन संकल्प',
    icon: '🛕',
    actionType: 'ashram'
  },
  {
    id: 7,
    title: 'ग्रामीण निर्धन बालकों हेतु शिक्षा सामग्री व संस्कार',
    desc: 'ग्रामीण बालिकाओं व बालकों को स्कूल बैग, पाठ्य सामग्री वितरण एवं नैतिक संस्कार संवर्धन',
    badge: 'सक्रिय मानवीय सेवा',
    icon: '📚',
    actionType: 'donate'
  }
];

interface HeroProps {
  onDonateClick: () => void;
  onAshramClick: () => void;
  onExploreClick: () => void;
  onOpenReceiptSearch: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onDonateClick, 
  onAshramClick,
  onOpenReceiptSearch 
}) => {
  const t = HINDI_TEXT;
  const activeWorks = ASHRAM_ACTIVE_WORKS;

  const [currentWorkIndex, setCurrentWorkIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHomeFolderExpanded, setIsHomeFolderExpanded] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentWorkIndex((prev) => (prev + 1) % activeWorks.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused, activeWorks.length]);

  const activeWork = activeWorks[currentWorkIndex];

  return (
    <section className="relative time-hero text-white overflow-hidden py-12 md:py-20 border-b-4 border-amber-500 w-full max-w-full">
      
      {/* Background illumination */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full max-w-full overflow-hidden">
        
        {/* Top Brand Lockup with Logo - Perfectly Centered */}
        <div className="flex flex-col items-center justify-center text-center space-y-3 mb-8 sm:mb-10 w-full max-w-full">
          {/* Circular Glowing Logo in Center (Bigger & High-Definition) */}
          <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full overflow-hidden border-3 border-amber-400 shadow-2xl animate-sacred-glow bg-[#08241b] shrink-0 ring-4 ring-amber-400/30 transition-transform hover:scale-105">
            <img
              src={TRUST_INFO.logoUrl}
              alt={t.trustName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Centered Salutation Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.heroSalutation}</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>

          {/* Centered Trust Name */}
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-amber-50 leading-tight">
            <span>{t.trustName}</span>
            <span className="block text-xs sm:text-sm md:text-base font-sans font-semibold tracking-wider text-amber-300/90 mt-1 uppercase">
              प्रभु रामजी ट्रस्ट • आधिकारिक सेवा मंच • ग्राम गलगाँव
            </span>
          </h1>

          {/* Centered Subtitle / Location */}
          <p className="text-base sm:text-xl md:text-2xl font-medium text-amber-300 font-heading">
            {t.heroSubtitle}
          </p>

          {/* Animated Ashram Works Showcase */}
          <div 
            className="w-full max-w-4xl mx-auto pt-4 min-w-0 overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Interactive Animated Rotating Feature Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/80 via-[#0a3a2c]/90 to-amber-950/80 border-2 border-amber-400/60 p-3 sm:p-4 shadow-2xl backdrop-blur-md">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                
                {/* Left: Badge + Rotating Work with Animation */}
                <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-[11px] font-bold tracking-wide shadow-xs shrink-0 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>{t.heroActiveWorkBadge}</span>
                  </div>

                  {/* Animated Text Content */}
                  <div key={activeWork.id} className="animate-slide-up-fade flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="text-xl sm:text-2xl">{activeWork.icon}</span>
                      <h3 className="font-heading text-sm sm:text-base font-bold text-amber-200 truncate">
                        {activeWork.title}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                        {activeWork.badge}
                      </span>
                    </div>
                    <p className="text-xs text-stone-300 line-clamp-1 mt-0.5">
                      {activeWork.desc}
                    </p>
                  </div>
                </div>

                {/* Right: Contribution Button & Carousel Controls */}
                <div className="flex items-center justify-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      if (activeWork.actionType === 'ashram') onAshramClick();
                      else onDonateClick();
                    }}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold text-[#08241b] bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 rounded-lg shadow-sm transition-transform hover:scale-105 cursor-pointer"
                  >
                    <span>{t.heroSupportNow}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setCurrentWorkIndex((prev) => (prev - 1 + activeWorks.length) % activeWorks.length)}
                      className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-amber-200 transition-colors cursor-pointer"
                      title={t.heroPrevWork}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentWorkIndex((prev) => (prev + 1) % activeWorks.length)}
                      className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-amber-200 transition-colors cursor-pointer"
                      title={t.heroNextWork}
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Progress Indicator Dots */}
              <div className="flex items-center justify-center gap-1.5 mt-2.5 pt-2 border-t border-amber-500/20">
                {activeWorks.map((work, idx) => (
                  <button
                    key={work.id}
                    onClick={() => setCurrentWorkIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === currentWorkIndex 
                        ? 'w-6 bg-amber-400' 
                        : 'w-1.5 bg-amber-400/30 hover:bg-amber-400/60'
                    }`}
                    title={work.title}
                  />
                ))}
              </div>
            </div>

            {/* Continuous Smooth Streaming Marquee Ribbon */}
            <div className="mt-2.5 overflow-hidden rounded-xl bg-black/50 border border-amber-500/40 py-1.5 px-3 backdrop-blur-xs text-xs text-amber-200/90 relative shadow-inner w-full max-w-full">
              <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
                {activeWorks.concat(activeWorks).map((w, index) => (
                  <div key={index} className="inline-flex items-center gap-2">
                    <span>{w.icon}</span>
                    <strong className="text-amber-300 font-semibold">{w.title}</strong>
                    <span className="text-[11px] text-amber-100/70 font-mono">({w.badge})</span>
                    <span className="text-amber-500/60 font-bold">•</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Live Time-Based Automatic Greeting & Theme Switcher Card */}
        <TimeThemeCard />

        {/* FEATURED: Home Page Dedicated Ashram Construction Folder Widget */}
        <div className="w-full max-w-5xl mx-auto mb-10 bg-[#072b20]/95 backdrop-blur-md rounded-3xl p-5 sm:p-7 border-2 border-amber-400/70 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
              <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400/25 to-amber-600/35 border border-amber-400/60 flex items-center justify-center shrink-0 shadow-inner">
                {isHomeFolderExpanded ? (
                  <FolderOpen className="w-7 h-7 sm:w-8 sm:h-8 text-amber-300" />
                ) : (
                  <Folder className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400" />
                )}
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-400/20 border border-amber-400/40 text-amber-300">
                    📂 {t.homeFolderBadge}
                  </span>
                  <span className="text-xs text-stone-300">· {t.homeFolderAvailable}</span>
                </div>
                <h2 className="font-heading text-lg sm:text-2xl font-bold text-amber-100">
                  {t.homeFolderTitle}
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 mt-0.5">
                  {t.homeFolderDesc}
                </p>
              </div>
            </div>

            {/* Folder Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={onAshramClick}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer hover:scale-105"
              >
                <span>{t.homeFolderOpenBtn}</span>
                <ChevronRight className="w-4 h-4 text-stone-950" />
              </button>

              <button
                type="button"
                onClick={() => setIsHomeFolderExpanded(!isHomeFolderExpanded)}
                className="inline-flex items-center gap-1 px-3.5 py-2.5 rounded-xl bg-emerald-950/90 hover:bg-emerald-900 text-amber-200 border border-amber-400/50 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                <span>{isHomeFolderExpanded ? t.homeFolderCollapseBtn : t.homeFolderExpandBtn}</span>
                {isHomeFolderExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Item Pills Preview */}
          <div className="mt-4 pt-3 border-t border-emerald-800/60 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] text-amber-300/80 font-bold">
              फोल्डर सामग्री:
            </span>
            {ASHRAM_NIRMAN_INFO.packages.map((pkg, i) => (
              <button
                key={i}
                onClick={onAshramClick}
                className="px-2.5 py-1 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-600/40 text-stone-200 hover:text-amber-300 font-mono text-[11px] transition-all cursor-pointer"
              >
                {pkg.name} {pkg.amount > 0 ? `(₹${pkg.amount})` : ''}
              </button>
            ))}
          </div>

          {/* Expandable 6-item Grid on Home Page */}
          {isHomeFolderExpanded && (
            <div className="mt-5 pt-4 border-t-2 border-amber-400/40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-slide-up-fade">
              {ASHRAM_NIRMAN_INFO.packages.map((pkg, idx) => (
                <div
                  key={idx}
                  className="bg-black/45 rounded-2xl p-4 border border-amber-400/40 hover:border-amber-400 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">
                        {idx === 0 ? '🧱' : idx === 1 ? '🧱' : idx === 2 ? '⛓️' : idx === 3 ? '🏛️' : idx === 4 ? '🏠' : '❤️'}
                      </span>
                      <span className="text-sm font-bold font-mono text-amber-300 bg-amber-400/15 px-2 py-0.5 rounded-md border border-amber-400/30">
                        {pkg.amount > 0 ? `₹${pkg.amount.toLocaleString('en-IN')}` : 'श्रद्धानुसार'}
                      </span>
                    </div>
                    <h4 className="font-heading font-bold text-sm text-amber-100">
                      {pkg.name}
                    </h4>
                    <p className="text-xs text-stone-300 mt-1 line-clamp-2">
                      {pkg.desc}
                    </p>
                  </div>

                  <button
                    onClick={onAshramClick}
                    className="mt-3 w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-transform hover:scale-102"
                  >
                    <span>{t.ashramSponsorBtn}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2-Column Hero Grid: Left Content & Right Kodanda Ram Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Trust Identity, Routines & Actions */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">

            {/* Sacred Tagline & Routine Highlight */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm space-y-3">
              <p className="text-lg sm:text-xl font-heading text-amber-200 italic">
                “{t.motto}”
              </p>
              
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {t.heroDesc}
              </p>

              {/* Daily & Weekly Seva Routine Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
                <div className="flex items-center gap-2 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/40">
                  <Coffee className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{t.heroRoutineTea}</span>
                </div>

                <div className="flex items-center gap-2 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/40">
                  <UtensilsCrossed className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{t.heroRoutineBhandara}</span>
                </div>

                <div className="flex items-center gap-2 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/40">
                  <Building className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{t.heroRoutineAshram}</span>
                </div>

                <div className="flex items-center gap-2 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/40">
                  <Heart className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{t.heroRoutineGau}</span>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onAshramClick}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-[#08241b] bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer border border-amber-200 animate-pulse-gold"
              >
                <Building className="w-4 h-4 text-[#08241b]" />
                <span>{t.heroBtnAshram}</span>
              </button>

              <button
                onClick={onDonateClick}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-bold text-white bg-[#0f4d3a] hover:bg-[#145d47] rounded-xl border border-amber-500/50 transition-all cursor-pointer shadow"
              >
                <HeartHandshake className="w-4 h-4 text-amber-300" />
                <span>{t.heroBtnDonate}</span>
              </button>

              <a
                href={TRUST_INFO.whatsappContactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3.5 text-xs font-semibold text-emerald-200 bg-emerald-950/60 hover:bg-emerald-900 rounded-xl border border-emerald-500/30 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>{t.heroBtnWhatsApp}</span>
              </a>

              <button
                onClick={onOpenReceiptSearch}
                className="inline-flex items-center gap-2 px-4 py-3.5 text-xs font-semibold text-amber-200 bg-amber-950/50 hover:bg-amber-900/70 rounded-xl border border-amber-400/40 transition-all cursor-pointer shadow-xs"
                title={t.searchReceiptBtn}
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>{t.searchReceiptBtn}</span>
              </button>
            </div>

          </div>

          {/* Right Column: Divine Frame of Bhagwan Shri Ram */}
          <div className="lg:col-span-6 flex justify-center items-center">
            <div className="relative w-full max-w-lg sm:max-w-xl lg:max-w-2xl">
              
              {/* Outer Golden Aura Glow */}
              <div className="absolute -inset-1.5 sm:-inset-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 rounded-3xl blur-md opacity-75"></div>
              
              {/* Sacred Frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-3 border-amber-400/90 bg-stone-950 group">
                <img
                  src="/shri_ram_kodanda.jpg"
                  alt={t.kodandaTitle}
                  className="w-full h-auto object-cover max-h-[580px] sm:max-h-[640px] group-hover:scale-102 transition-transform duration-700 block"
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/public/shri_ram_kodanda.jpg';
                  }}
                />

                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-4 sm:p-6 text-center">
                  <div className="text-amber-300 font-heading text-lg sm:text-2xl font-bold flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>{t.kodandaTitle}</span>
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                  <p className="text-xs sm:text-sm text-stone-200 mt-1 font-medium">
                    {t.kodandaDesc}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
