import React from 'react';
import { Heart, Waves, UtensilsCrossed, Users, CheckCircle2, ArrowRight, Coffee, Building } from 'lucide-react';

interface KeyServicesProps {
  onDonateForCause: (cause: string) => void;
}

export const KeyServices: React.FC<KeyServicesProps> = ({ onDonateForCause }) => {
  return (
    <section id="services" className="py-16 md:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            ट्रस्ट में क्या-क्या सेवा चलती है
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0f4d3a] mt-3">
            हमारे प्रमुख नित्य व साप्ताहिक सेवा प्रकल्प
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
          <p className="text-stone-600 mt-4 text-base sm:text-lg">
            ग्राम गलगाँव (सनावद) में गोमाता, नर्मदा परिक्रमा साधु-संत एवं श्रद्धालुओं हेतु संचालित पवित्र गतिविधियाँ।
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

      </div>
    </section>
  );
};
