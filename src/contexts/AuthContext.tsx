'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { IUser, userData } from '@/lib/data';


interface AuthContextType {
    user: IUser | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock authentication - replace with your API
const mockAuth = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === 'agent@example.com' && password === 'password') {
        return {
            user: userData,
            token: userData.token,
        };
    }
    throw new Error('Invalid credentials');
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<IUser | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        } else if (pathname !== '/auth/login') {
            router.push('/auth/login');
        }
    }, [pathname, router]);

    const login = async (email: string, password: string) => {
        try {
            const { user, token } = await mockAuth(email, password);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            router.push('/');
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/auth/login');
    };

    // If we're on the login page and user is authenticated, redirect to home
    useEffect(() => {
        if (user && pathname === '/auth/login') {
            router.push('/');
        }
    }, [user, pathname, router]);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
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