'use client'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import AssetDistributionChart from '@/components/Charts/AssetDistributionChart'
import WalletTransferForm from '@/components/Forms/WalletTransferForm'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import TransferActivityTable from '@/components/Tables/TransferActivityTable'
import { USDTIcon, USDCIcon } from '@/components/Icons/dashboard'
import { transferPageData } from '@/lib/account/data'

const TransferPage = () => {
    // Currency Icon Mapping
    const getCurrencyIcon = (currency: string) => {
        switch (currency) {
            case 'USDT':
                return <USDTIcon className="w-6 h-6" />;
            case 'USDC':
                return <USDCIcon className="w-6 h-6" />;
            default:
                return null;
        }
    };

    // Enhance data with icons
    const currencyOptionsWithIcons = transferPageData.currencyOptions.map(currency => ({
        ...currency,
        icon: getCurrencyIcon(currency.symbol)
    }));

    const assetDistributionWithIcons = {
        ...transferPageData.assetDistribution,
        data: transferPageData.assetDistribution.data.map(item => ({
            ...item,
            icon: getCurrencyIcon(item.currency)
        }))
    };

    const handleTransfer = (amount: number, currency: string) => {
        console.log(`Transferring ${amount} ${currency}`);
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Transfer to Current Account Wallet" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">

                <WalletTransferForm
                    sourceAmount={transferPageData.sourceWallet.amount}
                    sourceIcon={getCurrencyIcon(transferPageData.sourceWallet.currency)}
                    currencies={currencyOptionsWithIcons}
                    onTransfer={handleTransfer}
                />
                <AssetDistributionChart
                    title={"Current Account Wallet Balance"}
                    data={assetDistributionWithIcons.data}
                />
            </div>

            <TransferActivityTable
                data={transferPageData.transferActivity}
            />
        </DefaultLayout>

    );
};

export default TransferPage;