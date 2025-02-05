"use client"

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

const SearchBar = () => {
    const { t } = useTranslation();

    return (
        <div className="relative w-full max-w-[680px] mx-auto">
            <div className="relative flex items-center">

                <Input
                    type="text"
                    placeholder={t('header.searchPlaceholder')}
                    className="w-full h-11 pl-6 pr-4 bg-whiten dark:bg-boxdark border-0 rounded-xl focus:ring-primary focus:border-0 placeholder-gray-500"
                // className="w-full h-11 pl-12 rounded-lg bg-whiten dark:bg-boxdark px-4 py-2 pl-9 pr-4 font-medium outline-none focus:ring-2 focus:ring-primary xl:w-125"
                />

                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <Search className="h-5 w-5" />
                </div>

            </div>
        </div>
    );
};

export default SearchBar;