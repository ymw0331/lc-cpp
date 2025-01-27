"use client";
import "@/css/archivo.css";
import "@/css/style.css";
import "@/i18n/i18n";
import React, { ReactNode, useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import useColorMode from "@/hooks/useColorMode";
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster";

const RootLayout = ({ children }: { children: ReactNode }) => {

  const [sidebarOpen, setSidebarOpen] = useState(false);
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
            {loading ? <Loader /> : children}
          </AuthProvider>
          <Toaster />
        </div>
      </body>
    </html>
  )
}

export default RootLayout
