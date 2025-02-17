"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import WalletCard from "@/components/Cards/WalletCard";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AnalyticChart from "@/components/Charts/AnalyticChart";
import {
    RewardWalletBalanceIcon,
    USDCIcon,
    WalletIcon,
} from "@/components/Icons/dashboard";
import { walletStats } from "@/lib/data";
import { useTranslation } from "react-i18next";

const WalletsPage = () => {
    const { t } = useTranslation();

    return (
        <DefaultLayout>
            <Breadcrumb pageName={t("walletsPage.walletsBreadcrumb")} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:gap-6 mb-4 sm:mb-6">
                <WalletCard
                    title={t("walletsPage.rewardWalletBalance")}
                    amount={walletStats.rewardWallet.amount}
                    icon={<RewardWalletBalanceIcon />}
                    showTransfer={walletStats.rewardWallet.showTransfer}
                />
                <WalletCard
                    title={t("walletsPage.currentAccountWalletBalance")}
                    amount={walletStats.currentWallet.amount}
                    secondaryAmount={walletStats.currentWallet.secondaryAmount}
                    icon={<WalletIcon />}
                    secondaryIcon={<USDCIcon />}
                />
            </div>

            <div className="w-full">
                <AnalyticChart
                    title={t("walletsPage.rewardWalletSummary")}
                    chartData={walletStats.walletSummary}
                    lineColor="#7C74FF"
                    className="overflow-x-auto"
                />
            </div>
        </DefaultLayout>
    );
};

export default WalletsPage;
