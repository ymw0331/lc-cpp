'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/lib/services/auth.service';
import { AuthUserData } from '@/types/auth';
import { IUser } from '@/types/user';
import { useToast } from "@/hooks/useToast";
import Loader from '@/components/common/Loader';

interface AuthContextType {
    user: IUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile?: (userData: Partial<IUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();

    // Initialize auth state
    useEffect(() => {
        const initializeAuth = async () => {
            console.log('🚀 Initializing auth state...');
            try {
                const storedUser = localStorage.getItem('user');
                const token = localStorage.getItem('token');

                if (storedUser && token) {
                    console.log('📝 Found stored credentials');
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    console.log('👤 User restored:', parsedUser.email);
                } else {
                    console.log('⚠️ No stored credentials found');
                    if (pathname !== '/auth/login') {
                        console.log('🔄 Redirecting to login...');
                        router.push('/auth/login');
                    }
                }
            } catch (error) {
                console.error('❌ Error initializing auth:', error);
                localStorage.clear();
                router.push('/auth/login');
            } finally {
                setIsInitialized(true);
                console.log('✅ Auth initialization complete');
            }
        };

        initializeAuth();
    }, [pathname, router]);

    const login = async (email: string, password: string) => {
        console.log('🔑 Attempting login for:', email);
        setIsLoading(true);

        try {
            const response = await authService.login({
                email,
                password,
                fcmId: '', // Add fcmId if needed
            });

            console.log('📨 Login response received:', {
                status: response.status,
                message: response.message
            });

            if (response.status) {
                const userData = response.data;
                const mappedUser = authService.mapToUser(response);

                // Store auth data
                localStorage.setItem('token', userData.token);
                localStorage.setItem('refreshToken', userData.refreshToken);
                localStorage.setItem('user', JSON.stringify(mappedUser));

                console.log('🔐 Auth data stored successfully');
                setUser(mappedUser);

                toast({
                    title: "Success",
                    description: "Successfully logged in",
                });

                console.log('➡️ Redirecting to dashboard...');
                router.push('/');
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error('❌ Login error:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Login failed",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        console.log('🔒 Initiating logout...');
        setIsLoading(true);

        try {
            // Add your logout API call here if needed
            // await authService.logout();
            console.log('🧹 Clearing local storage...');
            localStorage.clear();
            setUser(null);

            toast({
                title: "Success",
                description: "Successfully logged out",
            });

            console.log('➡️ Redirecting to login...');
            router.push('/auth/login');
        } catch (error) {
            console.error('❌ Logout error:', error);
            toast({
                title: "Error",
                description: "Error during logout",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Redirect if authenticated user tries to access login page
    useEffect(() => {
        if (user && pathname === '/auth/login') {
            console.log('🔄 Authenticated user redirected from login page');
            router.push('/');
        }
    }, [user, pathname, router]);

    // Debug current auth state
    useEffect(() => {
        console.log('🔄 Auth state updated:', {
            isAuthenticated: !!user,
            isLoading,
            isInitialized,
            currentPath: pathname,
            userEmail: user?.email
        });
    }, [user, isLoading, isInitialized, pathname]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                isInitialized,
                login,
                logout,
            }}
        >
            {!isInitialized ? <Loader /> : children}
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
