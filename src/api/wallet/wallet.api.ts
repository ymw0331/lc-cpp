// wallet.api.ts
import { accountApi } from "../account/account.api";
import { dashboardApi } from "../dashboard/dashboard.api";
import { WalletData } from "./wallet.types";

export const walletApi = {
    getWalletData: async (): Promise<WalletData> => {
        try {
            // const dashboardData = await dashboardApi.getDashboardData();
            // const accountData = await accountApi.getAccountData();
            // Make API calls in parallel for better performance
            const [dashboardData, accountData] = await Promise.all([
                dashboardApi.getDashboardData(),
                accountApi.getAccountData()
            ]);


            return {
                rewardWallet: {
                    amount: dashboardData.reward_wallet_balance ?? 0,
                    showTransfer: true,
                },
                currentWallet: {
                    amount: accountData.current.balance ?? 0,
                    secondaryAmount: 0,
                },
                walletSummary: {
                    Week: [],  // Empty arrays until backend integration
                    Month: [], // Empty arrays until backend integration
                    Year: []   // Empty arrays until backend integration
                }
            };
        } catch (error) {
            console.error('Error fetching wallet data:', error);
            return {
                rewardWallet: {
                    amount: 0,
                    showTransfer: true,
                },
                currentWallet: {
                    amount: 0,
                    secondaryAmount: 0,
                },
                walletSummary: {
                    Week: [],
                    Month: [],
                    Year: []
                }
            };
        }
    }
};