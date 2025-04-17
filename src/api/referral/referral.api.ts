import { ChartDataPoint } from "@/api/dashboard/dashboard.types";
import { dashboardApi } from "@/api/dashboard/dashboard.api";
import { incentiveApi } from "@/api/incentive/incentive.api";
import { API_ENDPOINTS } from "@/api/config/endpoints";
import resellerAxios from "@/api/config/reseller.config";
import { RecruitData, DownstreamChartParams, DownstreamChartResponse } from "@/api/referral/referral.types";

/**
 * Calculate which milestone the user is at based on activated users and completion date
 */
const processMilestoneData = (
    activatedUsers: number,
    targetUsers: number,
    milestones: Array<{ months: number; reward: number; date?: string }>,
    completeAt: string | null
) => {
    // If not completed, find current milestone based on progress
    if (!completeAt || activatedUsers < targetUsers) {
        // Find the current milestone (the one user is working towards)
        const sortedMilestones = [...milestones].sort((a, b) => a.months - b.months);
        
        return sortedMilestones.map(milestone => {
            // No milestones completed yet, so mark the first one as current
            if (milestone === sortedMilestones[0]) {
                return { 
                    ...milestone, 
                    isCurrent: true,
                    isCompleted: false 
                };
            }
            
            return { 
                ...milestone,
                isCurrent: false,
                isCompleted: false
            };
        });
    }
    
    // If completed, find which milestone was achieved
    const completionDate = new Date(completeAt);
    const sortedMilestones = [...milestones].sort((a, b) => a.months - b.months);
    
    // Find the milestone index where completion occurred
    let achievedIndex = -1;
    
    for (let i = 0; i < sortedMilestones.length; i++) {
        const milestone = sortedMilestones[i];
        if (!milestone.date) continue;
        
        const milestoneDate = new Date(milestone.date);
        if (completionDate <= milestoneDate) {
            achievedIndex = i;
            break;
        }
    }
    
    // If no achievement found, default to last milestone
    if (achievedIndex === -1) {
        achievedIndex = sortedMilestones.length - 1;
    }
    
    // Mark milestones as completed or current
    return sortedMilestones.map((milestone, index) => {
        if (index < achievedIndex) {
            // Earlier milestones are all completed
            return { 
                ...milestone, 
                isCompleted: true,
                isCurrent: false
            };
        } else if (index === achievedIndex) {
            // The achieved milestone is both completed and current
            return { 
                ...milestone, 
                isCompleted: true,
                isCurrent: true
            };
        } else {
            // Later milestones are not completed
            return { 
                ...milestone,
                isCompleted: false,
                isCurrent: false
            };
        }
    });
};


export const recruitApi = {
    getRecruitData: async (): Promise<RecruitData> => {
        try {
            // Get both dashboard and incentive data
            const [dashboardData, incentiveData] = await Promise.all([
                dashboardApi.getDashboardData(),
                incentiveApi.getIncentiveData()
            ]);

            // Extract milestone data from incentive API if available
            let milestoneAchievement;
            
            if (incentiveData?.summary?.milestoneAchievement) {
                const incentiveMilestone = incentiveData.summary.milestoneAchievement;
                
                // Process milestone data to add proper completion status
                const processedMilestones = processMilestoneData(
                    incentiveMilestone.activatedUsers,
                    incentiveMilestone.targetUsers,
                    incentiveMilestone.milestones,
                    incentiveMilestone.completeAt
                );
                
                milestoneAchievement = {
                    activatedUsers: incentiveMilestone.activatedUsers,
                    targetUsers: incentiveMilestone.targetUsers,
                    completeAt: incentiveMilestone.completeAt,
                    milestones: processedMilestones,
                    milestone_bonus: incentiveMilestone.milestone_bonus
                };
            } else {
                // Fallback to dashboard data if incentive data not available
                milestoneAchievement = {
                    activatedUsers: dashboardData.directReferredVolume.activeDirectReffered ?? 0,
                    targetUsers: 80,
                    milestones: [
                        { months: 3, reward: 500, isCurrent: true },
                        { months: 4, reward: 400 },
                        { months: 6, reward: 300 }
                    ]
                };
            }

            return {
                // count: dashboardData.totalDirectRecruit.count ?? 0,
                count: dashboardData.directReferredVolume.totalNumberOfAccountsRegistered ?? 0,
                agentsToPartner: {
                    count: dashboardData.directReferredVolume.agentsToPartner ?? 0,
                    trend: 'up',
                },
                chartData: {
                    Week: [],
                    Month: [],
                    Year: []
                },
                // Placeholder data for recruitment summary
                recruitmentSummary: {
                    noOfDirectReferrals: dashboardData.totalReferral ?? 0,
                    totalDepositFromDirectReferrals: dashboardData.totalDepositFromDirectReferral ?? 0
                },

                agentRecruitmentSummary: {
                    directRecruitVolume: dashboardData.directAgent.directRecruitAgentVolume ?? 0,
                    depositVolume: dashboardData.directAgent.directRecruitAgentDepositVolume ?? 0,
                },

                // Use processed milestone achievement data
                milestoneAchievement
            };
        } catch (error) {
            console.error('Error fetching recruit data:', error);
            // Fallback data structure for error case
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
    },

    getDownstreamChartData: async (params: DownstreamChartParams): Promise<DownstreamChartResponse> => {
        try {
            const { year, month } = params;
            let url = `${API_ENDPOINTS.RESELLER.DOWNSTREAM_CHART}?year=${year}`;
            
            if (month) {
                url += `&month=${month}`;
            }

            const response = await resellerAxios.get(url);
            return response.data;
        } catch (error) {
            console.error('[Referral API] Error fetching downstream chart data:', error);
            // Return default data structure with zeros for better user experience
            return {
                totalDownstream: 0,
                chartDataYear: Array.from({ length: 12 }, (_, i) => ({
                    date: `${params.year}-${String(i + 1).padStart(2, '0')}`,
                    value: 0
                })),
                chartDataMonth: params.month ? 
                    Array.from({ length: 31 }, (_, i) => ({
                        date: `${params.year}-${String(params.month).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`,
                        value: 0
                    })) : []
            };
        }
    },

    formatDownstreamChartData: (data: DownstreamChartResponse): {
        Month: ChartDataPoint[];
        Year: ChartDataPoint[];
    } => {
        // Format Year data
        const yearData = data.chartDataYear.map((item: { date: string; value: number }) => ({
            label: item.date.substring(5), // Extract "MM" from "YYYY-MM"
            value: item.value
        }));

        // Format Month data
        const monthData = data.chartDataMonth.map((item: { date: string; value: number }) => ({
            label: item.date.substring(8), // Extract "DD" from "YYYY-MM-DD"
            value: item.value
        }));

        return {
            Month: monthData,
            Year: yearData
        };
    }
};
