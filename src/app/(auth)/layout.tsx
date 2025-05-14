// src/app/(auth)/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { authState } = useAuth();

  useEffect(() => {
    if (authState.status === "authenticated") router.push("/dashboard");
  }, [authState, router]);

  return <div>{children}</div>;
}
