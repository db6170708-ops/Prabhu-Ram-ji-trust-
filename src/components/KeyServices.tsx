import React from 'react';
import { Heart, UtensilsCrossed, CheckCircle2, ArrowRight, Coffee, ChevronRight } from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';
import { DEFAULT_SEVA_PROJECTS } from '../data/defaultData';
import { SevaProject } from '../types';

interface KeyServicesProps {
  language?: Language;
  onDonateForCause: (cause: string) => void;
  onSelectProject?: (project: SevaProject) => void;
}

const SEVA_PROJECTS_EN_MAP: Record<string, { title: string; subtitle: string; desc: string; keyStats: string; cause: string }> = {
  gauseva: {
    title: "Cow Protection & Destitute Cattle Care",
    subtitle: "Fresh green fodder, safe shelter & veterinary treatment for cows",
    desc: "Providing daily fresh green fodder, straw, nutritious grain porridge, jaggery, and veterinary medical care for abandoned cows in Gram Galgaon.",
    keyStats: "50+ Destitute Cows Cared Daily",
    cause: "Gaushala Cow Welfare"
  },
  narmada: {
    title: "Maa Narmada Parikrama Pilgrim & Sadhu Seva",
    subtitle: "Drinking water, refreshments, resting rooms & first aid for pilgrims",
    desc: "Offering free pure drinking water, morning herbal tea, seasonal fruits, and clean shelter at Galgaon Ashram for barefoot walking pilgrims.",
    keyStats: "Thousands of Pilgrims Served Yearly",
    cause: "Narmada Pilgrim Support"
  },
  bhandara: {
    title: "Every Saturday Evening Grand Bhandara & Prasad",
    subtitle: "Weekly community sanctified meal for hundreds of devotees",
    desc: "Organizing a grand community feast every Saturday evening made with pure ingredients, serving dal-bati, vegetables, rotis, khichdi, and sweet halwa prasad.",
    keyStats: "300+ Devotees Receive Prasad Every Saturday",
    cause: "Saturday Grand Bhandara"
  },
  chaiseva: {
    title: "Daily Free Morning Tea & Pure Water Service",
    subtitle: "Serving hot tea and water from 6:00 AM daily for sadhus & travelers",
    desc: "Operating daily from early dawn at the Hanuman temple, serving fresh milk tea and clean water to revive weary Narmada pilgrims.",
    keyStats: "200+ Cups of Free Tea Served Daily",
    cause: "Daily Tea Seva"
  },
  ashram: {
    title: "Prabhu Ramji Ashram & Mandir Construction",
    subtitle: "Permanent pilgrim complex, community dining hall & Hanuman temple",
    desc: "Constructing reinforced concrete pillars, deep foundation, satsang mandap, and guest halls for sadhus and walking devotees along the Narmada route.",
    keyStats: "3500 Sq. Ft. Grand Service Complex",
    cause: "Ashram & Mandir Construction"
  },
  poorhelp: {
    title: "Assistance for Destitute & Underprivileged Families",
    subtitle: "Food ration kits, clothes, emergency aid & warm blankets in winter",
    desc: "Identifying vulnerable rural families and providing essential food grains, winter blankets, clothing, and humanitarian relief during crises.",
    keyStats: "Timely Aid to 100+ Rural Families",
    cause: "Aid for Poor Families"
  },
  childedu: {
    title: "Child Values & Education Support for Rural Students",
    subtitle: "School kits, notebooks, and traditional cultural values",
    desc: "Equipping underprivileged village boys and girls with school bags, textbooks, notebooks, and nurturing ethical and cultural virtues.",
    keyStats: "Value Education & Academic Support",
    cause: "Child Education Support"
  },
  health: {
    title: "Free Health Camps & First-Aid Medical Support",
    subtitle: "Foot care, blister treatment & health checkups for pilgrims",
    desc: "Administering essential antiseptic treatment, wound dressing, oral rehydration solutions, and periodic health diagnosis camps for walking pilgrims.",
    keyStats: "Free Primary Health & First Aid for Pilgrims",
    cause: "Free Health & First Aid"
  },
  environment: {
    title: "Tree Plantation & Holy Narmada River Ecology",
    subtitle: "Planting medicinal & shade trees on riverbanks and ashram grounds",
    desc: "Planting banyan, peepal, neem, bael, and holy tulsi saplings to conserve green ecology and preserve the purity of Maa Narmada.",
    keyStats: "500+ Trees Planted & Nurtured",
    cause: "Tree Plantation & Environment"
  },
  cultural: {
    title: "Devotional, Cultural & Spiritual Celebrations",
    subtitle: "Ram Navami, Hanuman Jayanti, Shivratri & Sundarkand recitations",
    desc: "Fostering spiritual devotion and community unity through collective Akhand Ramayan, weekly Sundarkand recitals, and traditional Vedic festivities.",
    keyStats: "Continuous Year-Round Spiritual Festivals",
    cause: "Cultural & Spiritual Celebrations"
  }
};

