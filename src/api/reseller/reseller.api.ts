import resellerAxios from '@/api/config/reseller.config';
import { API_ENDPOINTS } from '@/api/config/endpoints';
import { IncentivePageData } from '@/types/incentive';

interface ResellerResponse {
    id: string;
    tier: {
        id: string;
        priority: number;
        name: string;
        status: string;
        incentive: {
            id: number;
            directReferralFee: string;
            directTopupRebatePercentage: string;
            downstreamReferralFee: string;
            downstreamTopupRebatePercentage: string;
            upgradeBonus: string;
            performanceBonus: string;
        };
        downstreamLimit: number;
    };
    downstreams: any[];
}

export const resellerApi = {
    getResellerInfo: async () => {
        const response = await resellerAxios.get<ResellerResponse>(
            API_ENDPOINTS.RESELLER.INFO
        );
        return response.data;
    },


    // Helper function to transform API data to IncentivePageData
    transformToIncentiveData: (resellerData: ResellerResponse): IncentivePageData => {
        const currentMonth = new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' });

        return {
            summary: {
                total_incentive: Number(resellerData.tier.incentive.directReferralFee) +
                    Number(resellerData.tier.incentive.directTopupRebatePercentage) +
                    Number(resellerData.tier.incentive.performanceBonus),
                milestone_bonus: {
                    amount: Number(resellerData.tier.incentive.performanceBonus),
                },
                direct_recruit_referral: Number(resellerData.tier.incentive.directReferralFee),
                direct_admin_charge: Number(resellerData.tier.incentive.directTopupRebatePercentage),
                direct_recruit_deposit: Number(resellerData.tier.incentive.downstreamTopupRebatePercentage),
                direct_recruit_level: Number(resellerData.tier.incentive.upgradeBonus),
                performance_bonus: {
                    amount: Number(resellerData.tier.incentive.performanceBonus),
                    activeUsers: resellerData.downstreams.length
                }
            },
            activities: {
                [currentMonth]: [] // You might need to implement a separate API call for activities
            }
        };
    }


};