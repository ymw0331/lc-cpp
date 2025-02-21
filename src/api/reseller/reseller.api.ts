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


    countDownstreamByTier: (downstreams: any[]) => {
        const tierCounts = {
            'tier 0': 0,
            'tier 1': 0,
            'tier 2': 0,
            'tier 3': 0,
            'tier 4': 0,
            'tier 5': 0
        };

        downstreams.forEach(downstream => {
            const tier = downstream.tierId.toLowerCase();
            if (tierCounts.hasOwnProperty(tier)) {
                tierCounts[tier as keyof typeof tierCounts]++;
            }
        });

        return tierCounts;
    },

    getAccessibleTierLevels: (currentTierPriority: number) => {
        // For a Tier 5 agent, they can see levels 0-4
        // For a Tier 4 agent, they can see levels 0-3
        // And so on...
        return Array.from(
            { length: currentTierPriority },
            (_, i) => `tier ${i}`
        );
    }

};