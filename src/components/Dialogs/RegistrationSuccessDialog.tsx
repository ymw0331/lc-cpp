'use client';

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

interface RegistrationSuccessDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDone: () => void;
}

export default function RegistrationSuccessDialog({
    open,
    onOpenChange,
    onDone
}: RegistrationSuccessDialogProps) {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] text-center p-6">
                <div className="flex flex-col items-center gap-6">
                    {/* Success Icon */}
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-12 h-12 text-white" />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-semibold">
                        {t("registerPage.thankYou")}
                    </h2>

                    {/* Message */}
                    <div className="space-y-4 text-center">
                        <p className="text-gray-600">
                            {t("registerPage.receivedSubmission")}
                        </p>
                        <p className="text-gray-600">
                            {t("registerPage.confirmationEmail")}
                            <span className="text-gray-500">
                                {t("registerPage.withinDays")}
                            </span>
                        </p>
                    </div>

                    {/* Done Button */}
                    <Button
                        onClick={onDone}
                        className="w-full bg-[#E31C5F] hover:bg-[#c4164f] text-white"
                    >
                        {t("registerPage.done")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}