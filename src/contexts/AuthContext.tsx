'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authApi } from '@/api/auth/auth.api';
import { profileApi } from '@/api/profile/profile.api'; // Add this
import { storage } from '@/lib/storage';
import type { AuthUser } from '@/api/auth/auth.types';
import type { ProfileResponse } from '@/api/profile/profile.types';
import { resellerApi } from '@/api/reseller/reseller.api';

// Enhance AuthUser type with additional fields
interface EnhancedAuthUser extends AuthUser {
    profileName: string;
    avatarUrl: string | null;
    tierPriority: number;
    role: string;
}

interface AuthContextType {
    user: EnhancedAuthUser | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    refreshUserData: () => Promise<void>; // Add this for manual refresh
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<EnhancedAuthUser | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    // Fetch additional user data
    const fetchUserData = async (baseUser: AuthUser) => {
        try {
            // Fetch both profile and reseller data in parallel
            const [profileData, resellerData] = await Promise.all([
                profileApi.getProfile(),
                resellerApi.getResellerInfo()
            ]);

            const enhancedUser: EnhancedAuthUser = {
                ...baseUser,
                avatarUrl: profileData.avatarUrl,
                role: profileData.role,
                profileName: profileData.name,
                tierPriority: resellerData.tier.priority,
            };

            storage.setUser(enhancedUser);
            setUser(enhancedUser);

            console.log('[Auth] Enhanced user data:', {
                userId: enhancedUser.userId,
                hasAvatar: !!enhancedUser.avatarUrl,
                tierPriority: enhancedUser.tierPriority,
                profileName: enhancedUser.profileName,
            });
        } catch (error) {
            console.error('[Auth] Error fetching additional user data:', error);
            // Still set the base user if additional data fetch fails
            setUser(baseUser as EnhancedAuthUser);
        }
    };

    useEffect(() => {
        const storedUser = storage.getUser();
        console.log('[Auth] Initial auth check:', { hasStoredUser: !!storedUser, pathname });

        if (storedUser) {
            // Check if we need to fetch additional data
            if (!('avatarUrl' in storedUser) || !('level' in storedUser)) {
                fetchUserData(storedUser);
            } else {
                setUser(storedUser as EnhancedAuthUser);
            }
        } else if (pathname !== '/auth/login') {
            console.log('[Auth] No stored user, redirecting to login');
            router.push('/auth/login');
        }
    }, [pathname, router]);

    const login = async (email: string, password: string) => {
        console.log('[Auth] Login attempt:', { email });

        try {
            const response = await authApi.login({
                email,
                password,
                fcmId: '',
            });

            console.log('[Auth] Login response:', {
                status: response.status,
                userId: response.data?.userId,
                firstLogin: response.data?.firstLogin
            });

            if (response.status) {
                const baseUserData: AuthUser = {
                    userId: response.data.userId,
                    uid: response.data.uid,
                    username: response.data.username,
                    email: response.data.email,
                    phoneNumber: response.data.phoneNumber,
                    country_code: response.data.country_code,
                    fullName: response.data.fullName,
                    token: response.data.token,
                    refreshToken: response.data.refreshToken,
                    cardId: response.data.cardId,
                    cards: response.data.cards,
                    ekycStatus: response.data.ekycStatus,
                    ekycReviewStatus: response.data.ekycReviewStatus,
                    cardStatus: response.data.cardStatus,
                    firstLogin: response.data.firstLogin,
                };

                storage.setToken(response.data.token);
                storage.setRefreshToken(response.data.refreshToken);

                // Fetch additional data after successful login
                await fetchUserData(baseUserData);

                router.push('/');
            }
        } catch (error: any) {
            console.error('[Auth] Login error:', {
                message: error.message,
                response: error.response?.data
            });
            throw error;
        }
    };

    const refreshUserData = async () => {
        if (user) {
            await fetchUserData(user);
        }
    };

    const logout = () => {
        console.log('[Auth] Logging out user');
        storage.clearAuth();
        setUser(null);
        router.push('/auth/login');
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            logout,
            refreshUserData
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};