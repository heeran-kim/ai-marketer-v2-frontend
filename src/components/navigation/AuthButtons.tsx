"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { flexRowClass, authNavItemClass, primaryNavItemClass } from "@/components/styles";

export default function AuthButtons() {
    const { user, logout } = useAuth();

    return user ? (
        <div className={flexRowClass}>
            <Link href="/dashboard" className={authNavItemClass}>Dashboard</Link>
            <button onClick={logout} className={primaryNavItemClass}>Logout</button>
        </div>
    ) : (
        <div className={flexRowClass}>
            <Link href="/login" className={authNavItemClass}>Login</Link>
            <Link href="/register" className={primaryNavItemClass}>Get Started</Link>
        </div>
    );
}