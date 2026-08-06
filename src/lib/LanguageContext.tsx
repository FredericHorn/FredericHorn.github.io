'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Lang = 'en' | 'de';

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
}>({
  lang: 'en',
  setLang: () => {},
  toggle: () => {},
});

const STORAGE_KEY = 'site-lang';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored === 'en' || stored === 'de') {
      setLangState(stored);
    } else {
      const browserLang = window.navigator.language.toLowerCase();
      if (browserLang.startsWith('de')) setLangState('de');
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
  };

  const toggle = () => setLang(lang === 'en' ? 'de' : 'en');

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
