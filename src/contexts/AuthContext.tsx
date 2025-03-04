'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authApi } from '@/api/auth/auth.api';
import { resellerApi } from '@/api/reseller/reseller.api';
import { storage } from '@/lib/storage';
import type { AuthUser } from '@/api/auth/auth.types';

interface EnhancedAuthUser extends AuthUser {
    resellerId: string;
    tierPriority: number;
    referralCode: string;
}

interface AuthContextType {
    user: EnhancedAuthUser | null;
    isAuthenticated: boolean;
    isReseller: boolean; // Added this
    login: (email: string, password: string) => Promise<boolean>; // Modified to return boolean
    logout: () => void;
    refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<EnhancedAuthUser | null>(null);
    const [isReseller, setIsReseller] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const checkResellerStatus = async (): Promise<boolean> => {
        try {
            const resellerData = await resellerApi.getResellerInfo();
            // User is a reseller only if resellerData exists AND has an id
            return !!(resellerData && resellerData.id);
        } catch (error) {
            console.error('[Auth] Error checking reseller status:', error);
            return false;
        }
    }

    const fetchUserData = async (baseUser: AuthUser) => {
        try {

            const resellerData = await resellerApi.getResellerInfo();

            setIsReseller(!!resellerData); // Set reseller status

            const enhancedUser: EnhancedAuthUser = {
                ...baseUser,
                tierPriority: resellerData?.tier?.priority || 0,
                referralCode: resellerData?.code || '',
                resellerId: resellerData?.id || '',
            };

            storage.setUser(enhancedUser);
            setUser(enhancedUser);

            console.log('[Auth] Enhanced user data:', {
                userId: enhancedUser.userId,
                tierPriority: enhancedUser.tierPriority,
                isReseller: !!resellerData,
                referralCode: enhancedUser.referralCode,
                resellerId: enhancedUser.resellerId,
            });
        } catch (error) {
            console.error('[Auth] Error fetching additional user data:', error);
            setUser(baseUser as EnhancedAuthUser);
            setIsReseller(false);
        }
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        console.log('[Auth] Login attempt:', { email });

        try {
            const response = await authApi.login({
                email,
                password,
                fcmId: '',
            });

            if (response.status) {
                // Always store tokens on successful login
                console.log('[Auth] Storing auth tokens');
                storage.setToken(response.data.token);
                storage.setRefreshToken(response.data.refreshToken);

                // Check reseller status first
                const isUserReseller = await checkResellerStatus();
                setIsReseller(isUserReseller);

                // if (!isUserReseller) {
                //     // Clear auth if not a reseller
                //     storage.clearAuth();
                //     return false;
                // }

                if (!isUserReseller) {
                    console.log('[Auth] User is not a reseller, but keeping auth tokens for registration');
                    return false; // Return false but DON'T clear auth
                }

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

                await fetchUserData(baseUserData);
                router.push('/');
                return true;
            }
            return false;
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
            // Also check reseller status during refresh
            const isUserReseller = await checkResellerStatus();
            setIsReseller(isUserReseller);
        }
    };

    const logout = () => {
        console.log('[Auth] Logging out user');
        storage.clearAuth();
        setUser(null);
        setIsReseller(false); // Reset reseller status on logout
        router.push('/auth/login');
    };

    // useEffect(() => {
    //     const storedUser = storage.getUser();
    //     console.log('[Auth] Initial auth check:', { hasStoredUser: !!storedUser, pathname });

    //     if (storedUser) {
    //         if (!('avatarUrl' in storedUser) || !('level' in storedUser)) {
    //             fetchUserData(storedUser);
    //         } else {
    //             setUser(storedUser as EnhancedAuthUser);
    //             // Check reseller status on initial load
    //             checkResellerStatus().then(setIsReseller);
    //         }
    //     } else if (pathname !== '/auth/login') {
    //         console.log('[Auth] No stored user, redirecting to login');
    //         router.push('/auth/login');
    //     }
    // }, [pathname, router]);


    useEffect(() => {
        const storedUser = storage.getUser();
        console.log('[Auth] Initial auth check:', { hasStoredUser: !!storedUser, pathname });

        if (storedUser) {
            // Simply set user and check reseller status
            setUser(storedUser as EnhancedAuthUser);
            // Check reseller status on initial load
            checkResellerStatus().then(setIsReseller);
        } else if (pathname !== '/auth/login' && pathname !== '/auth/register') {
            console.log('[Auth] No stored user, redirecting to login');
            router.push('/auth/login');
        }
    }, [pathname, router]);

    
    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isReseller,
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