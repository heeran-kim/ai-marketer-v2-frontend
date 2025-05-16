// src/components/layout/SubNavbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { NAV_ITEMS } from "@/constants/navItems";
import { NavItem, FeatureItem, SubPage } from "@/types/nav";

const isNavItem = (item: NavItem | FeatureItem): item is NavItem => {
  return "subPages" in item;
};

export default function SubNavbar() {
  const pathname = usePathname();
  const { authState } = useAuth();

  /**
   * Determines if a navigation item should be highlighted as active
   *
   * Checks if the current path matches the item's path or any of its subpages
   *
   * @param item - The navigation or feature item to check
   * @returns True if the item or any of its subpages is active
   */
  const isActive = (item: NavItem | FeatureItem) => {
    if (pathname.startsWith(item.href)) return true;
    if (isNavItem(item) && item.subPages) {
      return item.subPages.some((sub: SubPage) =>
        pathname.startsWith(sub.href)
      );
    }
    return false;
  };

  // Determine which menu items to show based on path and auth state
  const menuItems =
    authState.status === "authenticated"
      ? NAV_ITEMS // Only show protected navigation when authenticated
      : []; // Show no navigation for unauthenticated users in protected sections

  // Skip rendering if there are no menu items to display
  if (menuItems.length === 0) return null;

  return (
    <div className="w-full bg-white border-b border-gray-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex items-center h-12 space-x-8">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`text-sm font-medium ${
              isActive(item)
                ? "text-black border-b-2 border-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
