// src/app/(protected)/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

const BUSINESS_REQUIRED_ROUTES =
  /^\/(posts|promotions|settings(\/(?!general|account).+))/;

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { authState } = useAuth();

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (authState.status === "initializing") return;

    if (authState.status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (
      BUSINESS_REQUIRED_ROUTES.test(pathname) &&
      !authState.user?.businessId
    ) {
      router.replace("/settings/general");
      return;
    }

    setIsChecking(false);
  }, [authState, pathname, router]);

  if (
    isChecking ||
    authState.status === "initializing" ||
    authState.status === "unauthenticated" ||
    (BUSINESS_REQUIRED_ROUTES.test(pathname) && !authState.user?.businessId)
  ) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
