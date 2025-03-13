// components/Dialogs/TermsAgreementDialog.tsx

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface TermsAgreementDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const TermsAgreementDialog: React.FC<TermsAgreementDialogProps> = ({
    open,
    onOpenChange
}) => {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader className="mb-2">
                    <DialogTitle className="text-xl font-bold">
                        {t("termsDialog.title") || "ACKNOWLEDGMENT"}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-2 text-black dark:text-white text-base leading-relaxed">
                    <p className="my-4">
                        {t("termsDialog.terms") || "By submitting this registration form, I confirm that the information provided is true, accurate, and complete. I agree to comply with the LookCard Community Partnership Program terms and conditions and understand that my participation is subject to approval."}
                    </p>
                    <p className="my-4">
                        {t("termsDialog.termsAdditional1") || "I acknowledge that commissions and incentives are based on my reseller tier and performance. I consent to LookCard collecting, processing, and storing my information for verification, program administration, and commission payouts in accordance with its Privacy Policy."}
                    </p>
                    <p className="my-4">
                        {t("termsDialog.termsAdditional2") || "I also understand that LookCard reserves the right to update program terms, and it is my responsibility to stay informed about any changes."}
                    </p>
                </div>

                <DialogFooter className="mt-4 flex justify-between">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="bg-black text-white hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                        {t("termsDialog.cancel") || "CANCEL"}
                    </Button>
                    <DialogClose asChild>
                        <Button className="bg-primary hover:bg-primary/90 text-white">
                            {t("termsDialog.submit") || "SUBMIT"}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TermsAgreementDialog;