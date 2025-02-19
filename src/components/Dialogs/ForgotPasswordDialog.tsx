"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LockIcon, X } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface ForgotPasswordDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ForgotPasswordDialog = ({
    open,
    onOpenChange,
}: ForgotPasswordDialogProps) => {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="absolute right-4 top-4">
                        <button
                            onClick={() => onOpenChange(false)}
                            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">{t("forgotPasswordDialog.close")}</span>
                        </button>
                    </div>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mx-auto mb-4"
                    >
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <LockIcon className="text-red-500 w-8 h-8" />
                            {/* <DotLottieReact
                                className="w-16 h-16"
                                src="/images/login/forgot-password.json"
                                autoplay
                            /> */}
                        </div>
                    </motion.div>

                    <DialogTitle className="text-center text-2xl font-semibold">
                        {t("forgotPasswordDialog.forgotPassword")}
                    </DialogTitle>
                </DialogHeader>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col items-center space-y-4 px-1"
                >
                    <p className="text-center text-gray-600">
                        {t("forgotPasswordDialog.passwordResetUnavailable")}
                        <br />
                        {t("forgotPasswordDialog.communityPartnershipProgramPortal")}
                    </p>

                    <p className="text-center text-gray-600">
                        {t("forgotPasswordDialog.toResetYourCredentials")}
                        <br />
                        {t("forgotPasswordDialog.useLookCardApp")}
                    </p>

                    <Button
                        onClick={() => onOpenChange(false)}
                        className="w-full bg-[#E31C5F] hover:bg-[#c4164f] text-white py-6 text-lg rounded-xl transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {t("forgotPasswordDialog.backToLogin")}
                    </Button>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
};

export default ForgotPasswordDialog;
