import React, { useState } from 'react';
import { TRUST_OBJECTIVES } from '../data/defaultData';
import { 
  Heart, 
  Home, 
  Waves, 
  UtensilsCrossed, 
  Flame, 
  Users, 
  GraduationCap, 
  Trees,
  Activity,
  Shirt,
  MapPin,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';

interface ObjectivesSectionProps {
  language?: Language;
}

export const ObjectivesSection: React.FC<ObjectivesSectionProps> = () => {
  const t = TRANSLATIONS['hi'];
  const [filter, setFilter] = useState<'all' | 'active' | 'proposed'>('all');

  const icons = [
    Home,            // 01 गौशाला निर्माण
    Heart,           // 02 गौवंश संरक्षण
    Waves,           // 03 नर्मदा परिक्रमा व चाय सेवा
    Users,           // 04 गरीब सहायता
    GraduationCap,   // 05 बच्चों की शिक्षा
    Activity,        // 06 स्वास्थ्य शिविर
    Flame,           // 07 धार्मिक व सांस्कृतिक
    UtensilsCrossed, // 08 हनुमान मंदिर अन्नदान महादान
    Trees,           // 09 वृक्षारोपण व पर्यावरण
    Shirt            // 10 वस्त्र व भोजन सहायता
  ];

  const objectivesList = TRUST_OBJECTIVES;
  const activeCount = objectivesList.filter(o => o.type === 'active').length;
  const proposedCount = objectivesList.filter(o => o.type === 'proposed').length;

  const filteredObjectives = objectivesList.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  return (
    <section id="objectives" className="py-16 md:py-24 bg-[#FAF7F2] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/70 px-3.5 py-1 rounded-full border border-emerald-300">
            {t.objectivesTag}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0f4d3a] mt-3">
            {t.objectivesTitle}
          </h2>
          <div className="w-24 h-1.5 bg-amber-500 mx-auto mt-4 rounded-full"></div>
          
          <p className="text-stone-600 mt-4 text-base sm:text-lg">
            {t.objectivesSub}
          </p>

          <p className="text-xs sm:text-sm text-stone-500 mt-2 italic bg-white p-3 rounded-xl border border-stone-200 max-w-2xl mx-auto">
            <strong>सत्यनिष्ठ नीति:</strong> जो कार्य वर्तमान में संचालित हैं उन्हें <strong>“सक्रिय सेवा”</strong> तथा जो योजनाधीन हैं उन्हें <strong>“भविष्य के प्रस्तावित प्रकल्प”</strong> के रूप में दर्शाया गया है।
          </p>
        </div>

        {/* 3 Interactive Filter Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 bg-white rounded-2xl border border-stone-300 shadow-xs gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#0f4d3a] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              सभी ({objectivesList.length})
            </button>

            <button
              onClick={() => setFilter('active')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filter === 'active'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-emerald-900 hover:bg-emerald-50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>सक्रिय सेवा ({activeCount})</span>
            </button>

            <button
              onClick={() => setFilter('proposed')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filter === 'proposed'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-amber-900 hover:bg-amber-50'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>प्रस्तावित ({proposedCount})</span>
            </button>
          </div>
        </div>

        {/* 10 Objectives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredObjectives.map((item) => {
            const index = parseInt(item.number, 10) - 1;
            const IconComponent = icons[index] || Heart;
            const isProposed = item.type === 'proposed';

            return (
              <div 
                key={item.number}
                className={`bg-white rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all border flex flex-col justify-between group ${
                  isProposed 
                    ? 'border-amber-300 bg-gradient-to-b from-white to-amber-50/30' 
                    : 'border-stone-200 hover:border-emerald-500'
                }`}
              >
                <div>
                  {/* Top Bar: Number & Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-heading text-3xl font-bold font-mono text-stone-300 group-hover:text-amber-600 transition-colors">
                      {item.number}
                    </span>

                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                      isProposed
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    }`}>
                      {isProposed ? (
                        <Clock className="w-3 h-3 text-amber-700" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      )}
                      <span>{item.statusLabel}</span>
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="w-12 h-12 rounded-2xl bg-[#0f4d3a]/10 border border-[#0f4d3a]/20 flex items-center justify-center text-[#0f4d3a] mb-4 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6 text-[#0f4d3a]" />
                  </div>

                  <h3 className="font-heading text-xl font-bold text-stone-900 mb-2 leading-snug group-hover:text-[#0f4d3a] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
                    {item.desc}
                  </p>

                </div>

                {/* Footer Badge & Location */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {item.badge}
                  </span>
                  
                  <span className="text-stone-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span>{item.location}</span>
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
