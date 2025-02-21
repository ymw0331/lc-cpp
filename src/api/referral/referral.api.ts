// recruit.api.ts
import { ChartDataPoint } from "@/types/dashboard";
import { dashboardApi } from "../dashboard/dashboard.api";

export interface RecruitData {
    count: number;
    agentsToPartner: {
        count: number;
        trend: 'up' | 'down';
    };
    chartData: {
        Week: ChartDataPoint[];
        Month: ChartDataPoint[];
        Year: ChartDataPoint[];
    };
}

export const recruitApi = {
    getRecruitData: async (): Promise<RecruitData> => {
        try {
            const dashboardData = await dashboardApi.getDashboardData();

            return {
                count: dashboardData.totalDirectRecruit.count ?? 0,
                agentsToPartner: {
                    count: dashboardData.totalDirectRecruit.agentsToPartner ?? 0, // Placeholder until backend provides this
                    trend: 'up', // Default trend
                },
                chartData: {
                    Week: [], // Empty until backend provides data
                    Month: [],
                    Year: []
                }
            };
        } catch (error) {
            console.error('Error fetching recruit data:', error);
            return {
                count: 0,
                agentsToPartner: {
                    count: 0,
                    trend: 'up'
                },
                chartData: {
                    Week: [],
                    Month: [],
                    Year: []
                }
            };
        }
    }
};
