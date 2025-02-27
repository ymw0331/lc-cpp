"use client";

import Image from "next/image";
import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/useToast";
import { useTranslation } from "react-i18next";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";

interface ProfileWithReferralCardProps {
    name: string;
    level: string;
    activeUsers: {
        current: number;
        target: number;
        percentage: number;
        remaining: number;
    };
    referralCode: string;
    avatar?: string;
    className?: string;
}

const ProfileWithReferralCard = ({
    name,
    level,
    activeUsers,
    referralCode,
    avatar,
    className = "",
}: ProfileWithReferralCardProps) => {
    const [copied, setCopied] = useState(false);
    const { t } = useTranslation();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);

        toast({
            title: t("profileWithReferralCard.copiedToClipboard"),
            description: t("profileWithReferralCard.copiedToClipboardDescription"),
            duration: 3000,
        });
    };

    return (
        <Card className={`border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark h-full ${className}`}>
            <CardHeader className="p-6 pb-0">
                {/* Responsive Header Layout - Stack on mobile, side by side on desktop */}
                <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-start md:space-y-0">
                    {/* Left Side - Profile Info - Row layout on all devices */}
                    <div className="flex items-start">
                        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#F3F3F3] dark:bg-meta-4 overflow-hidden">
                            {avatar ? (
                                <Image src={avatar} alt={name} className="w-full h-full object-cover" width={80} height={80} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xl md:text-2xl font-bold text-[#7C74FF]">
                                    {name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="ml-4">
                            <h2 className="text-xl md:text-2xl font-bold text-black dark:text-white">{name}</h2>
                            <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 mt-1">Level {level}</p>
                        </div>
                    </div>

                    {/* Right Side - Referral Code - Full width on mobile */}
                    <div className="w-full md:w-auto">
                        <motion.div
                            onClick={copyToClipboard}
                            className="bg-primary hover:bg-primary/90 transition-colors rounded-lg p-3 md:p-4 flex justify-between items-center gap-2 cursor-pointer w-full md:w-auto"
                            whileTap={{ scale: 0.97 }}
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <span className="text-base md:text-lg font-medium text-white">{referralCode}</span>
                            <AnimatePresence mode="wait">
                                {copied ? (
                                    <motion.div
                                        key="check"
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.5, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <CheckIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="copy"
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.5, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <CopyIcon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4 md:p-6">
                {/* Users Count Section - Responsive Text Sizes */}
                <div className="mt-6 md:mt-8">
                    <div className="flex items-center gap-2">
                        <span className="text-3xl md:text-4xl font-bold text-black dark:text-white">
                            {activeUsers.current.toLocaleString()}
                        </span>
                        <span className="text-xl md:text-2xl text-body dark:text-bodydark">
                            / {activeUsers.target.toLocaleString()} {t("profileWithReferralCard.activeUsersLabel")}
                        </span>
                    </div>
                </div>

                {/* Progress Section */}
                <div className="mt-3 md:mt-4 flex items-center gap-3 md:gap-4">
                    <div className="flex-1 h-2 md:h-2.5 bg-black/10 dark:bg-meta-4 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-chart-primary rounded-full transition-all duration-300 ease-in-out"
                            style={{ width: `${activeUsers.percentage}%` }}
                        />
                    </div>

                    <span className="text-xl md:text-2xl font-bold text-chart-primary">
                        {activeUsers.percentage}%
                    </span>
                </div>

                {/* Remaining Count - Responsive Text and Wrapping */}
                <div className="mt-3 md:mt-4 flex flex-wrap items-center">
                    <span className="text-xl md:text-2xl font-bold text-black dark:text-white">
                        {activeUsers.remaining.toLocaleString()}
                    </span>
                    <span className="text-base md:text-lg text-body dark:text-bodydark ml-2">
                        {t("profileWithReferralCard.left")}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProfileWithReferralCard;