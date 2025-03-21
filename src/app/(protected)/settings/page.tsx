// src/app/(protected)/settings/page.tsx
"use client";

import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/navigation";
import SettingsSidebar from "./components/SettingsSidebar";

export default function SettingsPage() {
    const isDesktop = useMediaQuery({ minWidth: 768 });
    const router = useRouter();

    useEffect(() => {
        if (isDesktop) router.replace("/settings/general");
    }, [router, isDesktop]);

    if (isDesktop) return null;

    return (
        <SettingsSidebar />
    );
}