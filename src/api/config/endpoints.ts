export const API_ENDPOINTS = {
    AUTH: {
        BASE_URL: 'https://api.lookcard.io/v2/api',
        LOGIN: '/auth-zqg2muwph/login',
    },
    RESELLER: {
        BASE_URL: 'https://api.reseller.lookcard.io/',
        PROFILE: '/app/reseller/profile',
        INFO: '/app/reseller',
        DASHBOARD: '/app/reseller/dashboard',
    },
} as const;