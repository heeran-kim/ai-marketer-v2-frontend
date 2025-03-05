// src/app/features/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import { features } from "@/constants/features";
import Header from "@/components/common/Header";

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const feature = features.find(item => pathname.startsWith(item.href));

    return (
        <div className="max-w-4xl mx-auto p-6">
            {feature && <Header title={feature.longTitle} description={feature.longDescription} />}
            {children}
        </div>
    );
}