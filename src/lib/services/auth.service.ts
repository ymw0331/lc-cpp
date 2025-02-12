import api from '@/lib/api/axios';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { AuthResponse, LoginRequest } from '@/types/auth';
import { IUser } from '@/types/user';
import { KeyMarket, Role } from '../constants/enums';

export const authService = {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>(
            API_ENDPOINTS.AUTH.LOGIN,
            credentials
        );
        return response.data;
    },

    // Helper function to map API response to frontend user model
    mapToUser: (authResponse: AuthResponse): IUser => {
        const { data } = authResponse;
        return {
            id: data.userId.toString(),
            name: data.fullName || data.username,
            email: data.email,
            contactNumber: data.phoneNumber || '',
            token: data.token,
            // These fields need to be fetched/set separately
            keyMarket: KeyMarket.HK, // Default value or fetch from another API
            role: Role.AGENT,        // Default value or fetch from another API
            referralCode: '',        // Need to be fetched separately
            // Optional fields
            avatarUrl: undefined,
            level: undefined,
            socialMedia: undefined,
        };
    }
};
