import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import nlTranslations from './locales/nl.json';
import enTranslations from './locales/en.json';

const resources = {
  nl: {
    translation: nlTranslations,
  },
  en: {
    translation: enTranslations,
  },
};

// Get language from URL path or default to 'nl'
const getLanguageFromPath = (): string => {
  if (typeof window === 'undefined') return 'nl';
  const path = window.location.pathname;
  const match = path.match(/^\/(en|nl)/);
  return match ? match[1] : 'nl';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getLanguageFromPath(),
    fallbackLng: 'nl',
    debug: false,

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;