"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const uid = searchParams.get("uid");
    const token = searchParams.get("token");

    if (uid && token) {
      router.push(`/password/reset?uid=${uid}&token=${token}`);
    } else {
      router.push("/password/forgot");
    }
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <p className="text-gray-600">Redirecting...</p>
    </div>
  );
}
