// src/components/layout/NavbarWrapper.tsx
"use client";

import { useState, useRef, useEffect} from "react";
import MainNavbar from "@/components/layout/MainNavbar";
import SubNavbar from "@/components/layout/SubNavbar";

export default function NavbarWrapper({ children }: { children: React.ReactNode }) {
    const navbarRef = useRef<HTMLDivElement>(null);
    const subNavbarRef = useRef<HTMLDivElement>(null);

    const [showMainNav, setShowMainNav] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY === 0) {
                setShowMainNav(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setShowMainNav(false);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <>
            <div ref={navbarRef} className={`w-full z-50 transition-transform duration-300 ${showMainNav ? "translate-y-0" : "-translate-y-full"}`} >
                <MainNavbar />
            </div>
            <div ref={subNavbarRef} className={`${showMainNav ? "relative top-0" : "fixed top-0 z-50"} w-full z-40`}>
                <SubNavbar />
            </div>
            <div className="relative">
                {children}
            </div>
        </>
    );
}
