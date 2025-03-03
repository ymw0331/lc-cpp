// src/api/5-incentive-management/incentive.api.ts
import resellerAxios from '@/api/config/reseller.config';
import { API_ENDPOINTS } from '@/api/config/endpoints';
import { dashboardApi } from '@/api/dashboard/dashboard.api';
import type { IncentivePageData } from './incentive.types';

interface IncentiveResponse {
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
        directTopupRebatePercentage: number;
        downstreamReferralFee: number;
        downstreamTopupRebatePercentage: number;
        directRecruitLevelAdvancementBonus: number;
        performance_bonus: {
            amount: number;
            activeUsers: number;
        };
    };
}

export const incentiveApi = {
    getIncentiveData: async (): Promise<IncentivePageData> => {
        // Fetch both incentive and dashboard data in parallel
        const [incentiveResponse, dashboardData] = await Promise.all([
            resellerAxios.get<IncentiveResponse>(API_ENDPOINTS.RESELLER.REWARDS),
            dashboardApi.getDashboardData()
        ]);

        const totalDeposit = dashboardData.totalDeposits.amount;

        // Calculate direct admin charge (1.5% of total deposit) * 0.035 again for 
        const directAdminCharge = totalDeposit * 0.015;

        // Calculate direct recruit deposit (35% of admin charge)
        const directRecruitDeposit = directAdminCharge * 0.35;

        // Transform the API response to match our expected format
        return {
            summary: {
                total_incentive: incentiveResponse.data.summary.total_incentive,
                milestone_bonus: {
                    amount: incentiveResponse.data.summary.milestone_bonus.amount
                },
                direct_recruit_referral: incentiveResponse.data.summary.directReferralFee,
                direct_admin_charge: directAdminCharge,
                direct_recruit_deposit: directRecruitDeposit,
                direct_recruit_level_advancement_bonus: incentiveResponse.data.summary.directRecruitLevelAdvancementBonus,
                performance_bonus: {
                    amount: incentiveResponse.data.summary.performance_bonus.amount,
                    activeUsers: incentiveResponse.data.summary.performance_bonus.activeUsers
                }
            },
            activities: incentiveResponse.data.activities.activities
        };
    }
};