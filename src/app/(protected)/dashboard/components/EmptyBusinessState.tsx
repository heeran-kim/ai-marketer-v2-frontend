// app/(protected)/dashboard/components/EmptyBusinessState.tsx
"use client";

import { useRouter } from "next/navigation";
import { primaryNavItemClass } from "@/components/styles";

export default function EmptyBusinessState() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-64 border border-gray-300 bg-white rounded-lg p-3">
      <p className="text-md text-gray-700 mb-8 text-center">
        You haven&apos;t set up your business yet! <br />
        Get started by adding your restaurant details now.
      </p>
      <button
        className={primaryNavItemClass}
        onClick={() => router.push("/settings/general")}
      >
        Add Your Business
      </button>
    </div>
  );
}
