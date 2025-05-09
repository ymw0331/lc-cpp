"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/useToast";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { createShortInviteUrl } from "@/lib/url-utils";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

const RecruitAgentCard = () => {
    const [copied, setCopied] = useState(false);
    const { t } = useTranslation();
    const { user } = useAuth();
    const [baseUrl, setBaseUrl] = useState('');

    // Get the base URL dynamically when component mounts
    useEffect(() => {
        const currentDomain = typeof window !== 'undefined'
            ? `${window.location.protocol}//${window.location.host}`
            : '';
        setBaseUrl(currentDomain);
    }, []);

    // Create the recruitment URL with tracking parameters
    const referralCode = user?.referralCode || '';
    const upstreamId = user?.resellerId || '';

    // Generate both the full URL and the shortened URL
    const fullRecruitAgentUrl = baseUrl
        ? `${baseUrl}/invite?referralCode=${referralCode}&upstreamId=${upstreamId}`
        : '';

    // Create shortened URL if both values are available, otherwise use full URL
    const recruitAgentUrl = baseUrl && referralCode && upstreamId
        ? createShortInviteUrl(baseUrl, referralCode, upstreamId)
        : fullRecruitAgentUrl;

    const copyToClipboard = () => {
        // Always copy the shortened URL if available, fallback to full URL
        navigator.clipboard.writeText(recruitAgentUrl || fullRecruitAgentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);

        toast({
            title: t("recruitAgentCard.copiedToClipboard", "Copied to clipboard"),
            description: t("recruitAgentCard.copiedToClipboardDescription", "Recruit agent link has been copied to clipboard"),
            duration: 3000,
        });
    };

    return (
        <Card className="border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <CardHeader className="p-6 pb-0">
                <CardTitle className="text-xl font-bold text-black dark:text-white">
                    {t("recruitAgentCard.recruitAgentLabel", "Recruit Agent")}
                </CardTitle>
                <CardDescription className="text-body dark:text-bodydark mt-1">
                    {t("recruitAgentCard.description", "Grow your network! Share this Reseller ID link to onboard new agents")}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-4">
                <motion.div
                    onClick={copyToClipboard}
                    className="bg-primary hover:bg-primary/90 transition-colors rounded-lg p-4 flex justify-between items-center cursor-pointer"
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    <span className="text-lg font-medium text-white truncate pr-2">
                        {recruitAgentUrl || fullRecruitAgentUrl}
                    </span>
                    <AnimatePresence mode="wait">
                        {copied ? (
                            <motion.div
                                key="check"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <CheckIcon className="w-6 h-6 text-white flex-shrink-0" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="copy"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <CopyIcon className="w-6 h-6 text-white flex-shrink-0" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </CardContent>
        </Card>
    );
};

export default RecruitAgentCard;