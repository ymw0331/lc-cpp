"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/useToast";
import { useTranslation } from "react-i18next";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

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
            description: t("referralCard.copiedToClipboardDescription"),
            duration: 3000,
        });
    };

    return (
        <Card className="border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <CardHeader className="p-6 pb-0">
                <CardTitle className="text-xl font-bold text-black dark:text-white">
                    {t("referralCard.referralCodeLabel")}
                </CardTitle>
                <CardDescription className="text-body dark:text-bodydark mt-1">
                    {t("referralCard.description")}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-4">
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
            </CardContent>
        </Card>
    );
};

export default ReferralCard;