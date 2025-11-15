import { useTranslation } from '../hooks/useTranslation';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { lang, changeLanguage, supportedLanguages } = useTranslation();

  const languageNames = {
    'zh-CN': '简体中文',
    'zh-TW': '繁體中文',
    'en': 'English',
  };

  return (
    <div className="language-switcher">
      <select 
        value={lang} 
        onChange={(e) => changeLanguage(e.target.value)}
        className="language-select"
        aria-label="Select language"
      >
        {supportedLanguages.map(language => (
          <option key={language} value={language}>
            {languageNames[language]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;

