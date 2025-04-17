// File: src/api/reseller/reseller.api.ts

import { API_ENDPOINTS } from '@/api/config/endpoints';
import resellerAxiosInstance from '@/api/config/reseller.config';
import publicAxiosInstance from '@/api/config/public.config';
import {
    ResellerResponse,
    ResellerByIdResponse,
    BatchProfileRequest,
    UserOrResellerProfileResponse,
    RegisterResellerRequest,
    UserVerificationRequest,
    UserVerificationResponse,
    RegisterResellerResponse,
    Downstream,
    TierCounts,
    TierLevel
} from './reseller.types';

/**
 * API client for interacting with the reseller endpoints
 */
export const resellerApi = {
    /**
     * Get current reseller information
     * @returns Promise with reseller data
     */
    getCurrentReseller: async (): Promise<ResellerResponse> => {
        const response = await resellerAxiosInstance.get<ResellerResponse>(
            API_ENDPOINTS.RESELLER.INFO
        );
        return response.data;
    },

    /**
     * Get reseller information by ID
     * @param resellerId - ID of the reseller
     * @returns Promise with reseller data
     */
    getResellerById: async (resellerId: string): Promise<ResellerByIdResponse> => {
        const response = await publicAxiosInstance.get<ResellerByIdResponse>(
            `${API_ENDPOINTS.RESELLER.INFO}/${resellerId}?type=resellerId`
        );
        return response.data;
    },

    /**
     * Get detailed profile information for a user or reseller by profile ID
     * @param profileId - ID of the profile (ownerProfileId for reseller, profileId for user)
     * @returns Promise with reseller profile data
     */
    getUserOrResellerProfile: async (profileId: string): Promise<UserOrResellerProfileResponse> => {
        const response = await publicAxiosInstance.get<UserOrResellerProfileResponse>(
            `${API_ENDPOINTS.RESELLER.PROFILE}/${profileId}`
        );
        return response.data;
    },

    /**
     * Get detailed profile information for multiple reseller profiles by profile IDs
     * @param profileIds - Array of profile IDs
     * @returns Promise with an array of reseller profile data
     */
    getBatchProfiles: async (profileIds: string[]): Promise<UserOrResellerProfileResponse[]> => {
        const response = await publicAxiosInstance.post<UserOrResellerProfileResponse[]>(
            `${API_ENDPOINTS.RESELLER.PROFILE}/batch`,
            { profileIds } as BatchProfileRequest
        );
        return response.data;
    },

    /**
     * Get agent-specific data by profile ID
     * @param profileId - ID of the agent's profile
     * @returns Promise with agent data
     */
    getAgentData: async (profileId: string): Promise<ResellerResponse> => {
        const response = await publicAxiosInstance.get<ResellerResponse>(
            `${API_ENDPOINTS.RESELLER.INFO}/${profileId}`
        );
        return response.data;
    },

    /**
     * Verify a user's email for registration
     * @param email - Email to verify
     * @returns Promise with verification response
     */
    verifyUser: async (email: string): Promise<UserVerificationResponse> => {
        const response = await resellerAxiosInstance.post<UserVerificationResponse>(
            API_ENDPOINTS.RESELLER.USER_VERIFICATION,
            { email } as UserVerificationRequest
        );
        return response.data;
    },

    /**
     * Register a new reseller
     * @param data - Registration data
     * @returns Promise with registration response
     */
    registerReseller: async (data: RegisterResellerRequest): Promise<RegisterResellerResponse> => {
        const response = await resellerAxiosInstance.post<RegisterResellerResponse>(
            API_ENDPOINTS.RESELLER.INFO,
            data
        );
        return response.data;
    },

    // Utility functions that don't require API calls

    /**
     * Count downstreams by tier level
     * @param downstreams - Array of downstream objects
     * @returns Object with count of each tier
     */
    countDownstreamByTier: (downstreams: Downstream[]): TierCounts => {
        const tierCounts: TierCounts = {
            'tier 0': 0,
            'tier 1': 0,
            'tier 2': 0,
            'tier 3': 0,
            'tier 4': 0,
            'tier 5': 0
        };

        downstreams.forEach(downstream => {
            const tier = downstream.tierId.toLowerCase() as TierLevel;
            if (tierCounts.hasOwnProperty(tier)) {
                tierCounts[tier]++;
            }
        });

        return tierCounts;
    },

    /**
     * Get accessible tier levels based on current tier priority
     * @param currentTierPriority - Priority of the current tier
     * @returns Array of accessible tier levels
     */
    getAccessibleTierLevels: (currentTierPriority: number): TierLevel[] => {
        switch (currentTierPriority) {
            case 1: // Level 1 Agent
                return ['tier 0'];
            case 2: // Level 2 Agent
                return ['tier 0', 'tier 1'];
            case 3: // Level 3 Partner (independent)
            case 4: // Level 4 Partner (independent)
            case 5: // Level 5 Partner (independent)
                return ['tier 0', 'tier 1', 'tier 2'];
            default:
                return [];
        }
    },

    /**
     * Get the display name for a tier based on its priority number
     * @param priority - Priority number of the tier
     * @returns Display name for the tier
     */
    getTierNameByPriority: (priority: number): string => {
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

export default resellerApi;