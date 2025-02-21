import resellerAxios from '@/api/config/reseller.config';
import { API_ENDPOINTS } from '@/api/config/endpoints';

interface ResellerResponse {
    id: string;
    ownerProfileId: string;
    tierId: string;
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
    code: string;
}

export const resellerApi = {
    getResellerInfo: async () => {
        const response = await resellerAxios.get<ResellerResponse>(
            API_ENDPOINTS.RESELLER.INFO
        );
        return response.data;
    },


    registerReseller: async () => {
        // The auth token will be automatically included in the request headers
        // through your axios interceptor configuration
        const response = await resellerAxios.post<ResellerResponse>(
            API_ENDPOINTS.RESELLER.INFO
        );
        return response.data;
    },

};