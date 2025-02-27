import { accountApi } from "../account/account.api";
import { WalletData } from "./wallet.types";

export const walletApi = {
    getWalletData: async (): Promise<WalletData> => {
        try {
            const accountData = await accountApi.getAccountData();

            return {
                rewardWallet: {
                    amount: accountData.rebate.balance ?? 0,
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
            console.error('[Wallet API] Error fetching wallet data:', error);
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