import axios from 'axios';
import { API_ENDPOINTS } from './endpoints';

const api = axios.create({
    baseURL: API_ENDPOINTS.AUTH.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('📤 API Request:', config);
        return config;
    },
    (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        console.log('📥 API Response:', response);
        return response;
    },
    async (error) => {
        console.error('❌ API Response Error:', error);
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                console.log('🔄 Attempting token refresh with refreshToken:', refreshToken);
                // Handle token refresh logic here if needed
                localStorage.clear();
                window.location.href = '/auth/login';
            } catch (refreshError) {
                console.error('❌ Token refresh failed:', refreshError);
                localStorage.clear();
                window.location.href = '/auth/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
