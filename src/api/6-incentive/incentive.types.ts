// src/api/5-incentive-management/incentive.types.ts
export interface IncentivePageData {
    summary: {
        total_incentive: number;
        milestone_bonus: {
            amount: number;
        };
        direct_recruit_referral: number;
        direct_admin_charge: number;
        direct_recruit_deposit: number;
        direct_recruit_level_advancement_bonus: number;
        performance_bonus: {
            amount: number;
            activeUsers: number;
        };
    };
    activities: {
        [key: string]: Array<{
            type: string;
            amount: number;
            datetime: string;
        }>;
    };
}