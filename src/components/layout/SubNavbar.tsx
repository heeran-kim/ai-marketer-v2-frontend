// src/components/layout/SubNavbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { NAV_ITEMS } from "@/constants/navItems";
import { features } from "@/constants/features";
import { NavItem, FeatureItem, SubPage } from "@/app/types/nav";


/**
* Type guard to check if an item is a NavItem (with subPages)
* 
* @param item - The item to check
* @returns True if the item is a NavItem with subPages
*/
const isNavItem = (item: NavItem | FeatureItem): item is NavItem => {
    return 'subPages' in item;
};

/**
 * Secondary navigation bar component
 * 
 * This component displays context-sensitive navigation links based on:
 * 1. The current path (features section vs protected routes)
 * 2. Authentication state (showing protected navigation only to authenticated users)
 * 
 * The navbar adapts its content to show only relevant, accessible links to users
 * based on their current authentication state.
 */
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
            return item.subPages.some((sub: SubPage) => pathname.startsWith(sub.href));
        }
        return false;
    };

    // Determine which menu items to show based on path and auth state
    const menuItems = pathname.startsWith("/features")
        ? features                                  // Always show features menu in public section
        : authState.status === "authenticated"
        ? NAV_ITEMS                                 // Only show protected navigation when authenticated
        : [];                                       // Show no navigation for unauthenticated users in protected sections

    // Skip rendering if there are no menu items to display
    if (menuItems.length === 0) return null;

    return (
        <div className="w-full bg-white dark:bg-neutral-900 border-b border-gray-300 dark:border-gray-700 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 flex items-center h-12 space-x-8">
                {menuItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`text-sm font-medium ${
                            isActive(item)
                                ? "text-black dark:text-white border-b-2 border-black dark:border-white"
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