// src/app/features/page.tsx
"use client";

import { features } from "@/constants/features";
import Link from "next/link";

export default function FeaturesPage() {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-semibold">Our Features</h1>
            <p className="text-gray-600">Explore the features that can boost your marketing.</p>

            <ul className="mt-6 space-y-4">
                {features.map((feature) => (
                    <li key={feature.href}>
                        <Link href={feature.href} className="text-blue-600 hover:underline">
                            {feature.longTitle}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}