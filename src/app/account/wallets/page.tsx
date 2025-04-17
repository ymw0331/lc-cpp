"use client";
import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import WalletCard from "@/components/Cards/WalletCard";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import RewardSummaryChart from "@/components/Charts/RewardSummaryChart";
import {
    RewardWalletBalanceIcon,
    USDCIcon,
    WalletIcon,
} from "@/components/Icons/dashboard";
import { useTranslation } from "react-i18next";
import { walletApi } from "@/api/wallet/wallet.api";
import { WalletsSkeleton } from "@/components/common/Skeletons";
import { fetchData } from '@/lib/api-utils';
import { WalletData } from "@/api/wallet/wallet.types";
import ErrorDisplay from '@/components/common/ErrorDisplay';

const WalletsPage = () => {
    const { t } = useTranslation();
    const [walletData, setWalletData] = useState<WalletData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [accountData, setAccountData] = useState(null);

    useEffect(() => {
        fetchData(
            walletApi.getWalletData,
            setWalletData,
            setError,
            setLoading
        );
    }, []);

    if (loading) return <DefaultLayout><WalletsSkeleton /></DefaultLayout>;

    if (error || !walletData) {
        return <ErrorDisplay errorMessage={error?.message} />;
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
                <RewardSummaryChart
                    title={t("walletsPage.rewardWalletSummary")}
                    lineColor="#7C74FF"
                />
            </div>
        </DefaultLayout>
    );
};

export default WalletsPage;