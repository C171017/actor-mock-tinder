import { useTranslation } from '../hooks/useTranslation';
import './ControlBar.css';

const ControlBar = ({ likedCount, passedCount }) => {
  const { t, lang, changeLanguage, supportedLanguages } = useTranslation();

  const languageNames = {
    'zh-CN': '简体中文',
    'zh-TW': '繁體中文',
    'en': 'English',
  };

  return (
    <div className="control-bar">
      <div className="control-bar-stats">
        <span className="liked-count">{t('liked')} {likedCount}</span>
        <span className="passed-count">{t('passed')} {passedCount}</span>
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
      </div>
    </div>
  );
};

export default ControlBar;

