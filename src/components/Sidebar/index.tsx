"use client";

import React from "react";
import { usePathname } from "next/navigation";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { checkTierPermission, TIER_PERMISSIONS } from "@/utils/permissions";

import {
  AccountIcon,
  DashboardIcon,
  IncentiveManagementIcon,
  PerformanceIcon,
  ReferredUsersIcon,
  SettingsIcon,
  SupportIcon,
} from "@/components/Icons/menu";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  // Check if the user has the required permission for "Recruit Agent"
  const canAccessRecruitment = checkTierPermission(
    user?.tierPriority || 0,
    TIER_PERMISSIONS.MIN_TIER_FOR_RECRUITMENT
  );

  const menuGroups = [
    {
      name: "MENU",
      menuItems: [
        {
          icon: <DashboardIcon />,
          label: "Dashboard",
          route: "/",
        },
        {
          icon: <AccountIcon />,
          label: "Account",
          route: "#",
          children: [
            { label: "Wallets", route: "/account/wallets" },
            { label: "Transfer", route: "/account/transfer" },
          ],
        },
        {
          icon: <IncentiveManagementIcon />,
          label: "Incentive Management",
          route: "/incentive-management",
        },
        {
          icon: <ReferredUsersIcon />,
          label: "Referred Users",
          route: "#",
          children: [
            { label: "Referred-Users", route: "/referred-users" },
            { label: "Manage User", route: "/referred-users/manage-user" },
            // Conditionally render Recruit Agent based on permission
            // ...(canAccessRecruitment
            //   ? [{ label: "Recruit Agent", route: "/referred-users/recruit-agent" }]
            //   : []),
          ],
        },
        // TODO: add performance and support (implement its functionality)
        // {
        //   icon: <PerformanceIcon />,
        //   label: "Performance",
        //   route: "/performance",
        // },
        // {
        //   icon: <SupportIcon />,
        //   label: "Support",
        //   route: "/support",
        // },
        {
          icon: <SettingsIcon />,
          label: "Settings",
          route: "#",
          children: [
            { label: "Profile", route: "/settings/profile" },
            // { label: "Password", route: "/settings/password" },
            { label: "Preference", route: "/settings/preference" },
          ],
        },
        {
          icon: <SupportIcon />,
          label: "Legal & Compliance",
          route: "#",
          children: [
            // { label: "Profile Policy", route: "/legal-and-compliance/profile-policy" },
            // { label: "User Agreement", route: "/legal-and-compliance/user-agreement" },
            // { label: "Code of Conduct", route: "/legal-and-compliance/code-of-conduct" },
            // { label: "Compliance and Anti-Corruption", route: "/legal-and-compliance/compliance-and-anti-corruption" },
            // { label: "Privacy Guideline", route: "/legal-and-compliance/program-guideline" },
            { label: "Terms and Conditions", route: "/legal-and-compliance/terms-and-conditions" },
            { label: "Circle of Growth Campaign", route: "/legal-and-compliance/circle-of-growth-campaign" },
          ],
        },
      ],
    },
  ];

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 lg:top-[88px] z-50 w-72.5 
        h-full lg:h-[calc(100vh-88px)]
        bg-whiten dark:bg-boxdark
        border-r border-stroke dark:border-strokedark
        transition-all duration-200 ease-out will-change-transform
        lg:translate-x-0 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <nav
          className="p-4 pt-[88px] lg:pt-4 lg:p-6"
          style={{
            transform: "translate3d(0, 0, 0)",
            backfaceVisibility: "hidden",
            perspective: 1000,
          }}
        >
          {menuGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="will-change-transform mt-4">
              <p className="font-bold text-bodydark px-3">{t(`sidebar.${group.name.toLowerCase()}`)}</p>
              <ul className="flex flex-col gap-2">
                {menuGroups[0].menuItems.map((menuItem, menuIndex) => {
                  return (
                    <SidebarItem
                      key={menuIndex}
                      item={{
                        ...menuItem,
                        label: t(`sidebar.${menuItem.label.toLowerCase()}`),
                        children: menuItem.children?.map((child) => ({
                          ...child,
                          label: t(`sidebar.${child.label.toLowerCase()}`),
                        })),
                      }}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
