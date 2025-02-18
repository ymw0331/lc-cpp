// utils/permissions.ts
export const TIER_PERMISSIONS = {
    MIN_TIER_FOR_INCENTIVES: 2,
    MIN_TIER_FOR_RECRUITMENT: 2, // Only those of min level 2 can access to this page
    MILESTONE_BONUS_TIER: 1, // Only level 1 agents can see milestone bonus
} as const;

export const checkTierPermission = (userTierPriority: number, requiredTier: number) => {
    return userTierPriority >= requiredTier;
};