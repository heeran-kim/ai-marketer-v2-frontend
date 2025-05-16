// src/components/styles.ts
import clsx from "clsx";

// ✅ Container styles
export const baseContainerClass = "bg-white border transition";

// ✅ Layout styles
export const flexRowClass = "flex items-center space-x-2";

// ✅ Base Navigation Button Styles
export const navItemClass =
  "flex items-center justify-center py-2 px-3 rounded-2xl transition text-sm";
export const hoverNavItemClass = "hover:bg-gray-100";
export const groupHoverNavItemClass = "group-hover:bg-gray-100";
export const activeNavItemClass = "bg-gray-100"; // Keep hover effect when dropdown is open

// ✅ Auth Button Styles (Login, Dashboard, Sign Up, Logout)
export const authButtonClass = "border bg-white"; // For login/dashboard
export const primaryAuthButtonClass =
  "border bg-black text-white hover:bg-gray-800"; // For Sign up & Logout

// ✅ Predefined Combinations for Different Components
export const dropdownNavItemClass = (isActive: boolean) =>
  clsx(navItemClass, groupHoverNavItemClass, {
    [activeNavItemClass]: isActive,
  });

export const defaultNavItemClass = clsx(navItemClass, hoverNavItemClass);
export const authNavItemClass = clsx(
  navItemClass,
  hoverNavItemClass,
  authButtonClass
);
export const primaryNavItemClass = clsx(navItemClass, primaryAuthButtonClass);
export const dropdownItemClass = clsx(
  flexRowClass,
  hoverNavItemClass,
  "p-2 rounded-lg transition"
);
export const dropdownTextClass = "font-semibold text-sm text-gray-900";
export const dropdownSubTextClass = "text-xs text-gray-500";

// Status Color Mapping
const STATUS_COLORS: Record<string, string> = {
  failed: "bg-red-100 text-red-800",
  scheduled: "bg-yellow-100 text-yellow-800",
  published: "bg-green-100 text-green-800",
  upcoming: "bg-yellow-100 text-yellow-800",
  ongoing: "bg-green-100 text-green-800",
  ended: "bg-gray-100 text-gray-800",
};

export const getStatusClass = (status: string) =>
  STATUS_COLORS[status] || "bg-gray-100 text-gray-800";

export const STATUS_COLORS_CHART: Record<string, string> = {
  Failed: "rgba(255, 99, 132, 0.6)",
  Scheduled: "rgba(255, 206, 86, 0.6)",
  Published: "rgba(75, 192, 192, 0.6)",
  upcoming: "rgba(54, 162, 235, 0.6)",
  ongoing: "rgba(153, 102, 255, 0.6)",
  ended: "rgba(201, 203, 207, 0.6)",
};

export const PLATFORM_CHART_COLORS: Record<string, string> = {
  facebook: "rgba(66, 103, 178, 0.6)",
  instagram: "rgba(225, 48, 108, 0.6)",
  default: "rgba(200, 200, 200, 0.6)",
};

export const platformButtonStyles = {
  base: "rounded-lg transition-all duration-200 px-4 py-2.5 flex flex-1 justify-center items-center gap-2 text-sm font-medium",

  states: {
    disabled:
      "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(0,0,0,0.05)_5px,rgba(0,0,0,0.05)_10px)]",

    selected: "bg-gray-200 text-white border shadow-sm",

    over: "bg-gray-100 border border-gray-300 text-gray-800 shadow-sm",

    default:
      "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300",
  },

  getClassNames: (
    isLinked: boolean,
    isSelected: boolean,
    isOver: boolean
  ): string => {
    if (!isLinked) {
      return `${platformButtonStyles.base} ${platformButtonStyles.states.disabled}`;
    }

    if (isSelected) {
      return `${platformButtonStyles.base} ${platformButtonStyles.states.selected}`;
    }

    if (isOver) {
      return `${platformButtonStyles.base} ${platformButtonStyles.states.over}`;
    }

    return `${platformButtonStyles.base} ${platformButtonStyles.states.default}`;
  },
};
