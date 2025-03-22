// src/components/navigation/AuthButtons.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { flexRowClass, authNavItemClass, primaryNavItemClass } from "@/components/styles";

/**
 * Authentication buttons component
 * 
 * Displays different buttons based on the current authentication state:
 * - During initialization: Shows an invisible placeholder to prevent layout shifts
 * - When authenticated: Shows Dashboard link and Logout button
 * - When unauthenticated: Shows Login link and Register button
 */
export default function AuthButtons() {
    const { authState, logout } = useAuth();
    
    // During initialization, show a placeholder with the same dimensions
    // to prevent layout shifting when auth state is determined
    if (authState.status === "initializing") {
        return <div className={`${flexRowClass} opacity-0`}>Placeholder</div>;
    }

    // For authenticated users, show Dashboard link and Logout button
    if (authState.status === "authenticated") {
        return (
            <div className={flexRowClass}>
                <Link href="/dashboard" className={authNavItemClass}>Dashboard</Link>
                <button onClick={logout} className={primaryNavItemClass}>Logout</button>
            </div>
        );
    }
    
    // For unauthenticated users, show Get Started button
    return (
        <div className={flexRowClass}>
            <Link href="/login" className={primaryNavItemClass}>Get Started</Link>
        </div>
    );
}