"use client";

import { FaFacebook, FaInstagram, FaTwitter, FaThreads, FaCircleQuestion } from "react-icons/fa6";

export const platformConfig: Record<string, { icon: React.ElementType; color: string }> = {
    facebook: { icon: FaFacebook, color: "text-blue-600" },
    instagram: { icon: FaInstagram, color: "text-pink-500" },
    twitter: { icon: FaTwitter, color: "text-blue-400" },
    threads: { icon: FaThreads, color: "text-black" },
};

export const PLATFORM_OPTIONS = Object.keys(platformConfig) as (keyof typeof platformConfig)[];

export const getPlatformIcon = (platform: string, additionalClasses = "") => {
    const formattedPlatform = platform.trim().toLowerCase();
    const config = platformConfig[formattedPlatform] || { icon: FaCircleQuestion, color: "text-gray-500" };

    return <config.icon className={`${config.color} ${additionalClasses} hover:opacity-80 transition`} size={20} />;
};