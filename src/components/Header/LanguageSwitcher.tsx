import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        setMenuOpen(false);
    };

    return (
        <div className="relative flex items-center">
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="focus:outline-none"
                aria-label="Toggle language menu"
            >
                <FaGlobe className="w-6 h-6 text-gray-500 dark:text-white" />
            </button>
            {menuOpen && (
                <div className="absolute top-full mt-2 w-32 bg-white dark:bg-boxdark rounded-md shadow-lg">
                    <ul className="py-1">
                        <li>
                            <button
                                onClick={() => changeLanguage('en')}
                                className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                English
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => changeLanguage('zh')}
                                className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                中文
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;