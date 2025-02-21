// performance.api.ts
import { dashboardApi } from "../dashboard/dashboard.api";
import { resellerApi } from "../reseller/reseller.api";

export interface PerformanceData {
    cardActivationVolume: {
        currentValue: number;
        targetValue: number;
        percentage: number;
        remaining: number;
    };
    totalAgentRecruitment: {
        currentValue: number;
        targetValue: number;
        percentage: number;
        remaining: number;
    };
    nextLevelCard: {
        currentLevel: string;
        progress: number;
        isMaxLevel: boolean;
        avatarUrl?: string;
        name: string;
    };
    salesSummary: {
        groupSales: number;
        personalSales: number;
    };
    salesVolumeData: any[]; // Placeholder for future implementation
}

export const performanceApi = {
    getPerformanceData: async (): Promise<PerformanceData> => {
        try {
            // Fetch dashboard and reseller data concurrently
            const [dashboardData, resellerData] = await Promise.all([
                dashboardApi.getDashboardData(),
                resellerApi.getResellerInfo()
            ]);

            return {
                cardActivationVolume: {
                    currentValue: dashboardData.agentProfile.activeUsers.current,
                    targetValue: dashboardData.agentProfile.activeUsers.target,
                    percentage: dashboardData.agentProfile.activeUsers.percentage,
                    remaining: dashboardData.agentProfile.activeUsers.remaining
                },
                totalAgentRecruitment: {
                    currentValue: dashboardData.totalDirectRecruit.count,
                    targetValue: dashboardData.totalDirectRecruit.agentsToPartner,
                    percentage: dashboardData.totalDirectRecruit.count
                        ? Math.round((dashboardData.totalDirectRecruit.count / dashboardData.totalDirectRecruit.agentsToPartner) * 100)
                        : 0,
                    remaining: dashboardData.totalDirectRecruit.agentsToPartner - dashboardData.totalDirectRecruit.count
                },
                nextLevelCard: {
                    currentLevel: resellerData.tier.name,
                    progress: 0, // Placeholder, will need backend support
                    isMaxLevel: false, // Placeholder, will need backend support
                    name: resellerData.tier.name,
                    avatarUrl: undefined // Placeholder
                },
                salesSummary: {
                    groupSales: 0, // Coming soon
                    personalSales: 0 // Coming soon
                },
                salesVolumeData: [] // Coming soon
            };
        } catch (error) {
            console.error('Error fetching performance data:', error);

            // Instead of returning default values, you can:
            // 1. Rethrow the error
            throw error;

            // OR 2. Return a more informative error response
            // return {
            //     error: true,
            //     message: error instanceof Error ? error.message : 'Failed to fetch performance data',
            //     details: error
            // };
        }
    }
};