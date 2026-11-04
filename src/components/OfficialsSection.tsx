import React from 'react';
import { Official } from '../types';
import { ShieldCheck, UserCheck, Phone, Award } from 'lucide-react';

interface OfficialsSectionProps {
  officials: Official[];
}

export const OfficialsSection: React.FC<OfficialsSectionProps> = ({ officials }) => {
  return (
    <section id="officials" className="py-16 md:py-24 bg-[#FAF7F2] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-300">
            कार्यकारिणी एवं न्यासी मंडल
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0f4d3a] mt-3">
            ट्रस्ट के अधिकृत पदाधिकारी
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
          <p className="text-stone-600 mt-4 text-base sm:text-lg">
            जिनके समर्पण, शुचिता और पारदर्शी मार्गदर्शन से प्रभु रामजी ट्रस्ट के सेवा कार्य संचालित हो रहे हैं।
          </p>
        </div>

        {/* 3 Main Officials Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {officials.map((official) => (
            <div 
              key={official.id}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all border border-stone-200 hover:border-amber-400 flex flex-col justify-between text-center relative overflow-hidden group"
            >
              {/* Top Accent Strip */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#0f4d3a] via-amber-500 to-[#0f4d3a]"></div>

              <div>
                {/* Official Avatar Emblem */}
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#0f4d3a] to-[#082a20] border-4 border-amber-400/60 flex items-center justify-center text-amber-300 shadow-md mb-5 group-hover:scale-105 transition-transform">
                  <UserCheck className="w-10 h-10 text-amber-300" />
                </div>

                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold text-[#0f4d3a] bg-emerald-50 border border-emerald-200 mb-3">
                  {official.designation}
                </div>

                <h3 className="font-heading text-2xl font-bold text-stone-900 mb-3">
                  {official.name}
                </h3>

                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  {official.roleDescription}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>अधिकृत एवं सत्यापित न्यासी</span>
              </div>
            </div>
          ))}
        </div>

        {/* Accountability & Public Declaration Box */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-amber-200/90 shadow-sm max-w-3xl mx-auto text-center">
          <h4 className="font-heading text-base font-bold text-[#0f4d3a] mb-1">
            न्यासी मंडल की ओर से सार्वजनिक प्रतिज्ञा
          </h4>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            “हम वचन देते हैं कि प्रभु रामजी ट्रस्ट को प्राप्त होने वाला हर एक दान सीधे गौमाता की सेवा, अन्नदान एवं नर्मदा परिक्रमा सेवा में लगाया जाता है। किसी भी दानदाता को यदि किसी भी प्रकार की जानकारी या हिसाब चाहिए, तो वे सीधे हमसे संपर्क कर सकते हैं।”
          </p>
        </div>

      </div>
    </section>
  );
};
