import resellerAxios from '@/api/0-config/reseller.config';
import { API_ENDPOINTS } from '@/api/0-config/endpoints';

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

};