import resellerAxios from '@/api/config/reseller.config';
import { API_ENDPOINTS } from '@/api/config/endpoints';
import { DashboardStatistics, DepositChartParams, DepositChartResponse, ChartDataPoint, ChartRangeData } from '@/api/dashboard/dashboard.types';

export const dashboardApi = {
    getDashboardData: async (): Promise<DashboardStatistics> => {
        try {
            const response = await resellerAxios.get(
                API_ENDPOINTS.RESELLER.DASHBOARD
            );

            // Validate response data
            if (!response.data) {
                throw new Error('Empty response from dashboard API');
            }

            // Ensure required fields are present
            const data = response.data as DashboardStatistics;
            if (!data.rewardWallet || !data.agentProfile || !data.referralCode) {
                throw new Error('Invalid dashboard data structure');
            }

            return data;
        } catch (error) {
            console.error('[Dashboard API] Error fetching dashboard data:', error);
            throw error;
        }
    },

    getDepositChartData: async (params: DepositChartParams): Promise<DepositChartResponse> => {
        try {
            const response = await resellerAxios.get(
                API_ENDPOINTS.RESELLER.DEPOSIT_CHART,
                { params }
            );

            if (!response.data) {
                throw new Error('Empty response from deposit chart API');
            }

            return response.data as DepositChartResponse;
        } catch (error) {
            console.error('[Dashboard API] Error fetching deposit chart data:', error);
            throw error;
        }
    },

    formatDepositChartData: (data: DepositChartResponse): ChartRangeData => {
        // Format month data
        const monthData = data.chartDataMonth.map(item => {
            // Extract day from date (format: "2025-03-01")
            const day = item.date.split('-')[2];
            return {
                label: day,
                value: item.value
            };
        });

        // Format year data
        const yearData = data.chartDataYear.map(item => {
            // Extract month from date (format: "2025-01")
            const month = item.date.split('-')[1];
            return {
                label: month,
                value: item.value
            };
        });

        // Create empty week data (not used but required by the ChartRangeData type)
        const weekData: ChartDataPoint[] = [];

        return {
            Month: monthData,
            Year: yearData,
            Week: weekData
        };
    }
};