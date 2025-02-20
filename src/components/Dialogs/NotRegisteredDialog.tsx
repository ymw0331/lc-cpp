'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface NotRegisteredDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onBecomeAgent: () => void;
}

export default function NotRegisteredDialog({
    open,
    onOpenChange,
    onBecomeAgent
}: NotRegisteredDialogProps) {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="absolute right-4 top-4">
                        <button
                            onClick={() => onOpenChange(false)}
                            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">{t("common.close")}</span>
                        </button>
                    </div>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mx-auto mb-4"
                    >
                        <div className="w-20 h-20 flex items-center justify-center">
                            <Image
                                src="/images/login/not-registered.svg"
                                alt={t("notRegisteredDialog.imageAlt")}
                                width={50}
                                height={50}
                            />
                        </div>
                    </motion.div>

                    <DialogTitle className="text-center text-2xl font-semibold">
                        {t("notRegisteredDialog.title")}
                    </DialogTitle>
                </DialogHeader>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col items-center space-y-4 px-1"
                >
                    <p className="text-center text-gray-600">
                        {t("notRegisteredDialog.noAccess")}
                    </p>

                    <p className="text-center text-gray-600">
                        {t("notRegisteredDialog.benefits")}
                        <span className="font-bold">
                            {t("notRegisteredDialog.referralAmount")}
                        </span>
                        {t("notRegisteredDialog.callToAction")}
                    </p>

                    <Button
                        onClick={onBecomeAgent}
                        className="w-full bg-[#E31C5F] hover:bg-[#c4164f] text-white"
                    >
                        {t("notRegisteredDialog.becomeAgent")}
                    </Button>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}