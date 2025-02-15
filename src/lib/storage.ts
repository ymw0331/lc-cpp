import { AuthUser } from "@/api/auth/auth.types";

const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    AUTH_USER: 'auth_user',
} as const;

export const storage = {
    getToken: () => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        console.log('[Storage] Getting auth token:', { hasToken: !!token });
        return token;
    },

    setToken: (token: string) => {
        console.log('[Storage] Setting auth token');
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    },

    removeToken: () => {
        console.log('[Storage] Removing auth token');
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    },

    getRefreshToken: () => {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        console.log('[Storage] Getting refresh token:', { hasRefreshToken: !!refreshToken });
        return refreshToken;
    },

    setRefreshToken: (token: string) => {
        console.log('[Storage] Setting refresh token');
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    },

    removeRefreshToken: () => {
        console.log('[Storage] Removing refresh token');
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    },

    getUser: () => {
        const userStr = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
        let user = null;

        try {
            user = userStr ? JSON.parse(userStr) : null;
            console.log('[Storage] Getting user:', {
                hasUser: !!user,
                userId: user?.userId,
                email: user?.email
            });
        } catch (error) {
            console.error('[Storage] Error parsing stored user:', error);
        }

        return user;
    },

    setUser: (user: AuthUser) => {
        try {
            console.log('[Storage] Setting user:', {
                userId: user.userId,
                email: user.email
            });
            localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
        } catch (error) {
            console.error('[Storage] Error storing user:', error);
            throw error; // Re-throw to handle in the calling code
        }
    },

    removeUser: () => {
        console.log('[Storage] Removing user');
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    },

    clearAuth: () => {
        console.log('[Storage] Clearing all auth data');
        try {
            const previousUser = storage.getUser();
            console.log('[Storage] Clearing data for user:', {
                userId: previousUser?.userId,
                email: previousUser?.email
            });

            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.AUTH_USER);

            console.log('[Storage] Successfully cleared all auth data');
        } catch (error) {
            console.error('[Storage] Error while clearing auth data:', error);
            // Still attempt to remove everything even if there's an error
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
        }
    },
};