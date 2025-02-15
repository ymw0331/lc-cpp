import resellerAxios from '@/api/config/reseller.config';
import { API_ENDPOINTS } from '@/api/config/endpoints';
import type { ProfileResponse } from './profile.types';

export const profileApi = {
    getProfile: async () => {
        const response = await resellerAxios.get<ProfileResponse>(
            API_ENDPOINTS.RESELLER.PROFILE
        );
        return response.data;
    },

    updateProfile: async (data: Partial<ProfileResponse>) => {
        const response = await resellerAxios.put<ProfileResponse>(
            API_ENDPOINTS.RESELLER.PROFILE,
            data
        );
        return response.data;
    }
};