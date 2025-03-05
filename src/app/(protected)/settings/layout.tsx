// src/app/settings/layout.tsx
"use client";

import SettingsSidebar from "./components/SettingsSidebar"

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-gray-50 p-6 dark:bg-black">
            <div className="max-w-7xl mx-auto flex">
                <SettingsSidebar />
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}