export const API_ENDPOINTS = {
    AUTH: {
        BASE_URL: 'https://api.lookcard.io/v2/api',
        LOGIN: '/auth-zqg2muwph/login',
    },
    RESELLER: {
        BASE_URL: 'https://api.reseller.lookcard.io/',
        INFO: '/app/reseller',
        PROFILE: '/app/reseller/profile',
        DASHBOARD: '/app/reseller/dashboard',
        REWARDS: '/app/reseller/rewards',
    },
} as const;