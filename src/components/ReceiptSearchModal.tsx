import React, { useState } from 'react';
import { StorageService } from '../utils/storage';
import { DonationReceipt } from '../types';
import { TRUST_INFO } from '../data/defaultData';
import { Search, X, Printer, FileText, CheckCircle2 } from 'lucide-react';

interface ReceiptSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptSearchModal: React.FC<ReceiptSearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<DonationReceipt | null>(null);

  if (!isOpen) return null;

  const receipts = StorageService.getReceipts();

  const filteredReceipts = receipts.filter(r => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    return (
      r.mobile.includes(term) ||
      r.receiptNo.toLowerCase().includes(term) ||
      r.donorName.toLowerCase().includes(term)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in zoom-in-95 duration-150 my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <FileText className="w-6 h-6 text-[#0f4d3a]" />
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#0f4d3a]">
            दान रसीद खोजें व डाउनलोड करें
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-stone-500 mb-6">
          अपना मोबाइल नंबर, दानदाता का नाम या रसीद संख्या दर्ज करके अपनी डिजिटल पावती प्राप्त करें।
        </p>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute inset-y-0 left-3.5 my-auto w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="मोबाइल नंबर / रसीद क्र. / नाम लिखें..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4d3a] focus:bg-white"
          />
        </div>

        {/* Results list */}
        <div className="max-h-64 overflow-y-auto space-y-2.5 pr-1 mb-6">
          {filteredReceipts.length === 0 ? (
            <div className="text-center py-8 text-stone-400 text-xs sm:text-sm">
              कोई रसीद नहीं मिली। कृपया सही मोबाइल नंबर या नाम दर्ज करें।
            </div>
          ) : (
            filteredReceipts.map((r) => (
              <div
                key={r.receiptNo}
                onClick={() => setSelectedReceipt(r)}
                className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between cursor-pointer transition-all ${
                  selectedReceipt?.receiptNo === r.receiptNo
                    ? 'bg-emerald-50 border-emerald-600 shadow-xs'
                    : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div>
                  <div className="font-bold text-stone-900">{r.donorName}</div>
                  <div className="text-stone-500 text-xs mt-0.5">
                    रसीद: <span className="font-mono">{r.receiptNo}</span> · मो: {r.mobile} · {r.date}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-[#0f4d3a] text-sm">₹{r.amount}</div>
                  <div className="text-[11px] text-stone-500">{r.cause}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Active Selected Receipt View */}
        {selectedReceipt && (
          <div className="space-y-4">
            {/* The Printable Receipt with exact id="printable-receipt" */}
            <div id="printable-receipt" className="bg-[#FAF7F2] p-5 sm:p-6 rounded-2xl border-2 border-amber-300 space-y-4 shadow-sm">
              
              {/* Header with Official Logo */}
              <div className="text-center pb-3 border-b-2 border-stone-800">
                <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-amber-500 shadow mb-1.5 bg-[#08241b]">
                  <img src={TRUST_INFO.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">
                  ॥ श्री गणेशाय नमः ॥ श्री जानकीनाथ सहाय ॥
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#0f4d3a]">
                  {TRUST_INFO.name}
                </h3>
                <p className="text-xs font-medium text-stone-700">
                  {TRUST_INFO.fullAddress}
                </p>
                <div className="text-[11px] text-stone-600 mt-0.5">
                  वेबसाइट: <span className="font-mono font-semibold text-emerald-800">https://prabhuramjitrustram.ai.studio/</span> | हेल्पलाइन: {TRUST_INFO.phone}
                </div>
                <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-900">
                  आधिकारिक डिजिटल दान पावती रसीद
                </div>
              </div>

              {/* Receipt Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div>
                  <span className="text-stone-500 block text-[11px]">रसीद संख्या:</span>
                  <strong className="font-mono text-stone-900 font-bold">{selectedReceipt.receiptNo}</strong>
                </div>
                <div className="text-right">
                  <span className="text-stone-500 block text-[11px]">दिनांक:</span>
                  <strong className="text-stone-900">{selectedReceipt.date}</strong>
                </div>

                <div>
                  <span className="text-stone-500 block text-[11px]">दानदाता का नाम:</span>
                  <strong className="text-sm sm:text-base text-stone-900 font-bold">{selectedReceipt.donorName}</strong>
                </div>
                <div className="text-right">
                  <span className="text-stone-500 block text-[11px]">मोबाइल नंबर:</span>
                  <strong className="font-mono text-stone-900">{selectedReceipt.mobile}</strong>
                </div>

                {selectedReceipt.pan && (
                  <div>
                    <span className="text-stone-500 block text-[11px]">पैन नंबर (PAN):</span>
                    <strong className="font-mono text-stone-900">{selectedReceipt.pan}</strong>
                  </div>
                )}

                <div className={selectedReceipt.pan ? 'text-right' : 'col-span-2'}>
                  <span className="text-stone-500 block text-[11px]">सहयोग प्रकल्प / उद्देश्य:</span>
                  <strong className="text-emerald-900 font-semibold">{selectedReceipt.cause}</strong>
                </div>
              </div>

              {/* Amount Box */}
              <div className="bg-white p-3.5 rounded-xl border border-amber-300 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-stone-500 block">प्राप्त सहयोग राशि:</span>
                  <span className="text-xl font-bold font-mono text-[#0f4d3a]">
                    ₹{selectedReceipt.amount.toLocaleString('en-IN')} /-
                  </span>
                </div>
                <div className="text-right text-xs text-stone-600">
                  <div>माध्यम: <strong>{selectedReceipt.paymentMode}</strong></div>
                  <div>संदर्भ: <span className="font-mono">{selectedReceipt.transactionRef}</span></div>
                </div>
              </div>

              {/* Legal Transparency Note */}
              <div className="text-[10px] sm:text-[11px] text-stone-500 border-t border-stone-200 pt-2 leading-relaxed">
                <strong>पारदर्शिता सूचना:</strong> प्रभु रामजी ट्रस्ट द्वारा प्राप्त समस्त दान राशि का उपयोग नियमानुसार गौसेवा, प्रतिदिन चाय सेवा, शनिवार शाम भंडारा व आश्रम निर्माण में किया जाता है। ट्रस्ट का 12AB एवं 80G पंजीकरण आयकर विभाग में प्रक्रियाधीन है।
              </div>

              {/* Signatures */}
              <div className="pt-2 flex items-end justify-between text-xs">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full border-2 border-dashed border-emerald-700/60 flex items-center justify-center p-1 text-[10px] text-emerald-800 font-bold leading-tight">
                    प्रभु रामजी ट्रस्ट<br />गलगाँव
                  </div>
                  <span className="text-[10px] text-stone-500 mt-1 block">आधिकारिक मुहर</span>
                </div>

                <div className="text-right text-stone-700">
                  <div className="font-serif italic font-bold text-stone-800 mb-1">दिनेश बिड़ला / गुलाबचंद</div>
                  <div className="text-[11px] font-semibold text-stone-900">अधिकृत हस्ताक्षरकर्ता / व्यवस्थापक</div>
                  <div className="text-[10px] text-stone-500">प्रभु रामजी ट्रस्ट, गलगाँव (सनावद)</div>
                </div>
              </div>

            </div>

            {/* Print Action Buttons (Hidden when printing via no-print class) */}
            <div className="flex items-center justify-end gap-3 no-print">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0f4d3a] hover:bg-[#135d47] rounded-xl shadow cursor-pointer transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>प्रिंट करें / PDF के रूप में सहेजें</span>
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
          >
            बंद करें
          </button>
        </div>

      </div>
    </div>
  );
};
