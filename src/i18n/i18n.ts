import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en.json';
import zhSimplifiedTranslation from './locales/zh.json';
import zhTraditionalTranslation from './locales/zh-hk.json';
i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enTranslation,
            },
            zh: {
                translation: zhSimplifiedTranslation,
            },
            'zh-HK': {
                translation: zhTraditionalTranslation,
            },
        },
        lng: 'en',
        fallbackLng: 'en',
        supportedLngs: ['en', 'zh', 'zh-HK'],
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;