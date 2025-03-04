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
        // - Level 1 Agent: can only see referred users (Level 0)
        // - Level 2 Agent: can see referred users and Level 1 agents
        // - Level 3+ Partners: independent, can only see Level 1 and Level 2 agents

        switch (currentTierPriority) {
            case 1: // Level 1 Agent
                return ['tier 0'];
            case 2: // Level 2 Agent
                return ['tier 0', 'tier 1'];
            case 3: // Level 3 Partner (independent)
                return ['tier 0', 'tier 1', 'tier 2'];
            case 4: // Level 4 Partner (independent)
                return ['tier 0', 'tier 1', 'tier 2'];
            case 5: // Level 5 Partner (independent)
                return ['tier 0', 'tier 1', 'tier 2'];
            default:
                return [];
        }
    },


    // Get the tier name based on the priority number
    getTierNameByPriority: (priority: number) => {
        switch (priority) {
            case 1: return "Level 1 Agent";
            case 2: return "Level 2 Agent";
            case 3: return "Level 3 Partner";
            case 4: return "Level 4 Partner";
            case 5: return "Level 5 Partner";
            default: return "Unknown";
        }
    }

};