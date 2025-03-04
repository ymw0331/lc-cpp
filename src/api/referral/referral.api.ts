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

    // Recruitment summary data
    recruitmentSummary: {
        noOfDirectReferrals: number;
        totalDepositFromDirectReferrals: number;
    };

    // Agent recruitment summary data
    agentRecruitmentSummary: {
        directRecruitVolume: number | null;
        depositVolume: number | null;
    };

    // Milestone achievement data (for Level 1 agents)
    milestoneAchievement: {
        activatedUsers: number;
        targetUsers: number;
        milestones: Array<{
            months: number;
            reward: number;
            isCompleted?: boolean;
            isCurrent?: boolean;
        }>;
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
                },
                // Placeholder data for recruitment summary
                recruitmentSummary: {
                    noOfDirectReferrals: 0,
                    totalDepositFromDirectReferrals: 0,
                },

                // Placeholder data for agent recruitment summary
                agentRecruitmentSummary: {
                    directRecruitVolume: null, // N/A as shown in screenshot
                    depositVolume: null, // N/A as shown in screenshot
                },

                // Placeholder data for milestone achievement
                milestoneAchievement: {
                    activatedUsers: dashboardData.totalDirectRecruit.count ?? 0, // Placeholder
                    targetUsers: 80,
                    milestones: [
                        { months: 3, reward: 500, isCurrent: true },
                        { months: 4, reward: 400 },
                        { months: 6, reward: 300 }
                    ]
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
                },
                recruitmentSummary: {
                    noOfDirectReferrals: 0,
                    totalDepositFromDirectReferrals: 0,
                },
                agentRecruitmentSummary: {
                    directRecruitVolume: null,
                    depositVolume: null,
                },
                milestoneAchievement: {
                    activatedUsers: 0,
                    targetUsers: 80,
                    milestones: [
                        { months: 3, reward: 500 },
                        { months: 4, reward: 400 },
                        { months: 6, reward: 300 }
                    ]
                }
            };
        }
    }
};
