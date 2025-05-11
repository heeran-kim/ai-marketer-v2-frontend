// app/types/promotion.ts
import { PostDto } from "./dto";

// Define the performance types
export type ProductCategory =
  | "top_10_percent"
  | "bottom_10_percent"
  | "average";

export interface ProductWithCategory {
  name: string;
  category: ProductCategory;
}

// Represents a promotional campaign consisting of multiple posts
export type Promotion = {
  id: string; // Unique promotion ID
  business: string; // Associated business name
  posts: PostDto[]; // List of related posts
  categories: { id: string; key: string; label: string }[];
  description: string; // Description of the promotion
  startDate: string; // ex: "2024-04-01T00:00:00Z" (ISO timestamp)
  endDate: string; // ex: "2024-04-10T23:59:59Z" (ISO timestamp)
  status: string; // ex: "upcoming", "ongoing"
  soldCount?: number; // Number of units sold
  salesChange?: number;
  productNames: string[];
  products: ProductWithCategory[]; // Products with category information
  type: string;
};

export type PromotionSuggestion = {
  id: string;
  title: string;
  description: string;
  categories: { id: string; key: string; label: string }[];
  hasSalesData: boolean;
  isDismissed: boolean;
  dataPeriod: { startDate: string; endDate: string };
  productNames: string[];
  products: ProductWithCategory[]; // Products with category information
};
