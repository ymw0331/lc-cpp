"use client";
import React, { useState, ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  // Don't render the layout on the login page
  if (pathname === '/auth/login') {
    return <>{children}</>;
  }

  return isAuthenticated ? (
    <>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex min-h-screen flex-col">
        {/* <!-- ===== Header Start ===== --> */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Header End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="flex flex-1">
          {/* <!-- ===== Sidebar Start ===== --> */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Sidebar End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <div className="relative flex flex-1 flex-col lg:ml-72.5">
            <main>
              <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                {children}
              </div>
            </main>
          </div>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  ) : null;
}
