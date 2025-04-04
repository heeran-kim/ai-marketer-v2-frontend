// src/utils/icon.tsx
"use client";

import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaThreads,
  FaCircleQuestion,
} from "react-icons/fa6";

export const platformConfig: Record<
  string,
  { label: string; icon: React.ElementType; color: string }
> = {
  instagram: { label: "Instagram", icon: FaInstagram, color: "text-pink-500" },
  facebook: { label: "Facebook", icon: FaFacebook, color: "text-blue-600" },
  twitter: { label: "Twitter / X", icon: FaTwitter, color: "text-blue-400" },
  threads: { label: "Threads", icon: FaThreads, color: "text-black" },
};

export type PlatformKey = (typeof PLATFORM_OPTIONS)[number];

export const PLATFORM_OPTIONS = Object.keys(
  platformConfig
) as (keyof typeof platformConfig)[];

export const PLATFORM_OPTIONS_WITH_LABEL = Object.entries(platformConfig).map(
  ([key, config]) => ({
    key,
    label: config.label,
  })
);

export const getPlatformIcon = (platform: string, additionalClasses = "") => {
  if (!platform) {
    return (
      <FaCircleQuestion
        className={`text-gray-500 ${additionalClasses} hover:opacity-80 transition`}
        size={20}
      />
    );
  }

  const formattedPlatform = platform.trim().toLowerCase();
  const config = platformConfig[formattedPlatform] || {
    icon: FaCircleQuestion,
    color: "text-gray-500",
  };

  return (
    <config.icon
      className={`${config.color} ${additionalClasses} hover:opacity-80 transition`}
      size={20}
    />
  );
};
