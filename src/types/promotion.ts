// app/types/promotion.ts
import { PostDto } from "./dto";

// Represents a promotional campaign consisting of multiple posts
export type Promotion = {
  id: string; // Unique promotion ID
  business: string; // Associated business name
  posts: PostDto[]; // List of related posts
  categories: { key: string; label: string }[];
  description: string; // Description of the promotion
  startDate: string; // ex: "2024-04-01T00:00:00Z" (ISO timestamp)
  endDate: string; // ex: "2024-04-10T23:59:59Z" (ISO timestamp)
  status: string; // ex: "upcoming", "ongoing"
  soldCount: number; // Number of units sold
  type: string;
};
