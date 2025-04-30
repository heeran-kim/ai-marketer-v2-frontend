// app/types/promotion.ts
import { PostDto } from "./dto";

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
  soldCount: number; // Number of units sold
  type: string;
};

export type PromotionSuggestion = {
  id: string;
  title: string;
  description: string;
  categories: { id: string; key: string; label: string }[];
  hasSalesData: boolean;
  isDismissed: boolean;
};
