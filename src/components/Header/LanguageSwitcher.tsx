"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';
import ClickOutside from '@/components/ClickOutside';
import { toast } from '@/hooks/useToast';

const LanguageSwitcher: React.FC = () => {
    const { i18n, t } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState(localStorage.getItem('preferredLanguage') || 'en');

    useEffect(() => {
        // Initialize with stored preference
        const storedLang = localStorage.getItem('preferredLanguage');
        if (storedLang) {
            setCurrentLang(storedLang);
            i18n.changeLanguage(storedLang);
        }
    }, [i18n]);

    const changeLanguage = async (lang: string) => {
        try {
            // Update local state
            setCurrentLang(lang);

            // Update localStorage
            localStorage.setItem('preferredLanguage', lang);

            // Update i18n
            await i18n.changeLanguage(lang);

            toast({
                title: t('preferences.language.changed'),
                description: t('preferences.language.restart'),
                duration: 3000,
            });
        } catch (error) {
            console.error('Failed to update language preference:', error);
            toast({
                title: t('preferences.error.title'),
                description: t('preferences.error.description'),
                variant: "destructive",
                duration: 3000,
            });
        } finally {
            setMenuOpen(false);
        }
    };

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'zh', label: '简体中文' },
        { code: 'zh-hk', label: '繁體中文' }
    ];

    return (
        <ClickOutside
            onClick={() => setMenuOpen(false)}
            className="relative flex items-center"
        >
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle language menu"
            >
                <FaGlobe className="w-5 h-5 text-gray-500 dark:text-white" />
                <span className="text-sm font-medium text-gray-700 dark:text-white">
                    {languages.find(lang => lang.code === currentLang)?.label}
                </span>
            </button>

            {menuOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-boxdark rounded-lg shadow-lg border border-stroke dark:border-strokedark animate-in fade-in-0 zoom-in-95">
                    <ul className="py-1">
                        {languages.map((lang) => (
                            <li key={lang.code}>
                                <button
                                    onClick={() => changeLanguage(lang.code)}
                                    className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                                        ${currentLang === lang.code
                                            ? 'text-primary bg-primary/5 dark:bg-primary/10'
                                            : 'text-gray-700 dark:text-white'}`}
                                >
                                    {/* <span className="mr-2">{lang.flag}</span> */}
                                    {lang.label}
                                    {currentLang === lang.code && (
                                        <span className="ml-auto text-primary">✓</span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </ClickOutside>
    );
};

export default LanguageSwitcher;