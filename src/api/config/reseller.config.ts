import axios, { AxiosError } from 'axios';
import { API_ENDPOINTS } from '@/api/config/endpoints';
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
        } else {
            console.warn('[Reseller API] No token found');
        }

        console.log('[Reseller API] Request:', {
            url: config.url,
            method: config.method,
            hasToken: !!token,
            headers: config.headers
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
            data: response.data
        });
        return response;
    },
    (error: AxiosError) => {
        if (error.response) {
            console.error('[Reseller API] Response error:', {
                url: error.config?.url,
                status: error.response.status,
                data: error.response.data,
                headers: error.config?.headers
            });

            // Handle 401 Unauthorized
            if (error.response.status === 401) {
                storage.clearAuth();
                // Use location.replace for cleaner redirect
                window.location.replace('/auth/login');
                return Promise.reject(new Error('Unauthorized - redirecting to login'));
            }

            // Handle empty response data
            if (!error.response.data) {
                return Promise.reject(new Error(`API Error: ${error.response.status} - Empty response`));
            }

            // Handle specific error cases
            if (error.response.status === 404) {
                return Promise.reject(new Error('Resource not found'));
            }
            if (error.response.status === 500) {
                return Promise.reject(new Error('Server error'));
            }

            // Return the error response data if available
            return Promise.reject(error.response.data);

        } else if (error.request) {
            console.error('[Reseller API] Network error:', {
                url: error.config?.url,
                message: 'No response received'
            });
            return Promise.reject(new Error('Network error - no response received'));
        } else {
            console.error('[Reseller API] Request setup error:', {
                message: error.message
            });
            return Promise.reject(error);
        }
    }
);

export default resellerAxiosInstance;