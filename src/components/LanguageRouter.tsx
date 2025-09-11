import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import App from '../App';

function LanguageWrapper() {
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  useEffect(() => {
    const validLanguages = ['en', 'nl'];
    const currentLang = lang || 'nl';
    
    // Validate language and redirect if invalid
    if (!validLanguages.includes(currentLang)) {
      navigate('/nl', { replace: true });
      return;
    }

    // Update i18n language if it differs from URL
    if (i18n.language !== currentLang) {
      i18n.changeLanguage(currentLang);
    }
  }, [lang, i18n, navigate]);

  return <App />;
}

export function LanguageRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:lang" element={<LanguageWrapper />} />
        <Route path="/" element={<Navigate to="/nl" replace />} />
        <Route path="*" element={<Navigate to="/nl" replace />} />
      </Routes>
    </BrowserRouter>
  );
}