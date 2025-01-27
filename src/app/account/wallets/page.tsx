import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import WalletCard from '@/components/Cards/WalletCard'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import AnalyticChart from '@/components/Charts/AnalyticChart'
import { RewardWalletBalanceIcon, USDCIcon, WalletIcon } from '@/components/Icons/dashboard'
import { walletStats } from '@/lib/account/data'

const WalletsPage = () => {

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Wallets" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 mb-6">
                <WalletCard
                    title="Reward Wallet Balance"
                    amount={walletStats.rewardWallet.amount}
                    icon={<RewardWalletBalanceIcon />}
                    showTransfer={walletStats.rewardWallet.showTransfer}
                />
                <WalletCard
                    title="Current Account Wallet Balance"
                    amount={walletStats.currentWallet.amount}
                    secondaryAmount={walletStats.currentWallet.secondaryAmount}
                    icon={<WalletIcon />}
                    secondaryIcon={<USDCIcon />}
                />
            </div>

            <AnalyticChart
                title="Reward Wallet Summary"
                chartData={walletStats.walletSummary}
                lineColor="#7C74FF"
            />

        </DefaultLayout>
    )
}

export default WalletsPage
