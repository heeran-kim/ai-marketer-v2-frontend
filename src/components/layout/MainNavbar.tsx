// src/components/layout/Navbar.tsx
"use client";

import Logo from "@/components/navigation/Logo";
import NavLinks from "@/components/navigation/NavLinks";
import AuthButtons from "@/components/navigation/AuthButtons";
import { useAuth } from "@/components/auth/AuthProvider";

export default function Navbar() {
    const { user } = useAuth();

    return (
        <div className={`left-0 w-full`}>
            <div className="flex justify-between max-w-7xl mx-auto px-6 py-2 flex items-center h-14">
                <div className="flex items-center gap-2">
                    <Logo />
                    {!user && <NavLinks />}
                </div>
                <AuthButtons />
            </div>
        </div>
    );
}