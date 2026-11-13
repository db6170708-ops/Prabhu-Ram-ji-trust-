import { useState, useEffect, useCallback } from 'react';

export type TimeThemeMode = 'morning-mode' | 'afternoon-mode' | 'evening-mode' | 'night-mode';
export type TimeThemePreference = 'auto' | TimeThemeMode;

export interface TimeThemeState {
  mode: TimeThemeMode;
  preference: TimeThemePreference;
  greeting: string;
  emoji: string;
  themeStatus: string;
  timeDisplay: string;
  bgHex: string;
  cardHex: string;
  textHex: string;
}

const PREF_STORAGE_KEY = 'prt_time_theme_pref';
const THEME_EVENT = 'prt-time-theme-changed';

export function resolveModeForHour(hour: number): TimeThemeMode {
  if (hour >= 6 && hour < 12) return 'morning-mode';
  if (hour >= 12 && hour < 17) return 'afternoon-mode';
  if (hour >= 17 && hour < 20) return 'evening-mode';
  return 'night-mode';
}

export function getThemeMetadata(mode: TimeThemeMode) {
  switch (mode) {
    case 'morning-mode':
      return {
        greeting: 'सुप्रभात! ☀️',
        emoji: '☀️',
        themeStatus: 'थीम: सुबह (हल्का पीला)',
        shortLabel: 'सुबह',
        bgHex: '#FFF8E7',
        cardHex: '#FFFFFF',
        textHex: '#333333',
      };
    case 'afternoon-mode':
      return {
        greeting: 'नमस्कार! 🌤️',
        emoji: '🌤️',
        themeStatus: 'थीम: दोपहर (हल्का नीला)',
        shortLabel: 'दोपहर',
        bgHex: '#E0F7FA',
        cardHex: '#FFFFFF',
        textHex: '#004D40',
      };
    case 'evening-mode':
      return {
        greeting: 'शुभ संध्या! 🌇',
        emoji: '🌇',
        themeStatus: 'थीम: शाम (नारंगी/सुनहरा)',
        shortLabel: 'शाम',
        bgHex: '#FFE0B2',
        cardHex: '#FFF3E0',
        textHex: '#4E342E',
      };
    case 'night-mode':
    default:
      return {
        greeting: 'शुभ रात्रि! 🌙',
        emoji: '🌙',
        themeStatus: 'थीम: रात (डार्क मोड)',
        shortLabel: 'रात',
        bgHex: '#121212',
        cardHex: '#1E1E1E',
        textHex: '#E0E0E0',
      };
  }
}

export function applyTimeThemeToDocument(mode: TimeThemeMode) {
  const body = document.body;
  const html = document.documentElement;
  body.classList.remove('morning-mode', 'afternoon-mode', 'evening-mode', 'night-mode');
  body.classList.add(mode);

  if (mode === 'night-mode') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
}

function getStoredPreference(): TimeThemePreference {
  try {
    const raw = localStorage.getItem(PREF_STORAGE_KEY);
    if (
      raw === 'auto' ||
      raw === 'morning-mode' ||
      raw === 'afternoon-mode' ||
      raw === 'evening-mode' ||
      raw === 'night-mode'
    ) {
      return raw;
    }
  } catch {
    // ignore storage failures
  }
  return 'auto';
}

export function setGlobalTimeThemePreference(pref: TimeThemePreference) {
  try {
    localStorage.setItem(PREF_STORAGE_KEY, pref);
  } catch {
    // ignore storage failures
  }
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: pref }));
}

export function useTimeTheme() {
  const computeState = useCallback((pref: TimeThemePreference): TimeThemeState => {
    const now = new Date();
    const hour = now.getHours();
    const mode = pref === 'auto' ? resolveModeForHour(hour) : pref;
    const meta = getThemeMetadata(mode);

    return {
      mode,
      preference: pref,
      greeting: meta.greeting,
      emoji: meta.emoji,
      themeStatus: meta.themeStatus,
      timeDisplay: now.toLocaleTimeString('hi-IN'),
      bgHex: meta.bgHex,
      cardHex: meta.cardHex,
      textHex: meta.textHex,
    };
  }, []);

  const [preference, setPreferenceState] = useState<TimeThemePreference>(() => getStoredPreference());
  const [themeState, setThemeState] = useState<TimeThemeState>(() => computeState(getStoredPreference()));

  const setPreference = useCallback((nextPref: TimeThemePreference) => {
    setPreferenceState(nextPref);
    setGlobalTimeThemePreference(nextPref);
  }, []);

  useEffect(() => {
    const syncAndApply = () => {
      const next = computeState(preference);
      setThemeState(next);
      applyTimeThemeToDocument(next.mode);
    };

    syncAndApply();
    const timer = window.setInterval(syncAndApply, 1000);

    const handleCustomEvent = (e: Event) => {
      const nextPref = (e as CustomEvent<TimeThemePreference>).detail;
      if (nextPref) {
        setPreferenceState(nextPref);
        const next = computeState(nextPref);
        setThemeState(next);
        applyTimeThemeToDocument(next.mode);
      }
    };

    window.addEventListener(THEME_EVENT, handleCustomEvent);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener(THEME_EVENT, handleCustomEvent);
    };
  }, [preference, computeState]);

  return {
    ...themeState,
    setPreference,
  };
}
