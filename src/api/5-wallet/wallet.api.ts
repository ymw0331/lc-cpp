// wallet.api.ts
import { dashboardApi } from "../4-dashboard/dashboard.api";
import { WalletData } from "./wallet.types";

export const walletApi = {
    getWalletData: async (): Promise<WalletData> => {
        try {
            const dashboardData = await dashboardApi.getDashboardData();

            return {
                rewardWallet: {
                    amount: dashboardData.reward_wallet_balance ?? 0,
                    showTransfer: true,
                },
                currentWallet: {
                    amount: 0,
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