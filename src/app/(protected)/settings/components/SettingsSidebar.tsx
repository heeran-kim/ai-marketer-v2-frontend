// src/app/(protected)/settings/components/SettingsSidebar.tsx
"use client";

import clsx from "clsx";
import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import SearchBar from "@/components/common/SearchBar";
import Link from "next/link";
import { NAV_ITEMS } from "@/constants/navItems";

export default function SettingsSidebar() {
    const [searchTerm, setSearchTerm] = useState("");
    const pathname = usePathname();
    
    const menuItems = useMemo(() => {
        return NAV_ITEMS.find((item) => item.name === "Settings")?.subPages || [];
    }, []);

    const filteredItems = useMemo(() => {
        return menuItems.filter((item) => {
            if (!item.name) {
                console.error('Navigation item is missing required name property:', item);
                return false; // Filter out items without names
            }
            return item.name.toLowerCase().includes(searchTerm.toLowerCase())
        });
    }, [searchTerm, menuItems]);

    return (
        <div className="px-4 text-sm">
            {/* Search Bar */}
            <SearchBar setSearchTerm={setSearchTerm} placeholder="Search settings..." />

            {/* Menu List */}
            <ul className="mt-4 space-y-2">
                {filteredItems.map((item) => (
                    <li key={item.href}>
                        <Link
                            href={item.href}
                            className={clsx(
                                "block px-3 py-2 rounded-lg hover:bg-gray-200",
                                pathname === item.href
                                    ? "text-black font-bold"
                                    : "text-gray-700"
                            )}
                        >
                            {item.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}