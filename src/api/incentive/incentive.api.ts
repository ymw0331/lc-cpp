// src/api/5-incentive-management/incentive.api.ts
import resellerAxios from '@/api/config/reseller.config';
import { API_ENDPOINTS } from '@/api/config/endpoints';

export interface IncentiveResponse {
    activities: {
        activities: {
            [key: string]: Array<{
                type: string;
                amount: number;
                datetime: string;
            }>;
        };
    };
    summary: {
        total_incentive: number;
        milestone_bonus: {
            amount: number;
        };
        directReferralFee: number;
        directTopupRebate: number;
        downstreamReferralFee: number;
        downstreamTopupRebate: number;
        directRecruitLevelAdvancementBonus: number;
        performance_bonus: {
            amount: number;
            activeUsers: number;
        };
    };
}

export const incentiveApi = {
    getIncentiveData: async (): Promise<IncentiveResponse> => {
        const response = await resellerAxios.get(API_ENDPOINTS.RESELLER.REWARDS);

        return {
            activities: response.data.activities,
            summary: {
                total_incentive: response.data.summary.total_incentive,
                milestone_bonus: {
                    amount: response.data.summary.milestone_bonus.amount
                },
                directReferralFee: response.data.summary.directReferralFee,
                directTopupRebate: response.data.summary.directTopupRebate,
                downstreamReferralFee: response.data.summary.downstreamReferralFee,
                downstreamTopupRebate: response.data.summary.downstreamTopupRebate,
                directRecruitLevelAdvancementBonus: response.data.summary.directRecruitLevelAdvancementBonus,
                performance_bonus: {
                    amount: response.data.summary.performance_bonus.amount,
                    activeUsers: response.data.summary.performance_bonus.activeUsers
                }
            }
        };
    }
};