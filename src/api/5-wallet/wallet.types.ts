import { ChartDataPoint } from "@/types/dashboard";

export interface WalletData {
    rewardWallet: {
        amount: number;
        showTransfer: boolean;
    };
    currentWallet: {
        amount: number;
        secondaryAmount: number;
    };
    walletSummary: {
        Week: ChartDataPoint[];
        Month: ChartDataPoint[];
        Year: ChartDataPoint[];
    };
}