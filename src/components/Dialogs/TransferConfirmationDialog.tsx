'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface TransferConfirmationProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    amount: number;
    currency: string;
}

const TransferConfirmationDialog = ({
    isOpen,
    onClose,
    onConfirm,
    amount,
    currency
}: TransferConfirmationProps) => {
    const { t } = useTranslation();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('transferConfirmationDialog.title')}</DialogTitle>
                    <DialogDescription>
                        {t('transferConfirmationDialog.subtitle')}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <p className="mb-4">
                        {t('transferConfirmationDialog.transferMessage', { amount, currency })}
                    </p>

                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm">
                        <h4 className="font-bold mb-2">{t('transferConfirmationDialog.disclaimers')}</h4>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>{t('transferConfirmationDialog.disclaimer1')}</li>
                            <li>{t('transferConfirmationDialog.disclaimer2')}</li>
                            <li>{t('transferConfirmationDialog.disclaimer3')}</li>
                            <li>{t('transferConfirmationDialog.disclaimer4')}</li>
                            <li>{t('transferConfirmationDialog.disclaimer5')}</li>
                            <li>{t('transferConfirmationDialog.disclaimer6')}</li>
                        </ul>
                    </div>
                </div>

                <DialogFooter className="sm:justify-between">
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        {t('transferConfirmationDialog.cancelButton')}
                    </Button>
                    <Button
                        variant="default"
                        onClick={onConfirm}
                    >
                        {t('transferConfirmationDialog.confirmButton')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TransferConfirmationDialog;