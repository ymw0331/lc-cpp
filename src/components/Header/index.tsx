import Link from "next/link";
import Image from "next/image";
import DropdownNotification from "@/components/Header/DropdownNotification";
import DropdownUser from "@/components/Header/DropdownUser";
import SearchBar from "@/components/Header/SearchBar";
import LevelBadge from "@/components/Header/LevelBadge";
import LanguageSwitcher from "@/components/Header/LanguageSwitcher";
import DarkModeSwitcher from "@/components/Header/DarkModeSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";


const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const { t } = useTranslation()
  const { user } = useAuth();

  const toggleSidebar = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.setSidebarOpen(false);
    if (!props.sidebarOpen) {
      props.setSidebarOpen(true);
    }
  };

  return (
    <>
      <header className="fixed top-0 z-999 flex w-full px-2 sm:px-4 py-2 sm:py-4 bg-whiten dark:bg-boxdark dark:drop-shadow-none">
        <div className="flex w-full items-center justify-between rounded-xl px-2 sm:px-4 py-2 shadow-2 md:px-6 2xl:px-11 bg-white dark:bg-boxdark-2">
          {/* Left side with Logo and Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/" className="flex-shrink-0 hidden lg:block">
              <Image
                width={176}
                height={32}
                src={"/images/logo/lookcard-logo.png"}
                alt="Logo"
                priority
              />
            </Link>

            <button
              aria-controls="sidebar"
              onClick={toggleSidebar}
              className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              {props.sidebarOpen ? (
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>

            <Link className="block flex-shrink-0 lg:hidden" href="/">
              <Image
                width={32}
                height={32}
                src={"/images/logo/lookcard-icon.png"}
                alt="Logo"
              />
            </Link>
          </div>

          {/* Search Bar Component - Hidden on smallest screens */}
          {/* <div className="hidden sm:block flex-1 mx-2 sm:mx-4 max-w-[680px]">
            <SearchBar />
          </div> */}

          <div className="flex items-center gap-2 sm:gap-3 2xsm:gap-7">
            <ul className="flex items-center gap-2 sm:gap-2 2xsm:gap-4">
              {/* Hide on mobile, show on sm breakpoint and above */}
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>
              <div className="hidden sm:block">
                <DarkModeSwitcher />
              </div>
              {/* <DropdownNotification /> */}
              <LevelBadge />
              <DropdownUser />
            </ul>
          </div>
        </div>
      </header>
      {/* Spacer div to prevent content overlap */}
      <div className="h-[88px]" />
    </>
  );
};

export default Header;