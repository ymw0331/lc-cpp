"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import ClickOutside from "@/components/ClickOutside";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const DropdownUser = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const menuItems = [
    {
      href: "/settings/profile",
      label: t("dropdownUser.myProfile"),
      icon: User,
    },
    {
      href: "/settings/preference",
      label: t("dropdownUser.preference"),
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
      >
        <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-700">
          <AvatarImage
            src={user?.avatarUrl || undefined}
            alt={`${user?.profileName || user?.fullName}'s avatar`}
          />
          <AvatarFallback className="bg-primary/10">
            {user?.profileName
              ? getInitials(user.profileName)
              : getInitials(user?.fullName || "User")}
          </AvatarFallback>
        </Avatar>

        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">
            {user?.profileName || user?.fullName}
          </span>
          {/* <span className="block text-xs text-gray-500 dark:text-gray-400 capitalize">
            {user?.tierPriority ? `Level ${user.tierPriority} Member` : user?.role}
          </span> */}
        </span>

        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-60 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {user?.profileName || user?.fullName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.email}
            </p>
          </div>

          <div className="p-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 p-2">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {t("dropdownUser.logOut")}
            </button>
          </div>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;
