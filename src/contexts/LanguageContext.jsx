import { createContext, useContext, useState, useCallback } from 'react';
import tr from '../i18n/tr.json';
import en from '../i18n/en.json';

const languages = { tr, en };
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('byglobal_lang') || 'en');

  const switchLanguage = useCallback((newLang) => {
    setLang(newLang);
    localStorage.setItem('byglobal_lang', newLang);
    document.documentElement.lang = newLang;
  }, []);

  const t = useCallback((path, params = {}) => {
    const keys = path.split('.');
    let value = languages[lang];
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) return path;
    }
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      return Object.entries(params).reduce(
        (str, [k, v]) => str.replace(`{${k}}`, v), value
      );
    }
    return value || path;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}

export default LanguageContext;
