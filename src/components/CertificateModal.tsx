import React, { useState } from 'react';
import { StorageService } from '../utils/storage';
import { VolunteerCertificate } from '../types';
import { TRUST_INFO } from '../data/defaultData';
import { Language } from '../utils/translations';
import { X, Award, Search, Printer, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [certIdInput, setCertIdInput] = useState('');
  const [certificate, setCertificate] = useState<VolunteerCertificate | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certIdInput.trim()) return;
    const cert = StorageService.getCertificateById(certIdInput.trim());
    setCertificate(cert);
    setHasSearched(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0f4d3a] to-[#175b45] p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                डिजिटल सेवा सम्मान प्रमाण-पत्र
              </h3>
              <p className="text-xs text-amber-200/90">
                सत्यापित सेवा सम्मान प्रमाण-पत्र खोजें एवं डाउनलोड करें
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar (Screen only) */}
        <div className="p-4 bg-stone-50 border-b border-stone-200 shrink-0 no-print">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="प्रमाण-पत्र क्रमांक दर्ज करें (उदा. PRT-CERT-2026-101)..."
              value={certIdInput}
              onChange={(e) => setCertIdInput(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0f4d3a] focus:outline-none bg-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#0f4d3a] hover:bg-[#145e48] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>सत्यापित करें</span>
            </button>
          </form>
        </div>

        {/* Certificate Display Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-stone-100">
          {certificate ? (
            <div
              id="printable-certificate"
              className="w-full max-w-xl bg-[#FFFDF9] border-8 border-double border-amber-600/80 p-6 sm:p-8 rounded-lg shadow-lg relative text-center text-stone-800"
            >
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 text-amber-600 font-serif text-lg">❖</div>
              <div className="absolute top-2 right-2 text-amber-600 font-serif text-lg">❖</div>
              <div className="absolute bottom-2 left-2 text-amber-600 font-serif text-lg">❖</div>
              <div className="absolute bottom-2 right-2 text-amber-600 font-serif text-lg">❖</div>

              {/* Logo & Header */}
              <div className="flex flex-col items-center">
                <img
                  src={TRUST_INFO.logoUrl}
                  alt="Prabhu Ramji Trust Logo"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-2"
                />
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">
                  श्री सीतारामजी की असीम कृपा से
                </span>
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#0f4d3a] tracking-tight">
                  {TRUST_INFO.name}
                </h2>
                <p className="text-[11px] text-stone-600">
                  {TRUST_INFO.fullAddress}
                </p>
                <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent my-2" />
              </div>

              {/* Certificate Title */}
              <div className="my-3">
                <span className="inline-block px-4 py-1 bg-amber-100 text-amber-900 border border-amber-400 rounded-full font-serif font-bold text-xs sm:text-sm tracking-wider">
                  सेवा सम्मान पत्र
                </span>
              </div>

              {/* Salutation & Body */}
              <p className="text-xs sm:text-sm text-stone-600 italic mt-2">
                यह प्रमाण-पत्र आदर एवं कृतज्ञता सहित सादर समर्पित है:
              </p>
              <h3 className="text-lg sm:text-2xl font-bold text-[#0f4d3a] font-serif my-2 border-b-2 border-dashed border-amber-300 pb-1 max-w-sm mx-auto">
                {certificate.recipientName}
              </h3>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed max-w-md mx-auto my-3">
                आपने प्रभु रामजी ट्रस्ट द्वारा संचालित पूज्य सेवा प्रकल्प{' '}
                <strong className="text-[#0f4d3a]">« {certificate.sevaTitle || certificate.roleOrCause} »</strong> में अपना
                पुण्यमय सहयोग प्रदान कर धर्म एवं मानवता के संवर्धन में अमूल्य योगदान दिया है।
                {certificate.amount && (
                  <span className="block mt-1 font-semibold text-amber-900">
                    पुण्य सहयोग राशि: ₹{certificate.amount.toLocaleString('en-IN')}
                  </span>
                )}
              </p>

              {/* Signatures & Seal */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-stone-200 text-xs text-stone-600">
                <div className="text-left">
                  <div className="font-mono text-[10px] text-stone-500">प्रमाण-पत्र क्रमांक:</div>
                  <div className="font-mono font-bold text-stone-800">{certificate.id || certificate.certificateNo}</div>
                  <div className="text-[10px] text-stone-500 mt-1">जारी दिनांक: {certificate.issueDate}</div>
                </div>

                <div className="text-right flex flex-col items-end">
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>ट्रस्ट प्राधिकृत हस्ताक्षरी</span>
                  </div>
                  <div className="text-[10px] text-stone-500 mt-1">प्रभु रामजी ट्रस्ट, गलगाँव</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-stone-500 max-w-md">
              {hasSearched ? (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-semibold text-stone-800">
                    इस क्रमांक से कोई प्रमाण-पत्र नहीं मिला
                  </div>
                  <p className="text-xs text-stone-500">
                    कृपया अपना प्रमाण-पत्र ID पुनः जांचें अथवा दान रसीद सत्यापन के बाद प्रमाण-पत्र हेतु ट्रस्ट से संपर्क करें।
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                    <Award className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-semibold text-stone-800">
                    प्रमाण-पत्र क्रमांक दर्ज कर खोजें
                  </div>
                  <p className="text-xs text-stone-500">
                    प्रभु रामजी ट्रस्ट द्वारा दानदाताओं एवं कर्मठ स्वयंसेवकों को जारी डिजिटल सेवा सम्मान पत्र यहाँ से सत्यापित किया जा सकता है।
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 flex justify-between items-center text-xs text-stone-600 shrink-0 no-print">
          <div>
            {certificate && (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>सत्यापित डिजिटल प्रमाण-पत्र</span>
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {certificate && (
              <button
                onClick={handlePrint}
                className="px-3.5 py-1.5 bg-[#0f4d3a] hover:bg-[#145d47] text-white font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>प्रिंट / PDF सेव करें</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 font-medium rounded-lg text-stone-700 transition-colors cursor-pointer"
            >
              बंद करें
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
