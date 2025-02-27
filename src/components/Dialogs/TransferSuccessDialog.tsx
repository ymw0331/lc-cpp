'use client'

import { Button } from '@/components/ui/button'
import { CheckIcon } from 'lucide-react'
import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';

interface TransferSuccessDialogProps {
    onClose: () => void;
    amount?: number;
    currency?: string;
}

export function TransferSuccessDialog({
    onClose,
    amount,
    currency = "USDT"
}: TransferSuccessDialogProps) {
    const { t } = useTranslation();
    const [animate, setAnimate] = useState(false);

    // Format the amount with 2 decimal places if provided
    const formattedAmount = amount !== undefined ? amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }) : "";

    // Trigger animation after component mounts
    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimate(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
            <div className="bg-white dark:bg-boxdark rounded-lg p-8 max-w-md w-full mx-4 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
                    {/* Circle animation that grows and fades in */}
                    <div className={`absolute inset-0 bg-green-500/20 rounded-full transform scale-0 ${animate ? 'scale-100 opacity-100' : 'opacity-0'} transition-all duration-500 ease-out`}></div>

                    {/* Checkmark icon with animation */}
                    <CheckIcon
                        className={`w-8 h-8 text-green-500 dark:text-green-400 transform ${animate ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} transition-all duration-500 ease-out delay-200`}
                    />
                </div>
                <h1 className="text-2xl font-bold mb-2 text-black dark:text-white">
                    {t("transferSuccessDialog.title", "Transfer Successful")}
                </h1>
                <p className="text-body dark:text-bodydark mb-6">
                    {t("transferSuccessDialog.description", "Your transfer has been completed successfully.")}
                </p>

                {amount !== undefined && (
                    <div className="bg-gray-50 dark:bg-meta-4 rounded-lg p-4 mb-6">
                        <div className="flex justify-between mb-2">
                            <span className="text-body dark:text-bodydark">
                                {t("transferSuccessDialog.amount", "Amount")}:
                            </span>
                            <span className="font-bold text-black dark:text-white">
                                {formattedAmount} {currency}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-body dark:text-bodydark">
                                {t("transferSuccessDialog.status", "Status")}:
                            </span>
                            <span className="text-green-500 dark:text-green-400 font-medium">
                                {t("transferSuccessDialog.completed", "Completed")}
                            </span>
                        </div>
                    </div>
                )}

                <Button
                    onClick={onClose}
                    className="bg-primary hover:bg-primary/90 text-white"
                >
                    {t("transferSuccessDialog.closeButton", "Make Another Transfer")}
                </Button>
            </div>
        </div>
    )
}