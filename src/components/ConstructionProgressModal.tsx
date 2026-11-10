import React from 'react';
import { StorageService } from '../utils/storage';
import { ConstructionProgress } from '../types';
import { TRUST_INFO } from '../data/defaultData';
import { Language } from '../utils/translations';
import { X, Building2, CheckCircle2, Hammer, TrendingUp, IndianRupee, HeartHandshake, ShieldCheck } from 'lucide-react';

interface ConstructionProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onDonateForConstruction: () => void;
}

export const ConstructionProgressModal: React.FC<ConstructionProgressModalProps> = ({
  isOpen,
  onClose,
  language,
  onDonateForConstruction,
}) => {
  if (!isOpen) return null;

  const progress: ConstructionProgress = StorageService.getConstructionProgress();

  const completionPercent = progress.completionPercentage || 65;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0f4d3a] to-[#165a44] p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {language === 'hi' ? 'आश्रम एवं मंदिर निर्माण प्रगति रिपोर्ट' : 'Ashram Construction Progress Report'}
              </h3>
              <p className="text-xs text-amber-200/90">
                ग्राम गलगाँव (सनावद) - प्रत्यक्ष कार्य विवरण एवं व्यय पारदर्शिता
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Main Progress Highlight Banner */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  वर्तमान चरण (Current Phase)
                </span>
                <h4 className="text-base sm:text-lg font-bold text-stone-900">
                  {progress.phaseTitle}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-heading font-black text-[#0f4d3a]">
                  {completionPercent}%
                </span>
                <span className="text-xs text-stone-500 block">कार्य संपन्न</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3.5 bg-stone-200 rounded-full overflow-hidden p-0.5 border border-stone-300">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-emerald-600 to-[#0f4d3a] rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <p className="text-xs text-stone-600 mt-2">
              लक्ष्य पूर्ति अनुमानित दिनांक: <strong className="text-stone-800">{progress.targetDate}</strong>
            </p>
          </div>

          {/* Financial Breakdown Cards */}
          {(() => {
            const estimatedBudget = progress.estimatedBudget || progress.totalBudget || 3500000;
            const fundsRaised = progress.fundsRaised || progress.receivedDonations || 1450000;
            const fundsSpent = progress.fundsSpent || progress.totalSpent || 1280000;

            return (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-xl">
                  <div className="text-[11px] text-stone-500 font-medium">कुल प्राक्कलित बजट</div>
                  <div className="text-lg font-bold text-stone-900 mt-1 flex items-center">
                    <IndianRupee className="w-4 h-4 text-stone-600" />
                    <span>₹{(estimatedBudget / 100000).toFixed(2)} लाख</span>
                  </div>
                  <div className="text-[10px] text-stone-400">अनुमानित संपूर्ण निर्माण</div>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-xl">
                  <div className="text-[11px] text-emerald-800 font-medium">प्राप्त सहयोग (निधि)</div>
                  <div className="text-lg font-bold text-emerald-800 mt-1 flex items-center">
                    <IndianRupee className="w-4 h-4 text-emerald-600" />
                    <span>₹{(fundsRaised / 100000).toFixed(2)} लाख</span>
                  </div>
                  <div className="text-[10px] text-emerald-600">भक्तों द्वारा समर्पित दान</div>
                </div>

                <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-xl">
                  <div className="text-[11px] text-amber-900 font-medium">अब तक हुआ व्यय</div>
                  <div className="text-lg font-bold text-amber-900 mt-1 flex items-center">
                    <IndianRupee className="w-4 h-4 text-amber-700" />
                    <span>₹{(fundsSpent / 100000).toFixed(2)} लाख</span>
                  </div>
                  <div className="text-[10px] text-amber-700">सामग्री एवं श्रम भुगतान</div>
                </div>
              </div>
            );
          })()}

          {/* Construction Milestones */}
          <div>
            <h5 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Hammer className="w-4 h-4 text-amber-600" />
              <span>निर्माण चरण एवं उपलब्धियां (Milestones)</span>
            </h5>
            <div className="space-y-2.5">
              {(progress.milestones || []).map((m, idx) => {
                const isCompleted = m.status === 'completed' || m.done;
                const isInProgress = m.status === 'in_progress' || (!m.done && (m.percent ?? 0) > 0);
                const title = m.title || m.name || `चरण ${idx + 1}`;

                return (
                  <div
                    key={m.id || idx}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-xs sm:text-sm ${
                      isCompleted
                        ? 'bg-emerald-50/50 border-emerald-200 text-stone-800'
                        : isInProgress
                        ? 'bg-amber-50/60 border-amber-300 text-stone-800'
                        : 'bg-stone-50 border-stone-200 text-stone-500'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isInProgress ? (
                        <Hammer className="w-4 h-4 text-amber-600 animate-pulse" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-stone-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-stone-900">{title}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800'
                              : isInProgress
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          {isCompleted
                            ? 'पूर्ण'
                            : isInProgress
                            ? 'प्रगति पर'
                            : 'आगामी'}
                        </span>
                      </div>
                      {m.description && (
                        <p className="text-xs text-stone-600 mt-1">{m.description}</p>
                      )}
                      {m.completedDate && (
                        <span className="text-[10px] text-stone-400 mt-0.5 block">
                          पूर्ण: {m.completedDate}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Construction Gallery Note */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 flex items-center justify-between">
            <div className="text-xs text-stone-600">
              <span className="font-bold text-stone-800 block">प्रत्यक्ष निरीक्षण आमंत्रण:</span>
              सभी भक्तगण एवं दानदाता ग्राम गलगाँव आश्रम स्थल पर पधारकर निर्माण कार्य का साक्षात दर्शन कर सकते हैं।
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 bg-stone-100 border-t border-stone-200 flex justify-between items-center gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 font-medium rounded-xl text-stone-700 text-xs sm:text-sm transition-colors"
          >
            बंद करें
          </button>
          <button
            onClick={() => {
              onClose();
              onDonateForConstruction();
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <HeartHandshake className="w-4 h-4 text-amber-200" />
            <span>निर्माण हेतु दान दें</span>
          </button>
        </div>
      </div>
    </div>
  );
};
