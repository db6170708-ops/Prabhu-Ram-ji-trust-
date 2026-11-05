import React from 'react';
import { TRUST_INFO, ABOUT_DECLARATION } from '../data/defaultData';
import { 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  Target, 
  Compass, 
  CheckCircle2, 
  FileText,
  Building
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
            हमारा परिचय एवं संकल्प
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0f4d3a] mt-3">
            प्रभु रामजी ट्रस्ट — परिचय एवं उद्देश्य
          </h2>
          <div className="w-24 h-1.5 bg-amber-500 mx-auto mt-4 rounded-full"></div>
          
          <p className="text-stone-700 mt-5 text-base sm:text-lg font-medium leading-relaxed italic text-amber-950 bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
            “{ABOUT_DECLARATION.mainHeader}”
          </p>

          {/* Natural SEO On-Page Introduction */}
          <div className="mt-4 p-4 bg-emerald-50/80 rounded-2xl border border-emerald-300/80 text-emerald-950 text-xs sm:text-sm font-medium leading-relaxed">
            <p>
              Aap sabhi ka <strong className="text-emerald-900 font-bold">Prabhu Ram ji trust</strong> (प्रभु रामजी ट्रस्ट) mein swagat hai. <strong className="text-emerald-900 font-bold">Ramji trust</strong> ka mukhya uddeshya dharmik, gauseva aur samajik sewa hai. <strong className="text-emerald-900 font-bold">Trust Prabhu Ram ji</strong> se judne ke liye humse sampark karein.
            </p>
          </div>
        </div>

        {/* Narrative & Values Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          
          <div className="lg:col-span-7 space-y-5 text-stone-700 leading-relaxed text-sm sm:text-base">
            <div className="border-b border-stone-200 pb-3">
              <h3 className="font-heading text-2xl font-bold text-[#0f4d3a] flex items-center gap-2">
                <Heart className="w-6 h-6 text-amber-600" />
                <span>धार्मिक एवं सामाजिक सेवा का संकल्प</span>
              </h3>
            </div>

            <p className="first-letter:text-5xl first-letter:font-heading first-letter:font-bold first-letter:text-[#0f4d3a] first-letter:float-left first-letter:mr-3 first-letter:mt-1">
              {ABOUT_DECLARATION.pledge}
            </p>

            <p>
              {ABOUT_DECLARATION.belief}
            </p>

            {/* Mission & Vision Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-stone-200">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-1.5">
                  <Target className="w-4 h-4 text-emerald-700" />
                  <span>हमारा मिशन (Mission)</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  ग्रामीण स्तर पर गौशाला संचालन, नर्मदा परिक्रमा में निरंतर अन्न-जल सेवा, कमजोर परिवारों के बच्चों की शिक्षा में संबल तथा समाज में आध्यात्मिक संस्कारों का विस्तार करना।
                </p>
              </div>

              <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-stone-200">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-1.5">
                  <Compass className="w-4 h-4 text-amber-700" />
                  <span>हमारा विज़न (Vision)</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  एक ऐसे आत्मनिर्भर, संस्कारित और संवेदनशील समाज की रचना, जहाँ कोई भी गौवंश निराश्रित न भटके, कोई परिक्रमावासी भूखा-प्यासा न रहे और हर जरूरतमंद को समय पर सहारा मिले।
                </p>
              </div>
            </div>

            {/* 2 Core Operating Tenets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#0f4d3a]">निष्काम सेवा भाव</h4>
                  <p className="text-[11px] text-stone-600 mt-0.5">बिना किसी स्वार्थ के केवल पीड़ित व जरूरतमंद की सहायता।</p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#0f4d3a]">पारदर्शी प्रबंधन</h4>
                  <p className="text-[11px] text-stone-600 mt-0.5">स्थानीय समाज एवं न्यासियों के प्रत्यक्ष देखरेख में कार्य।</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Highlights: 4 Values and Official Info */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 4 Sacred Values Grid */}
            <div className="grid grid-cols-2 gap-3">
              {ABOUT_DECLARATION.values.map((v, i) => (
                <div
                  key={i}
                  className="bg-[#FAF7F2] p-4 rounded-2xl border border-amber-200/80 text-center shadow-2xs hover:shadow-sm transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0f4d3a] text-amber-300 font-heading text-lg font-bold flex items-center justify-center mx-auto mb-2">
                    {v.label[0]}
                  </div>
                  <h4 className="font-heading font-bold text-base text-[#0f4d3a]">
                    {v.label}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1">
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Official Brief Box */}
            <div className="bg-gradient-to-br from-[#0f4d3a] to-[#082a20] text-white p-6 rounded-3xl shadow-lg border-2 border-amber-400/40 space-y-3.5">
              <span className="text-amber-400 font-bold text-xs tracking-wider uppercase block">
                अधिकृत न्यास विवरण
              </span>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-emerald-800/60">
                  <span className="text-emerald-200">स्थान:</span>
                  <span className="font-semibold text-white">ग्राम गलगाँव (सनावद, खरगोन)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-emerald-800/60">
                  <span className="text-emerald-200">प्रेरणा:</span>
                  <span className="font-semibold text-amber-300">मर्यादा पुरुषोत्तम प्रभु श्रीराम</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-emerald-800/60">
                  <span className="text-emerald-200">अध्यक्ष:</span>
                  <span className="font-semibold text-white">श्री गुलाबचंद जी (पिता: हीरालाल जी)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-emerald-800/60">
                  <span className="text-emerald-200">सचिव:</span>
                  <span className="font-semibold text-white">श्री दिनेश जी</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-emerald-200">कोषाध्यक्ष:</span>
                  <span className="font-semibold text-white">श्रीमती चम्पा बाई</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Statutory & Ethical Declaration Banner */}
        <div className="bg-amber-50/90 border-2 border-amber-300/80 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-800 shrink-0">
              <ShieldCheck className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h4 className="font-heading text-lg font-bold text-amber-950 mb-1">
                आधिकारिक सत्यनिष्ठा एवं वैधानिक घोषणा
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {ABOUT_DECLARATION.legalDeclaration}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
