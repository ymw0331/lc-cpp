export const API_ENDPOINTS = {
    AUTH: {
        BASE_URL: process.env.NEXT_PUBLIC_AUTH_API_URL,
        LOGIN: `${process.env.NEXT_PUBLIC_AUTH_PATH}/login`,
    },
    RESELLER: {
        BASE_URL: process.env.NEXT_PUBLIC_RESELLER_API_URL,
        INFO: `${process.env.NEXT_PUBLIC_RESELLER_PATH}`,
        PROFILE: `${process.env.NEXT_PUBLIC_RESELLER_PATH}/profile`,
        DASHBOARD: `${process.env.NEXT_PUBLIC_RESELLER_PATH}/dashboard`,
        REWARDS: `${process.env.NEXT_PUBLIC_RESELLER_PATH}/rewards`,
        ACCOUNT: `${process.env.NEXT_PUBLIC_RESELLER_PATH}/account`,
        TRANSFER: `${process.env.NEXT_PUBLIC_RESELLER_PATH}/aggregate`,
    },
} as const;

// NEXT_PUBLIC_RESELLER_API_URL=https://api.reseller.lookcard.io
// NEXT_PUBLIC_RESELLER_PATH=/app/reseller


// https://api.reseller.lookcard.io/app/reseller/account


// Add validation to ensure env variables exist
if (!process.env.NEXT_PUBLIC_AUTH_API_URL) throw new Error('AUTH_API_URL not found');
if (!process.env.NEXT_PUBLIC_RESELLER_API_URL) throw new Error('RESELLER_API_URL not found');
if (!process.env.NEXT_PUBLIC_AUTH_PATH) throw new Error('AUTH_PATH not found');
if (!process.env.NEXT_PUBLIC_RESELLER_PATH) throw new Error('RESELLER_PATH not found');