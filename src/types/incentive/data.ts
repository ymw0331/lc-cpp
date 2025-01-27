import { incentiveTypes } from "@/lib/incentive/data";


// Enum for incentive types
export type IncentiveType = typeof incentiveTypes[number];


// Individual activity record
export interface IncentiveActivity {
    type: IncentiveType;
    amount: number;
    datetime: string;
}

// Monthly activities data
export interface MonthlyIncentiveActivities {
    [key: string]: IncentiveActivity[];
}


// Summary cards data
export interface IncentiveSummaryData {
    total_incentive: number;
    milestone_bonus: {
        amount: number;
    };
    direct_recruit_referral: number;
    direct_admin_charge: number;
    direct_recruit_deposit: number;
    direct_recruit_level: number;
    performance_bonus: {
        amount: number;
        activeUsers: number;
    };
}

// Complete page data structure
export interface IncentivePageData {
    summary: IncentiveSummaryData;
    activities: MonthlyIncentiveActivities;
}