export const KeyServices: React.FC<KeyServicesProps> = ({ 
  language = 'hi', 
  onDonateForCause,
  onSelectProject
}) => {
  const isEn = language === 'en';
  const t = TRANSLATIONS[language] || TRANSLATIONS['hi'];

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
          
          {/* Service 1: Har Shaniwar Sham Ko Bhandara */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF7F2] p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-xs">
            <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-md border border-stone-300 relative group">
              <img
                src="/assets/aistudio/IMG-20261030-WA0000_4e2396e1_4e2396e1_4e2396e1.jpg"
                alt={t.bhandaraTitle}
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 bg-[#0f4d3a]/90 text-amber-300 text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                {t.bhandaraPhotoBadge}
              </div>
            </div>
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                <UtensilsCrossed className="w-3.5 h-3.5 text-amber-700" />
                <span>{t.bhandaraTag}</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#0f4d3a]">
                {t.bhandaraTitle}
              </h3>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                {t.bhandaraDesc}
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{isEn ? "Pure, freshly prepared sattvic prasad including dal-bati, vegetables, roti, khichdi, and halwa." : "शुद्ध घी-तेल से निर्मित दाल-बाटी, रोटी, सब्जी, खिचड़ी व हलवा प्रसादी।"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{isEn ? "Devotees can sponsor the Bhandara in memory of ancestors, birthdays, or family anniversaries." : "भक्तगण अपने जन्मदिन, वैवाहिक वर्षगांठ या पूर्वजों की स्मृति में भंडारे का प्रायोजन कर सकते हैं।"}</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => onDonateForCause(isEn ? 'Saturday Grand Bhandara' : 'शनिवार शाम भंडारा महाप्रसाद')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#0f4d3a] hover:bg-[#125a44] rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <span>{t.sponsorBhandaraBtn}</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Service 2: Pratidin Chai Seva (Daily Tea Seva) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF7F2] p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-xs">
            <div className="lg:col-span-6 order-2 lg:order-1 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                <Coffee className="w-3.5 h-3.5 text-amber-700" />
                <span>{t.chaiTag}</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#0f4d3a]">
                {t.chaiTitle}
              </h3>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                {t.chaiDesc}
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{isEn ? "Hot tea made with pure milk to rejuvenate exhausted walking pilgrims." : "परिक्रमा पदयात्रियों को थकान मिटाने हेतु नित्य शुद्ध दूध की चाय।"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{isEn ? "Continuous hospitality for visiting sadhus, pilgrims, and rural devotees." : "दिनभर आने-जाने वाले सभी साधु-संतों व भक्तों का सत्कार।"}</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => onDonateForCause(isEn ? 'Daily Tea Seva' : 'प्रतिदिन चाय सेवा')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#0f4d3a] hover:bg-[#125a44] rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <span>{t.sponsorChaiBtn}</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>
            <div className="lg:col-span-6 order-1 lg:order-2 rounded-2xl overflow-hidden shadow-md border border-stone-300 relative group">
              <img
                src="/assets/aistudio/1793586446047_5029f454.jpg"
                alt={t.chaiTitle}
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 bg-[#0f4d3a]/90 text-amber-300 text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                {t.chaiPhotoBadge}
              </div>
            </div>
          </div>

          {/* Service 3: Real Gaushala Gau Seva */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF7F2] p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-xs">
            <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-md border border-stone-300 relative group">
              <img
                src="/assets/aistudio/img_real_gaushala_31c848c1.jpg"
                alt={t.gauTitle}
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 bg-[#0f4d3a]/90 text-amber-300 text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                {t.gauPhotoBadge}
              </div>
            </div>
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                <Heart className="w-3.5 h-3.5 text-amber-700" />
                <span>{t.gauTag}</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#0f4d3a]">
                {t.gauTitle}
              </h3>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                {t.gauDesc}
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{isEn ? "Daily supply of fresh green fodder, dry straw, and nutritious grain mix." : "दैनिक हरा चारा, कुट्टी एवं पौष्टिक दलिया व्यवस्था।"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{isEn ? "Clean concrete flooring, sheltered tin shed, and fresh water troughs." : "गौशाला में पक्का फर्श, छायादार टीन शेड एवं पानी की हौदी।"}</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => onDonateForCause(isEn ? 'Cow Welfare & Gaushala' : 'गौसेवा एवं चारा व्यवस्था')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#0f4d3a] hover:bg-[#125a44] rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <span>{t.sponsorGauBtn}</span>
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
              {isEn ? "Comprehensive Seva Portfolio" : "संपूर्ण सेवा दर्शन"}
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#0f4d3a] mt-2">
              {t.allProjectsTitle}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              {isEn ? "Click on any project to view details and dedicate direct contribution." : "प्रत्येक प्रकल्प पर क्लिक करके विस्तृत विवरण देखें एवं सीधे पुण्य सहयोग समर्पित करें।"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEFAULT_SEVA_PROJECTS.map((proj) => {
              const enData = isEn ? SEVA_PROJECTS_EN_MAP[proj.id] : null;
              const displayTitle = enData ? enData.title : proj.title;
              const displaySubtitle = enData ? enData.subtitle : proj.subtitle;
              const displayDesc = enData ? enData.desc : (proj.fullDescription || proj.description);
              const displayStats = enData ? enData.keyStats : (proj.impactStat || proj.keyStats);
              const causeToDonate = enData ? enData.cause : proj.title;

              return (
                <div
                  key={proj.id}
                  className="bg-[#FAF7F2] hover:bg-white p-5 rounded-2xl border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {isEn ? `Project #${proj.order || proj.number}` : `प्रकल्प #${proj.order || proj.number}`}
                      </span>
                      {displayStats && (
                        <span className="text-[11px] font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {displayStats}
                        </span>
                      )}
                    </div>
                    <h4 className="font-heading font-bold text-base text-[#0f4d3a] group-hover:text-amber-800 transition-colors">
                      {displayTitle}
                    </h4>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">{displaySubtitle}</p>
                    <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                      {displayDesc}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-stone-200/60 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectProject) {
                          onSelectProject({
                            ...proj,
                            title: displayTitle,
                            subtitle: displaySubtitle,
                            description: displayDesc,
                            fullDescription: displayDesc,
                            impactStat: displayStats
                          });
                        }
                      }}
                      className="text-xs font-bold text-[#0f4d3a] hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{t.viewDetailsBtn}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDonateForCause(causeToDonate)}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-[#0f4d3a] hover:bg-[#125843] rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      {isEn ? "Sponsor" : "सहयोग दें"}
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
