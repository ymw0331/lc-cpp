'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import LanguageSwitcher from '@/components/Header/LanguageSwitcher';

interface MembershipConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRegister: () => void;
    onProceed: () => void;
}

const MembershipConfirmationDialog: React.FC<MembershipConfirmationDialogProps> = ({
    open,
    onOpenChange,
    onRegister,
    onProceed
}) => {
    const { t } = useTranslation();

    // Custom handler for dialog close attempts
    const handleOpenChange = (newOpenState: boolean) => {
        // Only allow closing if explicitly set to false by the buttons
        // Prevent closing by clicking outside or pressing Escape
        if (newOpenState === false) {
            return; // Do nothing, don't close the dialog
        }

        // Otherwise, pass through the open state change
        onOpenChange(newOpenState);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()} closeIcon={false}>
                <DialogHeader className='pt-8'>
                    {/* Language Switcher - Top Left */}
                    <div className="absolute right-4 top-4 z-10">
                        <LanguageSwitcher />
                    </div>

                    <DialogTitle className="text-center font-semibold">
                        {t("membershipDialog.title", "Confirm Your lookcard.io Platform Membership")}
                    </DialogTitle>
                </DialogHeader>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col space-y-6 px-1"
                >
                    <h3 className="text-lg font-semibold text-center dark:text-gray-250">
                        {t("membershipDialog.question", "Are you a registered user of lookcard.io platform?")}
                    </h3>

                    <ul className="space-y-4">
                        <li className="flex items-start gap-2">
                            <span className="text-xl mt-0.5">•</span>
                            <div className="text-gray-600 dark:text-gray-300">
                                <span className="font-semibold">{t("membershipDialog.ifNo", "If NO")},</span> {t("membershipDialog.noDescription", "kindly register for a user account to be onboard as Reseller.")}
                            </div>
                        </li>

                        <li className="flex items-start gap-2">
                            <span className="text-xl mt-0.5">•</span>
                            <div className="text-gray-600 dark:text-gray-300">
                                <span className="font-semibold">{t("membershipDialog.ifYes", "If YES")},</span> {t("membershipDialog.yesDescription", "please proceed with Community Partnership Onboarding;")}
                            </div>
                        </li>
                    </ul>

                    <div className="flex flex-col gap-4 pt-2">
                        <Button
                            onClick={() => {
                                onRegister();
                                onOpenChange(false);
                            }}
                            className="flex-1 py-6 bg-black hover:bg-gray-800 text-white"
                        >
                            {t("membershipDialog.registerButton", "NO, Register for User Account")}
                        </Button>
                        <Button
                            onClick={() => {
                                onProceed();
                                onOpenChange(false);
                            }}
                            className="flex-1 py-6 bg-[#E31C5F] hover:bg-[#c4164f] text-white"
                        >
                            {t("membershipDialog.proceedButton", "YES, Proceed to Agent Onboarding")}
                        </Button>
                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
};

export default MembershipConfirmationDialog;