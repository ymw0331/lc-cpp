import axios from 'axios';
import { API_ENDPOINTS } from './endpoints';
import { storage } from '@/lib/storage';

const resellerAxiosInstance = axios.create({
    baseURL: API_ENDPOINTS.RESELLER.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


// Request interceptor
resellerAxiosInstance.interceptors.request.use(
    (config) => {
        const token = storage.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('[Reseller API] Request:', {
            url: config.url,
            method: config.method,
            hasToken: !!token
        });
        return config;
    },
    (error) => {
        console.error('[Reseller API] Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
resellerAxiosInstance.interceptors.response.use(
    (response) => {
        console.log('[Reseller API] Response:', {
            url: response.config.url,
            status: response.status,
        });
        return response;
    },
    async (error) => {
        console.error('[Reseller API] Response error:', {
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

export default resellerAxiosInstance;