import React from 'react';
import { Clock, RefreshCw } from 'lucide-react';
import { useTimeTheme, TimeThemePreference } from '../utils/useTimeTheme';

export const TimeThemeCard: React.FC = () => {
  const { mode, preference, greeting, themeStatus, timeDisplay, setPreference } = useTimeTheme();

  const options: { id: TimeThemePreference; label: string }[] = [
    { id: 'auto', label: 'स्वतः (Auto)' },
    { id: 'morning-mode', label: '☀️ सुबह' },
    { id: 'afternoon-mode', label: '🌤️ दोपहर' },
    { id: 'evening-mode', label: '🌇 शाम' },
    { id: 'night-mode', label: '🌙 रात' },
  ];

  return (
    <div
      className={`w-full max-w-4xl mx-auto mb-6 rounded-2xl p-4 sm:p-5 border shadow-lg transition-all duration-700 ${
        mode === 'morning-mode'
          ? 'bg-[#FFF8E7] text-[#333333] border-[#E8D5A3]'
          : mode === 'afternoon-mode'
          ? 'bg-[#E0F7FA] text-[#004D40] border-[#80DEEA]'
          : mode === 'evening-mode'
          ? 'bg-[#FFE0B2] text-[#4E342E] border-[#FFB74D]'
          : 'bg-[#1E1E1E] text-[#E0E0E0] border-stone-700'
      }`}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Live Greeting, Time & Theme Status */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 text-center sm:text-left">
          <div
            className={`px-4 py-2.5 rounded-xl border shadow-xs transition-colors duration-700 ${
              mode === 'morning-mode'
                ? 'bg-white border-amber-200 text-[#333333]'
                : mode === 'afternoon-mode'
                ? 'bg-white border-cyan-200 text-[#004D40]'
                : mode === 'evening-mode'
                ? 'bg-[#FFF3E0] border-orange-300 text-[#4E342E]'
                : 'bg-[#121212] border-stone-700 text-[#E0E0E0]'
            }`}
          >
            <div className="font-heading text-lg sm:text-xl font-bold leading-snug">
              {greeting}
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs sm:text-sm font-medium mt-0.5 tabular-nums">
              <Clock className="w-3.5 h-3.5 opacity-80 shrink-0" />
              <span>वर्तमान समय: {timeDisplay}</span>
            </div>
          </div>

          <div>
            <p className="text-xs sm:text-sm font-bold">{themeStatus}</p>
            <p className="text-[11px] sm:text-xs opacity-80 mt-0.5">
              {preference === 'auto'
                ? 'वेबसाइट का रंग आपके समय (सुबह, दोपहर, शाम, रात) के अनुसार स्वतः बदलता है'
                : 'चयनित समय थीम सक्रिय है (ऑटो मोड से समय अनुसार चलेगी)'}
            </p>
          </div>
        </div>

        {/* Manual / Auto Theme Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 shrink-0">
          {options.map((opt) => {
            const isActive = preference === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPreference(opt.id)}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                  isActive
                    ? mode === 'night-mode'
                      ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-xs'
                      : 'bg-[#0f4d3a] text-white border-[#0f4d3a] shadow-xs'
                    : mode === 'night-mode'
                    ? 'bg-stone-800/90 text-stone-200 border-stone-700 hover:bg-stone-700'
                    : 'bg-white/80 text-stone-800 border-black/10 hover:bg-white'
                }`}
              >
                {opt.id === 'auto' && <RefreshCw className="w-3 h-3" />}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
