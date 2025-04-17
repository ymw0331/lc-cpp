import resellerAxios from '@/api/config/reseller.config';
import { API_ENDPOINTS } from '@/api/config/endpoints';
import { IncentiveData } from '@/api/incentive/incentive.types';

// Function to calculate milestone bonus
const calculateMilestoneBonus = (
    activatedUsers: number,
    targetUsers: number,
    milestones: Array<{ months: number; date: string; reward: number }>,
    completeAt: string | null
): number => {
    // If not completed or no completion date, no bonus
    if (!completeAt || activatedUsers < targetUsers) return 0;

    const completionDate = new Date(completeAt);

    // Sort milestones by months in ascending order (earliest first)
    const sortedMilestones = [...milestones].sort((a, b) => a.months - b.months);

    // Find the first milestone where the completion date is before or equal to the milestone date
    const achievedMilestone = sortedMilestones.find(milestone => {
        const milestoneDate = new Date(milestone.date);
        return completionDate <= milestoneDate;
    });

    // Return the reward for the achieved milestone, or 0 if no milestone was achieved
    return achievedMilestone?.reward || 0;
};

export const incentiveApi = {
    getIncentiveData: async (): Promise<IncentiveData> => {
        const response = await resellerAxios.get(API_ENDPOINTS.RESELLER.REWARDS);

        const milestoneBonus = calculateMilestoneBonus(
            response.data.summary.milestoneAchievement.activatedUsers,
            response.data.summary.milestoneAchievement.targetUsers,
            response.data.summary.milestoneAchievement.milestones,
            response.data.summary.milestoneAchievement.completeAt
        );

        return {
            activities: response.data.activities,
            summary: {
                total_incentive: response.data.summary.total_incentive,
                milestoneAchievement: {
                    ...response.data.summary.milestoneAchievement,
                    milestone_bonus: milestoneBonus
                },
                directReferralFee: response.data.summary.directReferralFee,
                directTopupRebate: response.data.summary.directTopupRebate,
                downstreamReferralFee: response.data.summary.downstreamReferralFee,
                downstreamTopupRebate: response.data.summary.downstreamTopupRebate,
                directRecruitLevelAdvancementBonus: response.data.summary.directRecruitLevelAdvancementBonus,
                performance_bonus: {
                    amount: response.data.summary.performance_bonus.amount,
                    activeUsers: response.data.summary.performance_bonus.activeUsers
                }
            }
        };
    }
};