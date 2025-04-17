
export interface WalletData {
    rewardWallet: {
        amount: number;
        showTransfer: boolean;
    };
    currentWallet: {
        amount: number;
        secondaryAmount: number;
    };
}

export interface RewardChartResponse {
    totalDrReward: number;
    chartDataYear: {
        date: string;
        value: number;
    }[];
    chartDataMonth: {
        date: string;
        value: number;
    }[];
}

export interface RewardChartParams {
    year: number;
    month?: number;
}

export interface ChartDataPoint {
    date: string;
    value: number;
}

export interface DownstreamChartResponse {
    totalDownstream: number;
    chartDataYear: ChartDataPoint[];
    chartDataMonth: ChartDataPoint[];
}