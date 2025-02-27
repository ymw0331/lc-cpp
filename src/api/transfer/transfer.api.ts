// transfer.api.ts
import { accountApi } from "../account/account.api";
import { dashboardApi } from "../dashboard/dashboard.api";
import { CurrencyType, TransferActivityProps } from "./transfer.types";

export const transferApi = {
    getTransferData: async () => {
        try {
            // Fetch dashboard data for reward wallet balance
            // const dashboardData = await dashboardApi.getDashboardData();
            const [dashboardData, accountData] = await Promise.all([
                dashboardApi.getDashboardData(),
                accountApi.getAccountData()
            ]);

            return {
                sourceWallet: {
                    amount: dashboardData.reward_wallet_balance ?? 0,
                    currency: 'USDT' as CurrencyType
                },
                currencyOptions: [
                    { name: 'USDT' as CurrencyType, symbol: 'USDT' as CurrencyType },
                    { name: 'USDC' as CurrencyType, symbol: 'USDC' as CurrencyType }
                ],
                walletBalanceDistribution: {
                    data: [] // Will be updated when backend provides data
                },
                transferActivity: [] // Will be updated when backend provides data
            };
        } catch (error) {
            console.error('Error fetching transfer data:', error);
            return {
                sourceWallet: {
                    amount: 0,
                    currency: 'USDT' as CurrencyType
                },
                currencyOptions: [
                    { name: 'USDT' as CurrencyType, symbol: 'USDT' as CurrencyType },
                    { name: 'USDC' as CurrencyType, symbol: 'USDC' as CurrencyType }
                ],
                walletBalanceDistribution: {
                    data: []
                },
                transferActivity: []
            };
        }
    }
};