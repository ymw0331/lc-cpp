export const API_ENDPOINTS = {
    AUTH: {
        BASE_URL: 'https://api.lookcard.io/v2/api',
        LOGIN: '/auth-zqg2muwph/login',
    },
    DASHBOARD: {
        BASE_URL: 'https://api.reseller.lookcard.io',
        DASHBOARD: '/app/reseller/dashboard',
    },
} as const;

console.log('🔗 API_ENDPOINTS initialized:', API_ENDPOINTS);
