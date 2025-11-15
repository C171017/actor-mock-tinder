import { useState, useEffect } from 'react';
import { translations } from '../translations';

const DEFAULT_LANGUAGE = 'zh-CN';
const SUPPORTED_LANGUAGES = ['zh-CN', 'zh-TW', 'en'];

export const useTranslation = () => {
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

  return { 
    t, 
    lang, 
    changeLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
};

