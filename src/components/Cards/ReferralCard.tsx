"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/useToast";
import { useTranslation } from "react-i18next";

interface ReferralCardProps {
    code: string;
}

const ReferralCard = ({ code }: ReferralCardProps) => {
    const [copied, setCopied] = useState(false);
    const { t } = useTranslation();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);

        toast({
            title: t("referralCard.copiedToClipboard"),
        });
    };

    return (
        <div className="relative p-6 bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark">
            <h3 className="text-xl font-bold text-black dark:text-white mb-4">
                {t("referralCard.referralCodeLabel")}
            </h3>
            <motion.div
                onClick={copyToClipboard}
                className="bg-primary hover:bg-primary/90 transition-colors rounded-lg p-4 flex justify-between items-center cursor-pointer"
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
                <span className="text-lg font-medium text-white">{code}</span>
                <AnimatePresence mode="wait">
                    {copied ? (
                        <motion.div
                            key="check"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <CheckIcon className="w-6 h-6 text-white" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="copy"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <CopyIcon className="w-6 h-6 text-white" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default ReferralCard;
