"use client";

import React from "react";
import { usePathname } from "next/navigation";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useTranslation } from "react-i18next";

import {
  AccountIcon, DashboardIcon, IncentiveManagementIcon, PerformanceIcon, ReferredUsersIcon, SettingsIcon, SupportIcon
} from "@/components/Icons/menu"


interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

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
          { label: "Referred Users", route: "/referred-users" },
          { label: "Manage User", route: "/referred-users/manage-user" },
          { label: "Recruit Agent", route: "/referred-users/recruit-agent" },
        ],
      },
      {
        icon: <PerformanceIcon />,
        label: "Performance",
        route: "/performance",
      },
      {
        icon: <SupportIcon />,
        label: "Support",
        route: "/support",
      },
      {
        icon: <SettingsIcon />,
        label: "Settings",
        route: "#",
        children: [
          { label: "Profile", route: "/settings/profile" },
          { label: "Password", route: "/settings/password" },
          { label: "Preference", route: "/settings/preference" },
        ],
      },
      {
        icon: <SupportIcon />,
        label: "Legal & Compliance",
        route: "#",
        children: [
          { label: "Profile Policy", route: "/legal-and-compliance/profile-policy" },
          { label: "Terms and Conditions", route: "/legal-and-compliance/terms-and-conditions" },
          { label: "User Agreement", route: "/legal-and-compliance/user-agreement" },
          { label: "Code of Conduct", route: "/legal-and-compliance/code-of-conduct" },
          { label: "Compliance and Anti-Corruption", route: "/legal-and-compliance/compliance-and-anti-corruption" },
          { label: "Privacy Guideline", route: "/legal-and-compliance/program-guideline" },
        ],
      },
    ],
  },
];


const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-[88px] z-999 flex h-[calc(100vh-72px)] w-72.5 flex-col overflow-y-hidden duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* <!-- Sidebar Menu --> */}
        <div className="bg-whiten dark:bg-boxdark no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">

          <nav className="mt-4 px-4 py-4 lg:mt-2 lg:px-6">

            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                {/* <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                  {group.name}
                </h3> */}
                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={{
                        ...menuItem,
                        label: t(`sidebar.${menuItem.label.toLowerCase()}`),
                        children: menuItem.children?.map(child => ({
                          ...child,
                          label: t(`sidebar.${child.label.toLowerCase()}`)
                        }))
                      }}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>

        </div>
        {/* <!-- Sidebar Menu --> */}

      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
