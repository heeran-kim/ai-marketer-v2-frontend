// src/components/styles.ts
import clsx from "clsx";

// ✅ Container styles
export const baseContainerClass = "bg-white dark:bg-black border dark:border-gray-600 transition";

// ✅ Layout styles
export const flexRowClass = "flex items-center space-x-2";

// ✅ Base Navigation Button Styles
export const navItemClass = "flex items-center justify-center py-2 px-3 rounded-2xl transition text-sm";
export const hoverNavItemClass = "hover:bg-gray-100 dark:hover:bg-gray-800";
export const groupHoverNavItemClass = "group-hover:bg-gray-100 group-hover:dark:bg-gray-800";
export const activeNavItemClass = "bg-gray-100 dark:bg-gray-800"; // Keep hover effect when dropdown is open

// ✅ Auth Button Styles (Login, Dashboard, Sign Up, Logout)
export const authButtonClass = "border bg-white dark:bg-gray-900"; // For login/dashboard
export const primaryAuthButtonClass = "border bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-300"; // For Sign up & Logout

// ✅ Predefined Combinations for Different Components
export const dropdownNavItemClass = (isActive: boolean) =>
    clsx(navItemClass, groupHoverNavItemClass, { [activeNavItemClass]: isActive });

export const defaultNavItemClass = clsx(navItemClass, hoverNavItemClass);
export const authNavItemClass = clsx(navItemClass, hoverNavItemClass, authButtonClass);
export const primaryNavItemClass = clsx(navItemClass, primaryAuthButtonClass);
export const dropdownItemClass = clsx(flexRowClass, hoverNavItemClass, "p-2 rounded-lg transition");
export const dropdownTextClass = "font-semibold text-sm text-gray-900 dark:text-white";
export const dropdownSubTextClass = "text-xs text-gray-500 dark:text-gray-400";

// Status Color Mapping
const STATUS_COLORS: Record<string, string> = {
    "Failed": "bg-red-100 text-red-600",
    "Scheduled": "bg-yellow-100 text-yellow-600",
    "Posted": "bg-green-100 text-green-600",
    "Upcoming": "bg-blue-100 text-blue-600",
    "Ongoing": "bg-green-100 text-green-600",
    "Ended": "bg-gray-300 text-gray-700",
};

export const getStatusClass = (status: string) => STATUS_COLORS[status] || "bg-gray-200 text-gray-500";