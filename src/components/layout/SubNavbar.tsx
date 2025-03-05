// src/components/layout/SubNavbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { NAV_ITEMS } from "@/constants/navItems";
import { features } from "@/constants/features";

interface NavItem {
    name: string;
    href: string;
    subPages?: NavItem[];
}

export default function SubNavbar() {
    const pathname = usePathname();
    const { user } = useAuth();

    const isActive = (item: NavItem) => {
        if (pathname.startsWith(item.href)) return true;
        if (item.subPages) {
            return item.subPages.some((sub: NavItem) => pathname.startsWith(sub.href));
        }
        return false;
    };

    const menuItems = pathname.startsWith("/features")
        ? features
        : user
        ? NAV_ITEMS
        : [];

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