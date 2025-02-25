"use client";
import "@/css/archivo.css";
import "@/css/style.css";
import "@/i18n/i18n";
import React, { ReactNode, useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import useColorMode from "@/hooks/useColorMode";
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster";
import i18n from "@/i18n/i18n";
import { storage } from "@/lib/storage";

// Auth wrapper component to handle auth-specific loading
const AuthWrapper = ({ children }: { children: ReactNode }) => {
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    // Check if we have a stored token/user
    const checkAuthAndLanguage = async () => {
      try {
        const token = localStorage.getItem('auth_token');

        // Check and set language preference
        const preferredLanguage = storage.getLanguagePreference();

        // Change language if needed
        await i18n.changeLanguage(preferredLanguage);

        // Add a small delay to prevent flash of loading state
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsAuthChecking(false);


      } catch (error) {
        console.error('Auth and languagecheck failed:', error);
        setIsAuthChecking(false);
      }
    };

    checkAuthAndLanguage();
  }, []);

  if (isAuthChecking) {
    return <Loader />;
  }

  return children;
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [colorMode] = useColorMode() as [string, (value: string) => void];

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  return (
    <html lang="en" className={colorMode} suppressHydrationWarning>
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <AuthProvider>
            <AuthWrapper>
              {loading ? <Loader /> : children}
            </AuthWrapper>
          </AuthProvider>
          <Toaster />
        </div>
      </body>
    </html>
  );
};

export default RootLayout;