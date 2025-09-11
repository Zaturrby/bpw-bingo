import { useNavigate, useParams, useLocation } from 'react-router-dom';

export function LanguageSwitcher() {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();

  const toggleLanguage = () => {
    const currentLang = lang || 'nl';
    const newLanguage = currentLang === 'nl' ? 'en' : 'nl';
    
    // Replace the language in the current path
    const currentPath = location.pathname;
    const pathWithoutLang = currentPath.replace(`/${currentLang}`, '');
    const newPath = `/${newLanguage}${pathWithoutLang}`;
    
    navigate(newPath, { replace: true });
  };

  const currentLang = lang || 'nl';

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-10 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-colors duration-200 text-sm"
      aria-label="Switch language"
    >
      {currentLang === 'nl' ? '🇬🇧 EN' : '🇳🇱 NL'}
    </button>
  );
}