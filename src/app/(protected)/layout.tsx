// src/app/(protected)/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { NAV_ITEMS } from "@/constants/navItems";

/**
 * Layout component for protected routes
 * 
 * This component:
 * 1. Checks authentication state
 * 2. Redirects unauthenticated users to login
 * 3. Shows appropriate navigation based on current path
 */
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { authState } = useAuth();

    // Redirect to login page if user is not authenticated
    useEffect(() => {
        if (authState.status === "unauthenticated") router.push("/login");
    }, [authState, router]);

    // During authentication check, preserve current UI to prevent flickering
    if (authState.status === "initializing") return children;

    // If not authenticated, show nothing while redirecting
    if (authState.status === "unauthenticated") return null;
    
    // Find the current navigation item based on the URL path
    const currentNav = NAV_ITEMS.find((item) => pathname.startsWith(item.href));

    if (!currentNav) {
        console.error("Cannot find matched navigation item for path:", pathname);
    }
    else if (currentNav.subPages?.length) {
        // Check if current path matches a subpage and update header accordingly
        const subPage = currentNav.subPages.find((sub) => pathname === sub.href);
        if (subPage?.header) currentNav.header = subPage.header;
    }

    // Render the protected content with appropriate header
    return (
        <div className="max-w-6xl mx-auto md:p-6">
            {currentNav?.header && <Header {...currentNav.header} />}
            {children}
        </div>
    );
}