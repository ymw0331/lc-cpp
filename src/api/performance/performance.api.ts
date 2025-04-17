import { API_ENDPOINTS } from "@/api/config/endpoints";
import resellerAxios from '@/api/config/reseller.config';
import { PerformanceData } from '@/api/performance/performance.types';

export const performanceApi = {
    getPerformanceData: async (): Promise<PerformanceData> => {
        try {
            const response = await resellerAxios.get(API_ENDPOINTS.RESELLER.PERFORMANCE);
            return response.data;
        } catch (error) {
            console.error('Error fetching performance data:', error);
            throw error;
        }
    }
};