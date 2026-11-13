import React, { useState } from 'react';
import { SUPPORTED_LANGUAGES_17, LanguageOption } from '../utils/translations';
import { changeGoogleTranslateLanguage } from './GoogleTranslateWidget';
import { X, Search, Check, Globe } from 'lucide-react';

interface LanguageModalProps {
  isOpen: boolean;
  currentLanguage: string;
  onSelectLanguage: (lang: any) => void;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  currentLanguage,
  onSelectLanguage,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredLanguages = SUPPORTED_LANGUAGES_17.filter((item) => {
    const term = searchTerm.toLowerCase().trim();
    return (
      item.name.toLowerCase().includes(term) ||
      item.nativeName.toLowerCase().includes(term) ||
      item.code.toLowerCase().includes(term)
    );
  });

  const handleChoose = (code: string) => {
    changeGoogleTranslateLanguage(code);
    onSelectLanguage(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0f4d3a] to-[#165a44] p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Globe className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                भाषा चुनें (Select Language)
              </h3>
              <p className="text-xs text-amber-200/90">
                17 भारतीय एवं प्रादेशिक भाषाएं (17 Languages Supported)
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

        {/* Search Input */}
        <div className="p-4 border-b border-stone-200 bg-stone-50 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="भाषा खोजें (उदा. हिन्दी, English, ગુજરાતી, मराठी, தமிழ்)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f4d3a] focus:border-transparent"
              autoFocus
            />
          </div>
        </div>

        {/* Language Grid */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredLanguages.map((item: LanguageOption) => {
              const isSelected = item.code === currentLanguage;
              return (
                <button
                  key={item.code}
                  onClick={() => handleChoose(item.code)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#0f4d3a] bg-emerald-50 text-[#0f4d3a] font-bold shadow-xs'
                      : 'border-stone-200 hover:border-amber-400 hover:bg-stone-50 text-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img" aria-label={item.name}>
                      {item.flag}
                    </span>
                    <div>
                      <div className="text-sm font-semibold flex items-center gap-1.5">
                        <span>{item.nativeName}</span>
                        {item.dir === 'rtl' && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-stone-100 rounded text-stone-500">
                            RTL
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-stone-500">
                        {item.name}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#0f4d3a] text-white flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {filteredLanguages.length === 0 && (
            <div className="text-center py-8 text-stone-500 text-sm">
              कोई भाषा नहीं मिली। (No matching language found.)
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 text-center text-xs text-stone-500 shrink-0">
          चयनित भाषा में पूरी वेबसाइट, रसीद प्रणाली व सभी अनुभाग तुरंत अनुवादित हो जाएंगे।
        </div>
      </div>
    </div>
  );
};
