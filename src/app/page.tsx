"use client";

import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import CTA from "@/components/sections/CTA";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

export default function Home() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }
    }, [user, router]);

    if (user) {
    return <p>Loading...</p>;
    }

    return (
        <div className="bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark transition-colors duration-300">
            <Hero />
            <Features />
            <HowItWorks />
            <CTA />
        </div>
    );
}