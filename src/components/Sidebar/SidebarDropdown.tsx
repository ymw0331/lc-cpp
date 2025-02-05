import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarDropdown = ({ item }: any) => {
  const pathname = usePathname();

  return (
    <ul className="mt-2 flex flex-col gap-2">
      {item.map((menuItem: any, index: number) => (
        <li key={index}>
          <Link
            href={menuItem.route}
            className={`flex items-center gap-2.5 rounded-lg px-4 py-2.5 font-medium duration-300 ease-in-out
              ${pathname === menuItem.route
                ? "bg-primary text-white dark:bg-primary"
                : "text-black dark:text-white hover:bg-bodydark/10 dark:hover:bg-meta-4"
              }
            `}
          >
            {menuItem.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SidebarDropdown;