"use client";

import { useState } from "react";
import Link from "next/link";
import { FaUser } from "react-icons/fa";

export default function ProfileDropdown() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <div className="relative">
            <button
                className="w-[40px] h-[40px] rounded-full
                            bg-gradient-to-r from-purple-500 to-red-500
                            flex items-center justify-center text-white"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
                <FaUser size={18} />
            </button>

            {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 transition-all duration-200">
                    <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-semibold">heeran-kim</p>
                        <p className="text-sm text-gray-500">heerankim3@gmail.com</p>
                    </div>

                    <div className="py-3 space-y-2">
                        <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                            Dashboard
                        </Link>
                        <Link href="/account" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                            Account Settings
                        </Link>
                    </div>

                    <button className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
                        <Link href="/logout" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                            Log Out
                        </Link>
                    </button>
                </div>
            )}
        </div>
    )
}