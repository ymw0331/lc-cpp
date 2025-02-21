import resellerAxios from '@/api/config/reseller.config';
import { API_ENDPOINTS } from '@/api/config/endpoints';
import type { DashboardStatistics } from '@/types/dashboard';

export const dashboardApi = {
    getDashboardData: async () => {
        const response = await resellerAxios.get(
            API_ENDPOINTS.RESELLER.DASHBOARD
        );
        return response.data;
    }
};