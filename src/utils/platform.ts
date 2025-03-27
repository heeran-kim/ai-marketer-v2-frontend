// src/utils/platform.ts
import { Platform } from "@/types/business";
import { platformConfig } from "@/utils/icon";

/**
 * Converts a platform key string to a Platform object
 * @param platformKey - The platform key (e.g., "facebook", "instagram")
 * @returns A Platform object with key, label and empty link/username
 */
export const toPlatformObject = (platformKey: string): Platform => {
  return {
    key: platformKey,
    label: platformConfig[platformKey]?.label || platformKey,
    link: "",
    username: "",
  };
};
