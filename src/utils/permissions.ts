// utils/permissions.ts
export const TIER_PERMISSIONS = {
    MIN_TIER_FOR_RECRUITMENT: 2,
    MIN_TIER_FOR_INCENTIVES: 2,
    // ... other tier-based permissions
} as const;

export const checkTierPermission = (userTierPriority: number, requiredTier: number) => {
    return userTierPriority >= requiredTier;
};