import axios from '@/api/config/auth.config';
import { API_ENDPOINTS } from '@/api/config/endpoints';
import type { LoginRequest, AuthResponse } from '@/api/auth/auth.types';

export const authApi = {
    login: async (credentials: LoginRequest) => {
        const response = await axios.post<AuthResponse>(
            API_ENDPOINTS.AUTH.LOGIN,
            credentials
        );
        return response.data;
    },

    // refreshToken: async (refreshToken: string) => {
    //     const response = await axios.post<AuthResponse>(
    //         API_ENDPOINTS.AUTH.REFRESH_TOKEN,a
    //         { refreshToken }
    //     );
    //     return response.data;
    // },
};