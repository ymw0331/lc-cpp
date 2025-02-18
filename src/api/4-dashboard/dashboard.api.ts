import resellerAxios from '@/api/0-config/reseller.config';
import { API_ENDPOINTS } from '@/api/0-config/endpoints';
import type { DashboardStatistics } from '@/types/dashboard';

export const dashboardApi = {
    getDashboardData: async () => {
        const response = await resellerAxios.get(
            API_ENDPOINTS.RESELLER.DASHBOARD
        );
        return response.data;
    }
};