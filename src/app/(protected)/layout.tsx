// src/app/(protected)/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { NAV_ITEMS } from "@/constants/navItems";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) router.push("/login");
    }, [user, router]);
    
    const currentNav = NAV_ITEMS.find((item) => pathname.startsWith(item.href));

    if (!currentNav) {
        console.error("Cannot find matched navigation item");
    }
    else if (currentNav.subPages?.length) {
        const subPage = currentNav.subPages.find((sub) => pathname === sub.href);
        if (subPage) currentNav.header = subPage.header;
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            {currentNav?.header && <Header {...currentNav.header} />}
            {children}
        </div>
    );
}