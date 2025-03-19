// src/components/layout/MainNavbar.tsx
"use client";

import Logo from "@/components/navigation/Logo";
import NavLinks from "@/components/navigation/NavLinks";
import AuthButtons from "@/components/navigation/AuthButtons";
import { useAuth } from "@/components/auth/AuthProvider";

/**
 * Main navigation bar component
 * 
 * Displays the app logo, navigation links for unauthenticated users,
 * and authentication buttons (login/logout) based on auth state.
 */
export default function MainNavbar() {
    const { authState } = useAuth();
    
    return (
        <div className="left-0 w-full">
            <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-2 h-14">
                <div className="flex items-center gap-2">
                    <Logo />
                    {/* Show nav links only for unauthenticated users */}
                    {(authState.status === "unauthenticated") && <NavLinks />}
                </div>
                <AuthButtons />
            </div>
        </div>
    );
}