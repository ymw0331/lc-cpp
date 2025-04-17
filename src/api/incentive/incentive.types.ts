export interface IncentiveData {
    activities: {
        activities: {
            [key: string]: Array<{
                type: string;
                amount: number;
                datetime: string;
                from: {
                    name: string;
                    email: string;
                };
            }>;
        };
    };
    summary: {
        total_incentive: number;
        milestoneAchievement: {
            activatedUsers: number;
            targetUsers: number;
            completeAt: string | null;
            milestones: Array<{
                months: number;
                date: string;
                reward: number;
            }>;
            milestone_bonus: number;
        };
        directReferralFee: number;
        directTopupRebate: number;
        downstreamReferralFee: number;
        downstreamTopupRebate: number;
        directRecruitLevelAdvancementBonus: number;
        performance_bonus: {
            amount: number;
            activeUsers: number;
        };
    };
}