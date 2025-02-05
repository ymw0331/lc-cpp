import React from "react";
import Link from "next/link";
import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";
import { usePathname } from "next/navigation";

const SidebarItem = ({ item, pageName, setPageName }: any) => {
  const handleClick = () => {
    if (item.children) {
      const updatedPageName =
        pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
      return setPageName(updatedPageName);
    }
  };

  const pathname = usePathname();

  const isActive = (item: any) => {
    if (item.route === pathname) return true;
    if (item.children) {
      return item.children.some((child: any) => isActive(child));
    }
    return false;
  };

  const isItemActive = isActive(item);

  return (
    <li>
      <Link
        href={item.children ? "#" : item.route}
        onClick={handleClick}
        className={`group relative flex items-center gap-2.5 rounded-lg px-4 py-2.5 font-medium duration-300 ease-in-out
          ${item.children && pageName === item.label.toLowerCase()
            ? "bg-bodydark/10 dark:bg-meta-4"
            : ""
          }
          ${isItemActive 
            ? "bg-primary dark:bg-primary text-white"
            : "hover:bg-bodydark/10 dark:hover:bg-meta-4"
          }
          ${!isItemActive ? "text-black dark:text-white" : ""}
        `}
      >
        <span className={`${isItemActive ? "text-white" : ""}`}>
          {item.icon}
        </span>
        
        <span className={`text-lg ${isItemActive ? "text-white" : ""}`}>
          {item.label}
        </span>

        {item.children && (
          <svg
            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current transition-transform duration-200 
            ${pageName === item.label.toLowerCase() ? "rotate-180" : ""}`}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
              fill="currentColor"
            />
          </svg>
        )}
      </Link>

      {item.children && (
        <div
          className={`transform overflow-hidden transition-all duration-300 ease-in-out
          ${pageName === item.label.toLowerCase() ? "h-auto opacity-100 mt-2" : "h-0 opacity-0"}`}
        >
          <SidebarDropdown item={item.children} />
        </div>
      )}
    </li>
  );
};

export default SidebarItem;