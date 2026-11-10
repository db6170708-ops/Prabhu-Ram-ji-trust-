import React, { useState } from 'react';
import { Heart, Waves, UtensilsCrossed, Users, CheckCircle2, ArrowRight, Coffee, Building, Sparkles, ChevronRight } from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';
import { DEFAULT_SEVA_PROJECTS } from '../data/defaultData';
import { SevaProject } from '../types';

interface KeyServicesProps {
  language?: Language;
  onDonateForCause: (cause: string) => void;
  onSelectProject?: (project: SevaProject) => void;
}

export const KeyServices: React.FC<KeyServicesProps> = ({ 
  language = 'hi', 
  onDonateForCause,
  onSelectProject
}) => {
  const isEn = language === 'en';
  const t = TRANSLATIONS[language];
  return (
    <section id="services" className="py-16 md:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {t.servicesTag}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0f4d3a] mt-3">
            {t.servicesTitle}
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
          <p className="text-stone-600 mt-4 text-base sm:text-lg">
            {t.servicesDesc}
          </p>
        </div>

        <div className="space-y-16">
          
          {/* Service 1: Har Shaniwar Sham Ko Bhandara (User Real Photo) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF7F2] p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm">
            <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-md border border-stone-300 relative group">
              <img
                src="/assets/aistudio/IMG-20261030-WA0000_4e2396e1_4e2396e1_4e2396e1.jpg"
                alt="शनिवार शाम का महाभंडारा पंगत - प्रभु रामजी ट्रस्ट"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 bg-[#0f4d3a]/90 text-amber-300 text-xs font-bold px-3 py-1 rounded-full shadow">
                प्रत्यक्ष भंडारा पंगत छायाचित्र
              </div>
            </div>
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                <UtensilsCrossed className="w-3.5 h-3.5 text-amber-700" />
                <span>साप्ताहिक महायज्ञ · हर शनिवार शाम</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#0f4d3a]">
                हर शनिवार शाम को महाभंडारा व प्रसादी
              </h3>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                प्रभु रामजी ट्रस्ट द्वारा प्रत्येक शनिवार की शाम को विशाल महाभंडारे का आयोजन किया जाता है। इसमें सैकड़ों साधु-संत, माँ नर्मदा के परिक्रमावासी एवं ग्रामीणजन पंगत में बैठकर सप्रेम सात्विक प्रसादी ग्रहण करते हैं।
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>शुद्ध घी-तेल से निर्मित दाल-बाटी, रोटी, सब्जी, खिचड़ी व हलवा प्रसादी।</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>भक्तगण अपने जन्मदिन, वैवाहिक वर्षगांठ या पूर्वजों की स्मृति में भंडारे का प्रायोजन कर सकते हैं।</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => onDonateForCause('शनिवार शाम भंडारा महाप्रसाद')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#0f4d3a] hover:bg-[#125a44] rounded-xl transition-all shadow cursor-pointer"
                >
                  <span>शनिवार भंडारे का प्रायोजन करें</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Service 2: Pratidin Chai Seva (Daily Tea Seva) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF7F2] p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm">
            <div className="lg:col-span-6 order-2 lg:order-1 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                <Coffee className="w-3.5 h-3.5 text-amber-700" />
                <span>नित्य सेवा · प्रातः 6 बजे से</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#0f4d3a]">
                प्रतिदिन नित्य निःशुल्क चाय व जल सेवा
              </h3>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                माँ नर्मदा की कठिन पद परिक्रमा करने वाले संतों, तपस्वियों व पथिकों के लिए ग्राम गलगाँव ट्रस्ट परिसर में प्रतिदिन प्रातःकाल से ही ताजी गर्म चाय, बिस्कुट एवं शीतल जल की अखंड सेवा संचालित रहती है।
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>परिक्रमा पदयात्रियों को थकान मिटाने हेतु नित्य शुद्ध दूध की चाय।</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>दिनभर आने-जाने वाले सभी साधु-संतों व भक्तों का सत्कार।</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => onDonateForCause('प्रतिदिन चाय सेवा')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#0f4d3a] hover:bg-[#125a44] rounded-xl transition-all shadow cursor-pointer"
                >
                  <span>चाय सेवा हेतु दूध व सामग्री सहयोग</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>
            <div className="lg:col-span-6 order-1 lg:order-2 rounded-2xl overflow-hidden shadow-md border border-stone-300 relative group">
              <img
                src="/assets/aistudio/1793586446047_5029f454.jpg"
                alt="प्रतिदिन चाय व जल सेवा - प्रभु रामजी ट्रस्ट"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 bg-[#0f4d3a]/90 text-amber-300 text-xs font-bold px-3 py-1 rounded-full shadow">
                परिक्रमा पथिक सेवा छायाचित्र
              </div>
            </div>
          </div>

          {/* Service 3: Real Gaushala Gau Seva */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF7F2] p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm">
            <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-md border border-stone-300 relative group">
              <img
                src="/assets/aistudio/img_real_gaushala_31c848c1.jpg"
                alt="ग्राम गलगाँव गौशाला में संरक्षित गोवंश"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 bg-[#0f4d3a]/90 text-amber-300 text-xs font-bold px-3 py-1 rounded-full shadow">
                गलगाँव गौशाला प्रत्यक्ष दर्शन
              </div>
            </div>
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                <Heart className="w-3.5 h-3.5 text-amber-700" />
                <span>गोमाता संवर्धन एवं चिकित्सा</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#0f4d3a]">
                निराश्रित गोवंश सेवा एवं गौशाला संचालन
              </h3>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                ग्राम गलगाँव में बेसहारा, वृद्ध एवं बीमार गायों को संरक्षण दिया जा रहा है। प्रतिदिन ताजा हरा चारा, सूखा चारा, दाना और स्वच्छ जल उपलब्ध कराया जाता है।
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>दैनिक हरा चारा, कुट्टी एवं पौष्टिक दलिया व्यवस्था।</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>गौशाला में पक्का फर्श, छायादार टीन शेड एवं पानी की हौदी।</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => onDonateForCause('गौसेवा एवं चारा व्यवस्था')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#0f4d3a] hover:bg-[#125a44] rounded-xl transition-all shadow cursor-pointer"
                >
                  <span>गौसेवा हेतु चारा दान करें</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* All 10 Seva Projects Showcase */}
        <div className="mt-20 pt-12 border-t border-stone-200">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              संपूर्ण सेवा दर्शन
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#0f4d3a] mt-2">
              प्रभु रामजी ट्रस्ट के सभी 10 सेवा प्रकल्प
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              प्रत्येक प्रकल्प पर क्लिक करके विस्तृत विवरण देखें एवं सीधे पुण्य सहयोग समर्पित करें।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEFAULT_SEVA_PROJECTS.map((proj) => (
              <div
                key={proj.id}
                className="bg-[#FAF7F2] hover:bg-white p-5 rounded-2xl border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      प्रकल्प #{proj.order || proj.number}
                    </span>
                    {(proj.impactStat || proj.keyStats) && (
                      <span className="text-[11px] font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {proj.impactStat || proj.keyStats}
                      </span>
                    )}
                  </div>
                  <h4 className="font-heading font-bold text-base text-[#0f4d3a] group-hover:text-amber-800 transition-colors">
                    {proj.title}
                  </h4>
                  <p className="text-xs text-stone-500 font-medium mt-0.5">{proj.subtitle}</p>
                  <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                    {proj.fullDescription || proj.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-stone-200/60 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectProject && onSelectProject(proj)}
                    className="text-xs font-bold text-[#0f4d3a] hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>विस्तार से जानें</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDonateForCause(proj.title)}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-[#0f4d3a] hover:bg-[#125843] rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    सहयोग दें
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
