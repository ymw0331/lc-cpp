"use client";
import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import WalletCard from "@/components/Cards/WalletCard";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AnalyticChart from "@/components/Charts/AnalyticChart";
import {
    RewardWalletBalanceIcon,
    USDCIcon,
    WalletIcon,
} from "@/components/Icons/dashboard";
import { useTranslation } from "react-i18next";
import { walletApi } from "@/api/5-wallet/wallet.api";
import Loader from "@/components/common/Loader";
import { fetchData } from '@/lib/api-utils';
import { WalletData } from "@/api/5-wallet/wallet.types";

const WalletsPage = () => {
    const { t } = useTranslation();
    const [walletData, setWalletData] = useState<WalletData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetchData(
            walletApi.getWalletData,
            setWalletData,
            setError,
            setLoading
        );
    }, []);

    if (loading) return <Loader />;


    if (error || !walletData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500">{t('walletsPage.failedToLoadData')}</p>
            </div>
        );
    }

    if (!walletData) return null;

    return (
        <DefaultLayout>
            <Breadcrumb pageName={t("walletsPage.walletsBreadcrumb")} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:gap-6 mb-4 sm:mb-6">
                <WalletCard
                    title={t("walletsPage.rewardWalletBalance")}
                    amount={walletData.rewardWallet.amount}
                    icon={<RewardWalletBalanceIcon />}
                    showTransfer={walletData.rewardWallet.showTransfer}
                />
                <WalletCard
                    title={t("walletsPage.currentAccountWalletBalance")}
                    amount={walletData.currentWallet.amount}
                    secondaryAmount={walletData.currentWallet.secondaryAmount}
                    icon={<WalletIcon />}
                    secondaryIcon={<USDCIcon />}
                />
            </div>

            <div className="w-full">
                <AnalyticChart
                    title={t("walletsPage.rewardWalletSummary")}
                    chartData={walletData.walletSummary}
                    lineColor="#7C74FF"
                    className="overflow-x-auto"
                />
            </div>
        </DefaultLayout>
    );
};

export default WalletsPage;