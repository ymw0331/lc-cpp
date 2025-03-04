export const TIER_PERMISSIONS = {
    LEVEL_2_TIER: 2,
    LEVEL_1_TIER: 1, // Only level 1 agents can see milestone bonus
} as const;

export const checkTierPermission = (userTierPriority: number, requiredTier: number) => {
    return userTierPriority >= requiredTier;
};