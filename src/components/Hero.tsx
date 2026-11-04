import React, { useState, useEffect } from 'react';
import { TRUST_INFO } from '../data/defaultData';
import { TRANSLATIONS, Language } from '../utils/translations';
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
  FileText
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
  language?: Language;
  onDonateClick: () => void;
  onAshramClick: () => void;
  onExploreClick: () => void;
  onOpenReceiptSearch: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  language = 'hi',
  onDonateClick, 
  onAshramClick,
  onExploreClick,
  onOpenReceiptSearch 
}) => {
  const t = TRANSLATIONS[language];
  const [currentWorkIndex, setCurrentWorkIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentWorkIndex((prev) => (prev + 1) % ASHRAM_ACTIVE_WORKS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const activeWork = ASHRAM_ACTIVE_WORKS[currentWorkIndex];

  return (
    <section className="relative bg-gradient-to-b from-[#08241b] via-[#0e4333] to-[#0a3125] text-white overflow-hidden py-12 md:py-20 border-b-4 border-amber-500 w-full max-w-full">
      
      {/* Background illumination */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full max-w-full overflow-hidden">
        
        {/* Top Brand Lockup with Logo - Perfectly Centered */}
        <div className="flex flex-col items-center justify-center text-center space-y-3 mb-8 sm:mb-10 w-full max-w-full">
          {/* Circular Glowing Logo in Center */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-amber-400 shadow-2xl animate-sacred-glow bg-[#08241b] shrink-0">
            <img
              src={TRUST_INFO.logoUrl}
              alt="प्रभु रामजी ट्रस्ट लोगो"
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
            {t.trustName}
          </h1>

          {/* Centered Subtitle / Location */}
          <p className="text-base sm:text-xl md:text-2xl font-medium text-amber-300 font-heading">
            {t.heroSubtitle}
          </p>

          {/* Animated Ashram Works Showcase - Below Logo, Title & Location */}
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
                    <span>आश्रम में सक्रिय कार्य</span>
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
                    <span>सहयोग करें</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setCurrentWorkIndex((prev) => (prev - 1 + ASHRAM_ACTIVE_WORKS.length) % ASHRAM_ACTIVE_WORKS.length)}
                      className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-amber-200 transition-colors cursor-pointer"
                      title="पिछला कार्य"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentWorkIndex((prev) => (prev + 1) % ASHRAM_ACTIVE_WORKS.length)}
                      className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-amber-200 transition-colors cursor-pointer"
                      title="अगला कार्य"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Progress Indicator Dots */}
              <div className="flex items-center justify-center gap-1.5 mt-2.5 pt-2 border-t border-amber-500/20">
                {ASHRAM_ACTIVE_WORKS.map((work, idx) => (
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
                {ASHRAM_ACTIVE_WORKS.concat(ASHRAM_ACTIVE_WORKS).map((w, index) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Trust Identity, Routines & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

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
            </div>

          </div>

          {/* Right Column: Divine Frame of Bhagwan Shri Ram */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 rounded-3xl blur-xs opacity-70"></div>
              
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-300 bg-stone-900 group">
                <img
                  src="/src/assets/images/shri_ram_narmada_1793758371472.jpg"
                  alt="माँ नर्मदा पावन तट पर प्रभु श्री रामजी का दिव्य विग्रह - प्रभु रामजी ट्रस्ट ग्राम गलगाँव"
                  className="w-full h-auto object-cover max-h-[500px] group-hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />

                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-4 sm:p-5 text-center">
                  <div className="text-amber-300 font-heading text-lg sm:text-xl font-bold flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>॥ माँ नर्मदा पावन तट पर प्रभु श्री राम ॥</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-xs text-stone-200 mt-1">
                    ग्राम गलगाँव (सनावद) · माँ नर्मदा के पावन प्रवाह व प्रभु रामजी के आदर्शों पर निष्काम जनसेवा
                  </p>
                </div>
              </div>

              {/* Receipt Quick Search Button */}
              <button
                onClick={onOpenReceiptSearch}
                className="mt-3 w-full py-2.5 px-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 rounded-xl text-center text-xs font-semibold text-amber-200 hover:text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.heroSearchReceiptNote}</span>
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
