export type CurrencyType = 'USDT' | 'USDC';

export interface ChartDataPoint {
    label: string;
    value: number;
}

export interface ChartRangeData {
    Week: ChartDataPoint[];
    Month: ChartDataPoint[];
    Year: ChartDataPoint[];
}

export interface DepositActivity {
    id: string;
    description: string;
    amount: number;
    dateTime: string;
    type: 'incentive' | 'rebate' | 'bonus' | 'override';
    status: 'completed' | 'pending';
    transactionHash?: string;
}

export interface DashboardStatistics {
    rewardWallet: {
        balance: number;
        currency: CurrencyType;
        lastUpdated: string;
    };
    totalDeposits: {
        amount: number;
        currency: CurrencyType;
        lastUpdated: string;
        chartData: ChartDataPoint[];
    };
    directRecruitment: {
        earnings: number;
        currency: CurrencyType;
        lastUpdated: string;
    };
    agentProfile: {
        name: string;
        level: string;
        activeUsers: {
            current: number;
            target: number;
            percentage: number;
            remaining: number;
        };
    }
    totalDirectRecruit: {
        count: number;
        agentsToPartner: number;
    };
    referralCode: string;
    totalReferral: number,
    depositActivities: DepositActivity[];
}