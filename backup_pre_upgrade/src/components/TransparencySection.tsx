import React, { useState } from 'react';
import { TransparencyRecord } from '../types';
import { TRUST_INFO } from '../data/defaultData';
import { 
  ShieldCheck, 
  FileSpreadsheet, 
  TrendingUp, 
  Receipt, 
  HelpCircle, 
  CheckCircle,
  Eye,
  Building
} from 'lucide-react';

import { Language, TRANSLATIONS } from '../utils/translations';

interface TransparencySectionProps {
  language?: Language;
  records: TransparencyRecord[];
}

export const TransparencySection: React.FC<TransparencySectionProps> = ({ language = 'hi', records }) => {
  const isEn = language === 'en';
  const t = TRANSLATIONS[language];
  const [selectedRecord, setSelectedRecord] = useState<TransparencyRecord>(records[0] || {} as TransparencyRecord);

  const totalDonationSum = records.reduce((acc, curr) => acc + curr.totalDonation, 0);
  const totalExpenseSum = records.reduce((acc, curr) => acc + curr.totalExpense, 0);

  return (
    <section id="transparency" className="py-16 md:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {t.transparencyTag}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0f4d3a] mt-3">
            {t.transparencyTitle}
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
          <p className="text-stone-600 mt-4 text-base sm:text-lg">
            {isEn
              ? 'Complete public disclosure and financial accountability for every rupee received and disbursed for sacred welfare activities.'
              : 'प्रभु रामजी ट्रस्ट में दानदाताओं द्वारा दी गई एक-एक पाई का हिसाब पूरी शुचिता और ईमानदारी के साथ दर्ज किया जाता है।'}
          </p>
        </div>

        {/* 3 Overview Metric Counters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-500">कुल दर्ज सहयोग (हालिया अवधि)</span>
              <Receipt className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-bold font-mono text-[#0f4d3a]">
              ₹{totalDonationSum.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-stone-500 mt-2">
              समस्त दान सीधे IDBI बैंक खाते एवं UPI के माध्यम से दर्ज।
            </p>
          </div>

          <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-500">कुल सेवा व्यय (गौसेवा व भंडारा)</span>
              <TrendingUp className="w-5 h-5 text-amber-700" />
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-bold font-mono text-stone-900">
              ₹{totalExpenseSum.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-stone-500 mt-2">
              चारा, अनाज, प्रसादी सामग्री व परिक्रमा सेवा में समर्पित।
            </p>
          </div>

          <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-500">पंजीकरण एवं कर स्थिति</span>
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="text-lg font-bold text-stone-800">
              12AB व 80G प्रक्रियाधीन
            </div>
            <p className="text-xs text-stone-500 mt-2">
              आयकर विभाग से अंतिम स्वीकृति उपरांत 80G टैक्स प्रमाण पत्र मान्य होगा।
            </p>
          </div>

        </div>

        {/* Detailed Monthly Ledger Table */}
        <div className="bg-stone-50 rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <h3 className="font-heading text-xl font-bold text-[#0f4d3a] flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                <span>मासिक सेवा व आय-व्यय विवरणिका</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                प्रभु रामजी ट्रस्ट, ग्राम गलगाँव (सनावद, खरगोन) अधिकृत बहीखाता
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              सार्वजनिक निरीक्षणार्थ उपलब्ध
            </span>
          </div>

          <div className="overflow-x-auto mt-6">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-3">माह / वर्ष</th>
                  <th className="py-3 px-3">प्राप्त दान (₹)</th>
                  <th className="py-3 px-3">गौसेवा व्यय (₹)</th>
                  <th className="py-3 px-3">भंडारा व्यय (₹)</th>
                  <th className="py-3 px-3">नर्मदा सेवा (₹)</th>
                  <th className="py-3 px-3 font-bold">कुल व्यय (₹)</th>
                  <th className="py-3 px-3">मुख्य विवरण</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/70 text-stone-800">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-white transition-colors">
                    <td className="py-3.5 px-3 font-bold text-[#0f4d3a] whitespace-nowrap">
                      {r.monthYear}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-semibold text-emerald-700">
                      ₹{r.totalDonation.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 font-mono">
                      ₹{r.gauSevaExpense.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 font-mono">
                      ₹{r.bhandaraExpense.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 font-mono">
                      ₹{r.narmadaSevaExpense.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-stone-900">
                      ₹{r.totalExpense.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 text-xs text-stone-600 max-w-xs">
                      {r.remarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Public Inspection & Verification Statement */}
        <div className="bg-[#FAF7F2] p-8 rounded-3xl border-2 border-emerald-900/10 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h4 className="font-heading text-lg font-bold text-[#0f4d3a] flex items-center gap-2">
                <Building className="w-5 h-5 text-amber-600" />
                <span>खुली बहीखाता नीति (Open Books Policy)</span>
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 max-w-3xl leading-relaxed">
                ट्रस्ट के किसी भी दानदाता अथवा श्रद्धालु को ट्रस्ट के मूल बिल, वाउचर, बैंक पासबुक एवं चारा-अन्न खरीद के बिल देखने का पूरा अधिकार है। आप किसी भी कार्यदिवस में ग्राम गलगाँव स्थित ट्रस्ट कार्यालय में पधारकर प्रत्यक्ष सत्यापन कर सकते हैं।
              </p>
            </div>
            <div className="shrink-0">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-emerald-900 bg-white hover:bg-emerald-50 rounded-xl border border-emerald-300 transition-colors shadow-xs"
              >
                <Eye className="w-4 h-4 text-emerald-700" />
                <span>कार्यालय में संपर्क करें</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
