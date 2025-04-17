import axios from 'axios';
import { API_ENDPOINTS } from '@/api/config/endpoints';
import { storage } from '@/lib/storage';

const authInstance = axios.create({
    baseURL: API_ENDPOINTS.AUTH.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
authInstance.interceptors.request.use(
    (config) => {
        const token = storage.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('[API] Request:', {
            url: config.url,
            method: config.method,
            hasToken: !!token
        });
        return config;
    },
    (error) => {
        console.error('[API] Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
authInstance.interceptors.response.use(
    (response) => {
        console.log('[API] Response:', {
            url: response.config.url,
            status: response.status,
            success: response.data?.status
        });
        return response;
    },
    async (error) => {
        console.error('[API] Response error:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.response?.data?.message
        });

        if (error.response?.status === 401) {
            storage.clearAuth();
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);


export default authInstance;