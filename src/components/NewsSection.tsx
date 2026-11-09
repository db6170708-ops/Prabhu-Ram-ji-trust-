import React from 'react';
import { NewsItem } from '../types';
import { Bell, Calendar, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';

interface NewsSectionProps {
  language?: Language;
  news: NewsItem[];
  onDonateClick: () => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ language = 'hi', news, onDonateClick }) => {
  const isEn = language === 'en';
  const t = TRANSLATIONS[language];
  return (
    <section id="news" className="py-16 md:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {t.newsTag}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0f4d3a] mt-3">
            {t.newsTitle}
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
          <p className="text-stone-600 mt-4 text-base sm:text-lg">
            {isEn
              ? 'Authorized announcements regarding weekly Saturday community bhandara, gaushala activities, and upcoming spiritual programs.'
              : 'प्रत्येक शनिवार भंडारे का समय, गौसेवा अभियान एवं आगामी धार्मिक आयोजनों की अधिकृत जानकारी।'}
          </p>
        </div>

        {/* News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item) => (
            <div
              key={item.id}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all border ${
                item.isImportant
                  ? 'bg-amber-50/70 border-amber-300 shadow-md ring-1 ring-amber-300'
                  : 'bg-[#FAF7F2] border-stone-200 shadow-xs hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-white border border-stone-200 text-stone-700">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    {item.date}
                  </span>

                  {item.isImportant && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500 text-stone-950">
                      <AlertCircle className="w-3 h-3" />
                      विशेष सूचना
                    </span>
                  )}
                </div>

                <h3 className="font-heading text-xl font-bold text-stone-900 mb-3 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {item.content}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200/80 flex items-center justify-between text-xs">
                <span className="text-stone-400 font-medium">स्थान: ग्राम गलगाँव</span>
                {item.category === 'bhandara' && (
                  <button
                    onClick={onDonateClick}
                    className="font-bold text-[#0f4d3a] hover:text-emerald-800 flex items-center gap-1"
                  >
                    <span>सहयोग दें</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
