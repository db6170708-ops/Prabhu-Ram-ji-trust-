import React, { useState, useEffect, useRef } from 'react';
import { Globe, Check, ChevronDown, Sparkles } from 'lucide-react';

export interface SupportedLanguage {
  code: string;
  name: string;        // English name
  nativeName: string;  // Native script name
  flag: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇮🇳' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', flag: '🕉️' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', flag: '🇮🇳' },
  { code: 'gom', name: 'Konkani', nativeName: 'कोंकणी', flag: '🇮🇳' },
];

// Helper to read current googtrans cookie
export const getActiveLanguageCode = (): string => {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=\/hi\/([a-zA-Z_-]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return localStorage.getItem('prt_google_lang') || localStorage.getItem('prt_language') || 'hi';
};

export const changeGoogleTranslateLanguage = (langCode: string) => {
  localStorage.setItem('prt_google_lang', langCode);
  localStorage.setItem('prt_language', langCode);

  // Apply RTL for Urdu or Sindhi
  if (langCode === 'ur' || langCode === 'sd') {
    document.documentElement.dir = 'rtl';
  } else {
    document.documentElement.dir = 'ltr';
  }

  // Notify any mounted widgets/components
  window.dispatchEvent(new CustomEvent('prt-language-changed', { detail: langCode }));

  // Set cookie for Google Translate
  const host = window.location.hostname;
  if (langCode === 'hi') {
    document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = `googtrans=; path=/; domain=${host}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    if (host.includes('.')) {
      const rootDomain = host.split('.').slice(-2).join('.');
      document.cookie = `googtrans=; path=/; domain=.${rootDomain}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    }
  } else {
    document.cookie = `googtrans=/hi/${langCode}; path=/;`;
    document.cookie = `googtrans=/hi/${langCode}; path=/; domain=${host};`;
    if (host.includes('.')) {
      const rootDomain = host.split('.').slice(-2).join('.');
      document.cookie = `googtrans=/hi/${langCode}; path=/; domain=.${rootDomain};`;
    }
  }

  // Trigger Google Translate Combo if available
  const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
  if (selectEl) {
    if (langCode === 'hi') {
      // Restore original Hindi cleanly
      const bannerFrame = document.querySelector('.goog-te-banner-frame') as HTMLIFrameElement | null;
      const restoreBtn = bannerFrame?.contentDocument?.querySelector('#\\:1\\.restore') as HTMLElement | null;
      if (restoreBtn) {
        restoreBtn.click();
        return;
      }
      selectEl.value = '';
      selectEl.dispatchEvent(new Event('change'));
      // If page was already translated by Google Translate, reload cleanly to restore pristine Hindi
      if (document.documentElement.classList.contains('translated-ltr') || document.documentElement.classList.contains('translated-rtl')) {
        window.location.reload();
      }
      return;
    }

    selectEl.value = langCode;
    selectEl.dispatchEvent(new Event('change'));
  } else if (langCode !== 'hi') {
    // Reload page to let Google Translate initialize with the new cookie if script wasn't ready
    window.location.reload();
  }
};

interface GoogleTranslateWidgetProps {
  variant?: 'header' | 'mobile' | 'floating';
  onLanguageSelected?: (langCode: string) => void;
}

export const GoogleTranslateWidget: React.FC<GoogleTranslateWidgetProps> = ({ 
  variant = 'header',
  onLanguageSelected
}) => {
  const [selectedLang, setSelectedLang] = useState<string>('hi');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = getActiveLanguageCode();
    setSelectedLang(current);

    const handleLangSync = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setSelectedLang(customEvent.detail);
      }
    };

    // Close dropdown on outside click
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('prt-language-changed', handleLangSync);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('prt-language-changed', handleLangSync);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const changeLanguage = (langCode: string) => {
    setSelectedLang(langCode);
    setIsOpen(false);
    changeGoogleTranslateLanguage(langCode);

    if (onLanguageSelected) {
      onLanguageSelected(langCode);
    }
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];

  return (
    <div ref={dropdownRef} className="relative inline-block text-left notranslate">
      {/* Dropdown Toggle Button Styled in Sacred Theme */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#08241b] hover:bg-[#0d3b2c] border border-amber-400/50 text-amber-200 hover:text-white text-xs font-semibold shadow-xs transition-all cursor-pointer group"
        title="17 भाषाओं में अनुवाद (Translate in 17 Languages)"
        aria-label="Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-45 transition-transform" />
        <span className="font-medium text-amber-100">{currentLangObj.nativeName}</span>
        <span className="text-[10px] text-amber-300/80 font-mono hidden sm:inline">({currentLangObj.code.toUpperCase()})</span>
        <ChevronDown className={`w-3.5 h-3.5 text-amber-400/80 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* 17 Languages Custom Menu Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-[#08241b]/98 backdrop-blur-md border-2 border-amber-400/60 shadow-2xl z-50 overflow-hidden animate-slide-up-fade">
          
          {/* Header */}
          <div className="px-4 py-2.5 bg-gradient-to-r from-[#041610] to-[#08241b] border-b border-amber-400/30 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>17 भाषाएं (Google Translate)</span>
            </span>
            <span className="text-[10px] text-emerald-300/80">
              100% संपूर्ण पृष्ठ अनुवाद
            </span>
          </div>

          {/* Languages Grid */}
          <div className="p-2 max-h-80 overflow-y-auto divide-y divide-emerald-950/40 space-y-1">
            <div className="grid grid-cols-2 gap-1">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = selectedLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                        : 'text-stone-200 hover:bg-emerald-900/60 hover:text-amber-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-sm shrink-0">{lang.flag}</span>
                      <div className="truncate">
                        <div className="font-semibold leading-tight truncate">{lang.nativeName}</div>
                        <div className={`text-[10px] ${isSelected ? 'text-stone-800' : 'text-stone-400'}`}>
                          {lang.name}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-stone-950 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Notice */}
          <div className="px-3 py-2 bg-[#041610] border-t border-emerald-950/60 text-[10px] text-stone-300 text-center">
            किसी भी भाषा पर क्लिक करते ही पूरी वेबसाइट तुरंत अनुवादित हो जाएगी।
          </div>

        </div>
      )}
    </div>
  );
};
