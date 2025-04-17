import resellerAxios from '@/api/config/reseller.config';
import { API_ENDPOINTS } from '@/api/config/endpoints';
import { ProfileData } from '@/api/profile/profile.types';

// NOT IN USE AT THE MOMENT(April 17, 2025)

export const profileApi = {
    getProfile: async () => {
        const response = await resellerAxios.get<ProfileData>(
            API_ENDPOINTS.RESELLER.PROFILE
        );
        return response.data;
    },

    updateProfile: async (data: Partial<ProfileData>) => {
        const response = await resellerAxios.put<ProfileData>(
            API_ENDPOINTS.RESELLER.PROFILE,
            data
        );
        return response.data;
    }
};