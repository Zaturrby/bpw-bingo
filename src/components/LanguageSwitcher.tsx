import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'nl' ? 'en' : 'nl';
    i18n.changeLanguage(newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-10 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-colors duration-200 text-sm"
      aria-label="Switch language"
    >
      {i18n.language === 'nl' ? '🇬🇧 EN' : '🇳🇱 NL'}
    </button>
  );
}