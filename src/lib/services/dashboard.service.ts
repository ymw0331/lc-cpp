import axios from 'axios';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { DashboardStatistics } from '@/lib/data';

// Create a new Axios instance for the dashboard API
const dashboardApi = axios.create({
    baseURL: API_ENDPOINTS.DASHBOARD.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptors for the dashboard API
dashboardApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('📤 Dashboard API Request:', config);
        return config;
    },
    (error) => {
        console.error('❌ Dashboard API Request Error:', error);
        return Promise.reject(error);
    }
);

dashboardApi.interceptors.response.use(
    (response) => {
        console.log('📥 Dashboard API Response:', response);
        return response;
    },
    async (error) => {
        console.error('❌ Dashboard API Response Error:', error);
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                console.log('🔄 Attempting token refresh with refreshToken:', refreshToken);
                // Handle token refresh logic here if needed
                localStorage.clear();
                window.location.href = '/auth/login';
            } catch (refreshError) {
                console.error('❌ Token refresh failed:', refreshError);
                localStorage.clear();
                window.location.href = '/auth/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export const dashboardService = {
    getDashboardData: async (): Promise<DashboardStatistics> => {
        console.log('📡 Fetching dashboard data...');
        const response = await dashboardApi.get(API_ENDPOINTS.DASHBOARD.DASHBOARD);
        console.log('✅ Dashboard data fetched successfully:', response.data);
        return dashboardService.mapToDashboardStatistics(response.data);
    },

    mapToDashboardStatistics: (data: any): DashboardStatistics => {
        console.log('🔄 Mapping dashboard data to DashboardStatistics type:', data);
        const mappedData: DashboardStatistics = {
            rewardWallet: {
                balance: data.rewardWallet.balance,
                currency: data.rewardWallet.currency,
                lastUpdated: data.rewardWallet.lastUpdated,
            },
            totalDeposits: {
                amount: data.totalDeposits.amount,
                currency: data.totalDeposits.currency,
                lastUpdated: data.totalDeposits.lastUpdated,
                chartData: data.totalDeposits.chartData || [],
            },
            directRecruitment: {
                earnings: data.directRecruitment.earnings,
                currency: data.directRecruitment.currency,
                lastUpdated: data.directRecruitment.lastUpdated,
            },
            agentProfile: {
                name: data.agentProfile.name,
                level: data.agentProfile.level,
                activeUsers: {
                    current: data.agentProfile.activeUsers.current,
                    target: data.agentProfile.activeUsers.target,
                    percentage: data.agentProfile.activeUsers.percentage,
                    remaining: data.agentProfile.activeUsers.remaining,
                },
            },
            totalDirectRecruit: {
                count: data.totalDirectRecruit.count,
                agentsToPartner: data.totalDirectRecruit.agentsToPartner,
            },
            referralCode: data.referralCode,
            depositActivities: data.depositActivities.map((activity: any) => ({
                id: activity.id,
                description: activity.description,
                amount: activity.amount,
                dateTime: activity.dateTime,
                type: activity.type,
                status: activity.status,
                transactionHash: activity.transactionHash,
            })),
        };
        console.log('✅ Mapped dashboard data:', mappedData);
        return mappedData;
    },
};
