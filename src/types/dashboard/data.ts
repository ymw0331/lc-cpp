/*** Dashboard Stats ***/
export type CurrencyType = 'USDT' | 'USDC';

export interface ChartDataPoint {
    label: string;
    value: number;
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
        totalRecruits: number;
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
    depositActivities: DepositActivity[];
}