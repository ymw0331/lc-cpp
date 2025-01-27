import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import your translation files
import enTranslation from './locales/en.json';
import zhTranslation from './locales/zh.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enTranslation,
            },
            zh: {
                translation: zhTranslation,
            },
        },
        lng: 'en', // default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;