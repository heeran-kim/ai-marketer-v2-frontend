"use client";

import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import CTA from "@/components/sections/CTA";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

/**
 * Home page component
 *
 * This component serves as the landing page for unauthenticated users.
 * It automatically redirects authenticated users to their dashboard,
 * providing a personalized experience based on authentication state.
 */
export default function Home() {
  const { authState } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (authState.status === "authenticated") router.push("/dashboard");
  }, [authState, router]);

  // Display landing page content for unauthenticated and initializing users
  if (authState.status === "unauthenticated") {
    return (
      <div className="bg-background text-foreground">
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
      </div>
    );
  }

  // Return empty content while redirecting authenticated users
  return null;
}
