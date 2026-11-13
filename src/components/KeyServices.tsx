import React from 'react';
import { Heart, UtensilsCrossed, CheckCircle2, ArrowRight, Coffee, ChevronRight } from 'lucide-react';
import { DEFAULT_SEVA_PROJECTS } from '../data/defaultData';
import { SevaProject } from '../types';

interface KeyServicesProps {
  onDonateForCause: (cause: string) => void;
  onSelectProject?: (project: SevaProject) => void;
}

export const KeyServices: React.FC<KeyServicesProps> = ({ 
  onDonateForCause,
  onSelectProject
}) => {
  return (
    <section id="services" className="py-16 md:py-24 time-bg-alt border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-700">
            समग्र सेवा पोर्टफोलियो
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold time-heading mt-3">
            ट्रस्ट के प्रमुख सेवा कार्य
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
          <p className="text-stone-600 dark:text-stone-300 mt-4 text-base sm:text-lg">
            माँ नर्मदा के पावन प्रवाह एवं मर्यादा पुरुषोत्तम श्रीराम के आदर्शों पर आधारित दैनिक एवं साप्ताहिक सेवा प्रकल्प।
          </p>
        </div>

        <div className="space-y-16">
          
          {/* Service 1: Har Shaniwar Sham Ko Bhandara */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center time-card p-6 sm:p-10 rounded-3xl border shadow-xs">
            <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-md border border-stone-300 dark:border-stone-700 relative group">
              <img
                src="/assets/aistudio/IMG-20261030-WA0000_4e2396e1_4e2396e1_4e2396e1.jpg"
                alt="शनिवार शाम का महाभंडारा"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 bg-[#0f4d3a]/90 text-amber-300 text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                प्रत्यक्ष भंडारा छायाचित्र
              </div>
            </div>
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-full">
                <UtensilsCrossed className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300" />
                <span>अन्नदान महादान</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold time-heading">
                प्रत्येक शनिवार शाम भव्य महाभंडारा व महाप्रसाद
              </h3>
              <p className="text-stone-700 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
                ग्राम गलगाँव स्थित प्रभु रामजी ट्रस्ट परिसर में प्रत्येक शनिवार सायं 05:30 बजे से रात्रि 09:30 बजे तक विशाल महाभंडारे का आयोजन होता है, जिसमें सैकड़ों परिक्रमावासी साधु-संत, पदयात्री एवं ग्रामीण श्रद्धालु एक साथ पंगत में बैठकर शुद्ध सात्विक महाप्रसाद ग्रहण करते हैं।
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span>शुद्ध घी-तेल से निर्मित दाल-बाटी, रोटी, सब्जी, खिचड़ी व हलवा प्रसादी।</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span>भक्तगण अपने जन्मदिन, वैवाहिक वर्षगांठ या पूर्वजों की स्मृति में भंडारे का प्रायोजन कर सकते हैं।</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => onDonateForCause('शनिवार शाम भंडारा महाप्रसाद')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#0f4d3a] hover:bg-[#125a44] rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <span>भंडारा प्रायोजित करें</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Service 2: Pratidin Chai Seva (Daily Tea Seva) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center time-card p-6 sm:p-10 rounded-3xl border shadow-xs">
            <div className="lg:col-span-6 order-2 lg:order-1 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-full">
                <Coffee className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300" />
                <span>नित्य सेवा</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold time-heading">
                प्रतिदिन प्रातः 06:00 बजे से नित्य निःशुल्क चाय व जल सेवा
              </h3>
              <p className="text-stone-700 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
                माँ नर्मदा परिक्रमा मार्ग से गुजरने वाले संतों, पदयात्रियों एवं श्रमजीवियों के लिए प्रतिदिन प्रातःकाल से ही ताज़ा दूध की चाय एवं शुद्ध जल की निरंतर सेवा संचालित की जाती है।
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span>परिक्रमा पदयात्रियों को थकान मिटाने हेतु नित्य शुद्ध दूध की चाय।</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span>दिनभर आने-जाने वाले सभी साधु-संतों व भक्तों का सत्कार।</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => onDonateForCause('प्रतिदिन चाय सेवा')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#0f4d3a] hover:bg-[#125a44] rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <span>चाय सेवा में सहयोग दें</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>
            <div className="lg:col-span-6 order-1 lg:order-2 rounded-2xl overflow-hidden shadow-md border border-stone-300 dark:border-stone-700 relative group">
              <img
                src="/assets/aistudio/1793586446047_5029f454.jpg"
                alt="प्रतिदिन चाय सेवा"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 bg-[#0f4d3a]/90 text-amber-300 text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                प्रत्यक्ष चाय सेवा छायाचित्र
              </div>
            </div>
          </div>

          {/* Service 3: Real Gaushala Gau Seva */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center time-card p-6 sm:p-10 rounded-3xl border shadow-xs">
            <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-md border border-stone-300 dark:border-stone-700 relative group">
              <img
                src="/assets/aistudio/img_real_gaushala_31c848c1.jpg"
                alt="गौशाला में संरक्षित गोवंश"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 bg-[#0f4d3a]/90 text-amber-300 text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                ग्राम गलगाँव गौशाला प्रत्यक्ष छायाचित्र
              </div>
            </div>
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-full">
                <Heart className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300" />
                <span>गौमाता संवर्धन</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold time-heading">
                गौसेवा एवं निराश्रित गोवंश संरक्षण
              </h3>
              <p className="text-stone-700 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
                ग्राम गलगाँव स्थित गौशाला में बेसहारा, अशक्त एवं वृद्ध गायों का नियमित लालन-पालन किया जाता है। उन्हें पौष्टिक हरा चारा, कुट्टी, दलिया, गुड़ एवं समय-समय पर निःशुल्क पशु चिकित्सा प्रदान की जाती है।
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span>दैनिक हरा चारा, कुट्टी एवं पौष्टिक दलिया व्यवस्था।</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span>गौशाला में पक्का फर्श, छायादार टीन शेड एवं पानी की हौदी।</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => onDonateForCause('गौसेवा एवं चारा व्यवस्था')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#0f4d3a] hover:bg-[#125a44] rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <span>गौसेवा में दान दें</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* All 10 Seva Projects Showcase */}
        <div className="mt-20 pt-12 border-t border-stone-200 dark:border-stone-700">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-700">
              संपूर्ण सेवा दर्शन
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold time-heading mt-2">
              ट्रस्ट के सभी 10 सेवा प्रकल्प
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-2">
              प्रत्येक प्रकल्प पर क्लिक करके विस्तृत विवरण देखें एवं सीधे पुण्य सहयोग समर्पित करें।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEFAULT_SEVA_PROJECTS.map((proj) => {
              const displayTitle = proj.title;
              const displaySubtitle = proj.subtitle;
              const displayDesc = proj.fullDescription || proj.description;
              const displayStats = proj.impactStat || proj.keyStats;

              return (
                <div
                  key={proj.id}
                  className="time-card p-5 rounded-2xl border hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200">
                        प्रकल्प #{proj.order || proj.number}
                      </span>
                      {displayStats && (
                        <span className="text-[11px] font-semibold text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-700">
                          {displayStats}
                        </span>
                      )}
                    </div>
                    <h4 className="font-heading font-bold text-base time-heading group-hover:text-amber-700 dark:group-hover:text-amber-200 transition-colors">
                      {displayTitle}
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">{displaySubtitle}</p>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 line-clamp-2 leading-relaxed">
                      {displayDesc}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-stone-200/60 dark:border-stone-700 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectProject) {
                          onSelectProject(proj);
                        }
                      }}
                      className="text-xs font-bold time-heading hover:text-amber-700 dark:hover:text-amber-200 flex items-center gap-1 cursor-pointer"
                    >
                      <span>विस्तार देखें</span>
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
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
