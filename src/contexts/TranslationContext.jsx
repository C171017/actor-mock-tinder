import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations';

const TranslationContext = createContext();

const DEFAULT_LANGUAGE = 'zh-CN';
const SUPPORTED_LANGUAGES = ['zh-CN', 'zh-TW', 'en'];

export const TranslationProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    // Try to get from localStorage, fallback to default
    const saved = localStorage.getItem('language');
    return saved && SUPPORTED_LANGUAGES.includes(saved) ? saved : DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    // Save to localStorage whenever language changes
    localStorage.setItem('language', lang);
  }, [lang]);

  const t = (key, params = {}) => {
    let text = translations[lang]?.[key] || translations[DEFAULT_LANGUAGE]?.[key] || key;
    
    // Replace placeholders like {{count}}
    Object.keys(params).forEach(param => {
      text = text.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
    });
    
    return text;
  };

  const changeLanguage = (newLang) => {
    if (SUPPORTED_LANGUAGES.includes(newLang)) {
      setLang(newLang);
    }
  };

  return (
    <TranslationContext.Provider
      value={{
        t,
        lang,
        changeLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

