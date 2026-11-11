import React from 'react';
import { Official } from '../types';
import { ShieldCheck, UserCheck } from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';

interface OfficialsSectionProps {
  language?: Language;
  officials: Official[];
}

export const OfficialsSection: React.FC<OfficialsSectionProps> = ({ language = 'hi', officials }) => {
  const isEn = language === 'en';
  const t = TRANSLATIONS[language] || TRANSLATIONS['hi'];

  const getCleanDesignation = (desig: string) => {
    if (!isEn) return desig.replace(/\s*\([^)]*\)/g, '').trim();
    if (desig.toLowerCase().includes('president') || desig.includes('अध्यक्ष')) return 'President';
    if (desig.toLowerCase().includes('secretary') || desig.includes('सचिव')) return 'Secretary';
    if (desig.toLowerCase().includes('treasurer') || desig.includes('कोषाध्यक्ष')) return 'Treasurer';
    return desig;
  };

  const getCleanName = (name: string) => {
    if (!isEn) return name;
    if (name.includes('गुलाबचंद')) return 'Shri Gulabchand Ji';
    if (name.includes('दिनेश')) return 'Shri Dinesh Ji';
    if (name.includes('चम्पा')) return 'Smt. Champa Bai';
    return name;
  };

  const getCleanRole = (role: string, name: string) => {
    if (!isEn) return role;
    if (name.includes('गुलाबचंद')) {
      return 'Founding President and mentor. Under his spiritual guidance, Gaushala care, daily morning tea seva, Saturday grand feast, and ashram construction are actively operated.';
    }
    if (name.includes('दिनेश')) {
      return 'Trust management, managing Saturday community bhandara, supervising morning tea seva, monitoring ashram construction, and digital communications.';
    }
    if (name.includes('चम्पा')) {
      return 'Financial transparency, community kitchen expenditure management, gaushala ledgers, and transparent records of ashram building funds.';
    }
    return role;
  };

  return (
    <section id="officials" className="py-16 md:py-24 bg-[#FAF7F2] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-300">
            {t.officialsTag}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0f4d3a] mt-3">
            {t.officialsTitle}
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
          <p className="text-stone-600 mt-4 text-base sm:text-lg">
            {t.officialsSub}
          </p>
        </div>

        {/* 3 Main Officials Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {officials.map((official) => (
            <div 
              key={official.id}
              className="bg-white rounded-3xl p-8 shadow-xs hover:shadow-lg transition-all border border-stone-200 hover:border-amber-400 flex flex-col justify-between text-center relative overflow-hidden group"
            >
              {/* Top Accent Strip */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#0f4d3a] via-amber-500 to-[#0f4d3a]"></div>

              <div>
                {/* Official Avatar Emblem */}
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#0f4d3a] to-[#082a20] border-4 border-amber-400/60 flex items-center justify-center text-amber-300 shadow-md mb-5 group-hover:scale-105 transition-transform">
                  <UserCheck className="w-10 h-10 text-amber-300" />
                </div>

                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold text-[#0f4d3a] bg-emerald-50 border border-emerald-200 mb-3">
                  {getCleanDesignation(official.designation)}
                </div>

                <h3 className="font-heading text-2xl font-bold text-stone-900 mb-3">
                  {getCleanName(official.name)}
                </h3>

                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  {getCleanRole(official.roleDescription, official.name)}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isEn ? "Authorized & Verified Trustee" : "अधिकृत एवं सत्यापित न्यासी"}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Accountability & Public Declaration Box */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-amber-200/90 shadow-xs max-w-3xl mx-auto text-center">
          <h4 className="font-heading text-base font-bold text-[#0f4d3a] mb-1">
            {isEn ? "Public Oath by the Board of Trustees" : "न्यासी मंडल की ओर से सार्वजनिक प्रतिज्ञा"}
          </h4>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {isEn 
              ? "“We pledge that every single rupee received by Prabhu Ramji Trust is directly utilized for cow protection, daily pilgrim food & tea seva, and holy ashram construction. Any devotee seeking account statements or clarification is welcome to contact us directly.”"
              : "“हम वचन देते हैं कि प्रभु रामजी ट्रस्ट को प्राप्त होने वाला हर एक दान सीधे गौमाता की सेवा, अन्नदान एवं नर्मदा परिक्रमा सेवा में लगाया जाता है। किसी भी दानदाता को यदि किसी भी प्रकार की जानकारी या हिसाब चाहिए, तो वे सीधे हमसे संपर्क कर सकते हैं।”"}
          </p>
        </div>

      </div>
    </section>
  );
};
