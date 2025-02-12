// app/layout.tsx
"use client";
import "@/css/archivo.css";
import "@/css/style.css";
import "@/i18n/i18n";
import React, { ReactNode } from "react";
import Loader from "@/components/common/Loader";
import useColorMode from "@/hooks/useColorMode";
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";

// Create a wrapper component to handle auth-dependent loading
const AuthenticatedLayout = ({ children }: { children: ReactNode }) => {
  const { isLoading, isInitialized } = useAuth();

  if (!isInitialized || isLoading) {
    return <Loader />;
  }

  return children;
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  const [colorMode] = useColorMode() as [string, (value: string) => void];

  return (
    <html lang="en" className={colorMode} suppressHydrationWarning>
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <AuthProvider>
            <AuthenticatedLayout>
              {children}
            </AuthenticatedLayout>
          </AuthProvider>
          <Toaster />
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
