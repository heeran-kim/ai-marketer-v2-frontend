// src/constants/promotions.ts

export const PROMOTION_CATEGORIES_OPTIONS = [
  { key: "discount", label: "Deals & Discounts" },
  { key: "bundle", label: "Combos & Bundles" },
  { key: "trend", label: "Trending Now" },
  { key: "menu", label: "New Menu Ideas" },
  { key: "social", label: "Social Media Content" },
];

export type PromotionCategoryKey =
  (typeof PROMOTION_CATEGORIES_OPTIONS)[number]["key"];

export const PROMOTION_STATUS_OPTIONS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "ongoing", label: "Ongoing" },
  { key: "ended", label: "Ended" },
];
