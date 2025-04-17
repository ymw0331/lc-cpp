'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authApi } from '@/api/auth/auth.api';
import { resellerApi } from '@/api/reseller/reseller.api';
import { storage } from '@/lib/storage';
import { expandUUID } from '@/lib/url-utils'; // Import the expandUUID function
import type { AuthUser } from '@/api/auth/auth.types';

export interface EnhancedAuthUser extends AuthUser {
    resellerId: string;
    tierPriority: number;
    referralCode: string;
}

interface AuthContextType {
    user: EnhancedAuthUser | null;
    isAuthenticated: boolean;
    isReseller: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    refreshUserData: () => Promise<void>;
}

// Helper function to check if a path is a short invite URL
const isShortInvitePath = (path: string) => {
    return path.startsWith('/i/') && path.split('/').length >= 4;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<EnhancedAuthUser | null>(null);
    const [isReseller, setIsReseller] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const checkResellerStatus = async (): Promise<boolean> => {
        try {
            const resellerData = await resellerApi.getCurrentReseller();
            // User is a reseller only if resellerData exists AND has an id
            return !!(resellerData && resellerData.id);
        } catch (error) {
            console.error('[Auth] Error checking reseller status:', error);
            return false;
        }
    }

    const fetchUserData = async (baseUser: AuthUser) => {
        try {
            const resellerData = await resellerApi.getCurrentReseller();
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
    // Function to redirect to login with parameters if coming from a short URL
    const redirectToLoginWithParams = () => {
        if (isShortInvitePath(pathname)) {
            const parts = pathname.split('/');
            const referralCode = parts[2];
            const shortId = parts[3];

            if (referralCode && shortId) {
                try {
                    const upstreamId = expandUUID(shortId);
                    console.log('[Auth] Redirecting to login with preserved parameters:', { referralCode, upstreamId });
                    router.push(`/auth/login?referralCode=${referralCode}&upstreamId=${upstreamId}`);
                } catch (error) {
                    console.error('[Auth] Error expanding shortId:', error);
                    router.push('/auth/login');
                }
                return true; // Redirect handled
            }
        }
        return false; // Redirect not handled
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
                // Store tokens on successful login
                console.log('[Auth] Storing auth tokens');
                storage.setToken(response.data.token);
                storage.setRefreshToken(response.data.refreshToken);

                // Create base user data from response
                const baseUserData: AuthUser = {
                    userId: response.data.userId,
                    uid: response.data.uid,
                    username: response.data.username,
                    email: response.data.email,
                    phoneNumber: response.data.phoneNumber || 'N/A',
                    country_code: response.data.country_code,
                    fullName: response.data.fullName || 'N/A',
                    token: response.data.token,
                    refreshToken: response.data.refreshToken,
                    cardId: response.data.cardId,
                    cards: response.data.cards,
                    ekycStatus: response.data.ekycStatus,
                    ekycReviewStatus: response.data.ekycReviewStatus,
                    cardStatus: response.data.cardStatus,
                    firstLogin: response.data.firstLogin,
                };

                // Check reseller status
                const isUserReseller = await checkResellerStatus();
                setIsReseller(isUserReseller);

                if (!isUserReseller) {
                    console.log('[Auth] User is not a reseller, but keeping auth tokens for registration');
                    // Store the user data even if they aren't a reseller
                    // This allows the register page to access the data
                    storage.setUser(baseUserData);
                    return false;
                }

                // If they are a reseller, fetch additional data
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

    // Initial auth check when component mounts
    useEffect(() => {
        const storedUser = storage.getUser();
        console.log('[Auth] Initial auth check:', { hasStoredUser: !!storedUser, pathname });

        if (storedUser) {
            // Set user from stored data
            setUser(storedUser as EnhancedAuthUser);

            // Check reseller status
            checkResellerStatus().then(isUserReseller => {
                setIsReseller(isUserReseller);

                // If user is not a reseller and trying to access protected pages, redirect to login
                if (!isUserReseller &&
                    pathname !== '/auth/login' &&
                    pathname !== '/auth/register' &&
                    pathname !== '/auth/signup-reseller' && // Add the new path
                    pathname !== '/invite' &&
                    !isShortInvitePath(pathname)) {
                    console.log('[Auth] User is not a reseller, redirecting to login');

                    // Preserve parameters if from a short URL
                    if (!redirectToLoginWithParams()) {
                        router.push('/auth/login');
                    }
                }
            });
        } else if (
            pathname !== '/auth/login' &&
            pathname !== '/auth/register' &&
            pathname !== '/auth/signup-reseller' && // Add the new path
            pathname !== '/invite' &&
            !isShortInvitePath(pathname)
        ) {
            console.log('[Auth] No stored user, redirecting to login');

            // Preserve parameters if from a short URL
            if (!redirectToLoginWithParams()) {
                router.push('/auth/login');
            }
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