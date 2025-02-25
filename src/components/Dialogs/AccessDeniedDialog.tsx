'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, X } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

interface AccessDeniedDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onContactSupport: () => void;
    onRegister: () => void;
}

export default function AccessDeniedDialog({
    open,
    onOpenChange,
    onContactSupport,
    onRegister
}: AccessDeniedDialogProps) {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] text-center p-6">
                <DialogHeader>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">{t('common.close')}</span>
                    </button>

                    <div className="flex flex-col items-center">
                        {/* Lock Icon */}
                        <div className="w-20 h-20 mb-4">
                            <Image
                                src="/images/login/access-denied.svg"
                                alt={t('accessDeniedDialog.accessDeniedAlt')}
                                width={80}
                                height={80}
                                className="text-red-500"
                            />
                        </div>
                        <DialogTitle className="text-2xl font-bold mb-4">
                            🔒 {t('accessDeniedDialog.title')}
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <div className="flex flex-col items-center gap-6">
                    {/* Main Message */}
                    <p className="text-center text-base">
                        {t('accessDeniedDialog.mainMessage')}
                    </p>

                    {/* Support Message */}
                    <p className="text-center text-sm italic">
                        {t('accessDeniedDialog.supportMessage')}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={onContactSupport}
                        >
                            {t('accessDeniedDialog.contactSupport')}
                        </Button>
                        <Button
                            className="w-full bg-primary hover:bg-primary/90 text-white"
                            onClick={onRegister}
                        >
                            {t('accessDeniedDialog.registerAsReseller')}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}