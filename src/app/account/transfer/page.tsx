"use client";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import WalletTransferForm from "@/components/Forms/WalletTransferForm";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TransferActivityTable from "@/components/Tables/TransferActivityTable";
import { USDTIcon, USDCIcon } from "@/components/Icons/dashboard";
import { transferApi } from "@/api/transfer/transfer.api";
import { useTranslation } from "react-i18next";
import Loader from "@/components/common/Loader";
import { fetchData } from '@/lib/api-utils';
import { toast } from "@/hooks/useToast";
import { TransferSuccessDialog } from "@/components/Dialogs/TransferSuccessDialog";
import { TransferActivityProps, CurrencyType } from "@/api/transfer/transfer.types";

// Define the expected structure of the transferData
interface TransferData {
    sourceWallet: {
        amount: number;
        currency: CurrencyType;
    };
    currencyOptions: Array<{
        name: CurrencyType;
        symbol: CurrencyType;
    }>;
    walletBalanceDistribution: {
        data: Array<{
            name: string;
            value: number;
        }>;
    };
    transferActivity: TransferActivityProps[];
}

const TransferPage = () => {
    const { t } = useTranslation();
    const [transferData, setTransferData] = useState<TransferData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isTransferring, setIsTransferring] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [transferDetails, setTransferDetails] = useState({ amount: 0, currency: "USDT" });

    // Currency Icon Mapping
    const getCurrencyIcon = (currency: string) => {
        switch (currency) {
            case "USDT":
                return <USDTIcon className="w-6 h-6" />;
            case "USDC":
                return <USDCIcon className="w-6 h-6" />;
            default:
                return null;
        }
    };

    const loadTransferData = () => {
        fetchData(
            transferApi.getTransferData,
            setTransferData,
            setError,
            setLoading
        );
    };

    useEffect(() => {
        loadTransferData();
    }, []);

    const handleTransfer = async (amount: number, currency: string) => {
        try {
            setIsTransferring(true);
            console.log("Starting transfer:", { amount, currency, fromType: "REBATE" });

            // Call the transfer API (only once)
            try {
                const response = await transferApi.transferToCurrentWallet({
                    amount: amount,
                    fromType: "REBATE"
                });

                console.log("Transfer API response:", response);

                // If we reach here, the transfer was successful
                setTransferDetails({ amount, currency });
                setShowSuccessDialog(true);

                // Reload data after successful transfer
                loadTransferData();

                // Optional: show success toast
                toast({
                    title: t("transferPage.successTitle"),
                    description: t("transferPage.successDescription", { amount, currency }),
                    variant: "success",
                    duration: 5000,
                });
            } catch (apiError: any) {
                console.error("API specific error:", apiError);

                // Handle specific error cases from the API
                const errorMessage = apiError?.response?.data?.message || t("transferPage.errorGeneric");

                toast({
                    title: t("transferPage.errorTitle"),
                    description: errorMessage,
                    variant: "destructive",
                    duration: 5000,
                });
            }
        } catch (error: any) {
            // This is a general error, not specifically from the API call
            console.error("General transfer error:", error);

            toast({
                title: t("transferPage.errorTitle"),
                description: t("transferPage.errorDescription"),
                variant: "destructive",
                duration: 5000,
            });
        } finally {
            setIsTransferring(false);
        }
    };

    const handleCloseSuccessDialog = () => {
        setShowSuccessDialog(false);
        // You can reset form or do additional actions here if needed
    };

    if (loading) return <Loader />;

    if (error || !transferData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500">{t('transferPage.failedToLoadData')}</p>
            </div>
        );
    }

    // Enhance data with icons
    const currencyOptionsWithIcons = transferData.currencyOptions.map(
        (currency) => ({
            ...currency,
            icon: getCurrencyIcon(currency.symbol),
        })
    );

    // Format transaction dates to be more user-friendly
    const formattedTransferActivity = transferData.transferActivity.map(activity => {
        const date = new Date(activity.dateTime);
        return {
            ...activity,
            // Format date to a more readable format
            dateTime: date.toLocaleString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            // Add description if not provided
            description: activity.description || (activity.type === 'transfer-in' ?
                t('transferPage.transferIn') :
                t('transferPage.transferOut'))
        };
    });

    return (
        <DefaultLayout>
            <Breadcrumb
                pageName={t("transferPage.transferToCurrentAccountWalletBreadcrumb")}
            />

            <div className="w-full overflow-hidden mb-6">
                <WalletTransferForm
                    sourceAmount={transferData.sourceWallet.amount}
                    sourceIcon={getCurrencyIcon(transferData.sourceWallet.currency)}
                    currencies={currencyOptionsWithIcons}
                    onTransfer={handleTransfer}
                    isLoading={isTransferring}
                />
            </div>

            <div className="w-full overflow-hidden">
                <TransferActivityTable
                    data={formattedTransferActivity}
                    comingSoon={formattedTransferActivity.length === 0}
                />
            </div>

            {/* Success Dialog */}
            {showSuccessDialog && (
                <TransferSuccessDialog
                    onClose={handleCloseSuccessDialog}
                />
            )}
        </DefaultLayout>
    );
};

export default TransferPage;