"use client";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import BalanceWalletDistributionChart from "@/components/Charts/BalanceWalletDistributionChart";
import WalletTransferForm from "@/components/Forms/WalletTransferForm";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TransferActivityTable from "@/components/Tables/TransferActivityTable";
import { USDTIcon, USDCIcon } from "@/components/Icons/dashboard";
import { transferApi } from "@/api/transfer/transfer.api";
import { useTranslation } from "react-i18next";
import Loader from "@/components/common/Loader";
import { fetchData } from '@/lib/api-utils';

const TransferPage = () => {
    const { t } = useTranslation();
    const [transferData, setTransferData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

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

    useEffect(() => {
        fetchData(
            transferApi.getTransferData,
            setTransferData,
            setError,
            setLoading
        );
    }, []);

    const handleTransfer = (amount: number, currency: string) => {
        console.log(`Transferring ${amount} ${currency}`);
    };

    if (loading) return <Loader />;

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500">{t('transferPage.failedToLoadData')}</p>
            </div>
        );
    }

    // Enhance data with icons
    const currencyOptionsWithIcons = transferData.currencyOptions.map(
        (currency: any) => ({
            ...currency,
            icon: getCurrencyIcon(currency.symbol),
        })
    );

    return (
        <DefaultLayout>
            <Breadcrumb
                pageName={t("transferPage.transferToCurrentAccountWalletBreadcrumb")}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-4 sm:mb-6">
                <WalletTransferForm
                    sourceAmount={transferData.sourceWallet.amount}
                    sourceIcon={getCurrencyIcon(transferData.sourceWallet.currency)}
                    currencies={currencyOptionsWithIcons}
                    onTransfer={handleTransfer}
                />
                <div className="h-full min-h-[400px] sm:min-h-[450px]">
                    <BalanceWalletDistributionChart
                        title={t("walletsPage.currentAccountWalletBalance")}
                        data={[]} // Empty data to show "Coming Soon"
                        comingSoon={true}
                    />
                </div>
            </div>

            <div className="w-full overflow-hidden">
                <TransferActivityTable
                    data={[]} // Empty data to show "Coming Soon"
                    comingSoon={true}
                />
            </div>
        </DefaultLayout>
    );
};

export default TransferPage;