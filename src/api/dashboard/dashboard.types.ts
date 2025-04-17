export type CurrencyType = 'USDT' | 'USDC';

export interface ChartDataPoint {
    label: string;
    value: number;
}

export interface ChartRangeData {
    // Week option is kept for backward compatibility but is no longer used in UI
    Week: ChartDataPoint[];
    Month: ChartDataPoint[];
    Year: ChartDataPoint[];
}

export interface DepositChartResponse {
    totalDeposit: number;
    chartDataYear: {
        date: string;
        value: number;
    }[];
    chartDataMonth: {
        date: string;
        value: number;
    }[];
}

export interface DepositChartParams {
    year: number;
    month: number;
}

export interface Transaction {
    id: string;
    fromEntity: string;
    toEntity: string;
    currency: CurrencyType;
    fromId: string;
    toId: string;
    metadata: Record<string, any>;
    amount: number;
    description: string;
    accountId: string;
    createdAt: string;
    tx_hash: string | null;
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

export interface TierRequirement {
    minDownstreamCount: number;
    minCardActivation: number;
    minDepositAmount: number;
    canRecruit: boolean;
}

export interface DashboardStatistics {
    rewardWallet: {
        balance: number;
        currency: CurrencyType;
        lastUpdated: string;
        transactions: Transaction[];
    };
    referralDepositVolume: {
        amount: number | null;
        currency: CurrencyType;
        lastUpdated: string;
        chartData: ChartDataPoint[];
    };
    referralFeeBonus: {
        earnings: number;
        currency: CurrencyType; lastUpdated: string;
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
        tierRequirement: TierRequirement;
    };
    directReferredVolume: {
        activeDirectReffered: number;
        totalNumberOfAccountsRegistered: number;
        agentsToPartner: number;
    };
    referralCode: string;
    totalReferral: number;
    depositActivities: DepositActivity[];
    directAgent: {
        directRecruitAgentVolume: number;
        directRecruitAgentDepositVolume: number;
    };
    totalDepositFromDirectReferral: number;
    resellerRewardRecords: any[];
    downstreamRewardRecords: any[];

}