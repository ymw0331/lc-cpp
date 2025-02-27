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
import { walletApi } from "@/api/wallet/wallet.api";
import Loader from "@/components/common/Loader";
import { fetchData } from '@/lib/api-utils';
import { WalletData } from "@/api/wallet/wallet.types";
import { accountApi } from "@/api/account/account.api";

const WalletsPage = () => {
    const { t } = useTranslation();
    const [walletData, setWalletData] = useState<WalletData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [accountData, setAccountData] = useState(null);

    useEffect(() => {

        // console.log("accountData:", accountApi.getAccountData())

        // accountApi.getAccountData().then(data => {
        //     console.log("Account Data:", data);
        // }).catch(error => {
        //     console.error("Error fetching account data:", error);
        // });

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
                    // secondaryAmount={walletData.currentWallet.secondaryAmount}
                    icon={<WalletIcon />}
                    // secondaryIcon={<USDCIcon />}
                />
            </div>

            <div className="w-full">
                {/* TODO: move this to incentive page or discard this */}
                <AnalyticChart
                    title={t("walletsPage.rewardWalletSummary")}
                    chartData={walletData.walletSummary}
                    lineColor="#7C74FF"
                    className="overflow-x-auto"
                    comingSoon={true}
                />
            </div>
        </DefaultLayout>
    );
};

export default WalletsPage;