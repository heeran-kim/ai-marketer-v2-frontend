// src/types/business.ts

// Represents a business or brand
export interface Business {
  name: string | null; // Business name
  logo: string | null; // URL of the business logo
  category?: string | null; // Business category (ex: "restaurant", "cafe")
  targetCustomers?: string | null; // Target customer (ex: "young professionals", "students")
  vibe?: string | null; // Business branding or mood (ex: "luxury", "casual")
  hasSalesData?: boolean; // Whether sales data is provided
}

// Represents a linked social media account
export interface Platform {
  key: string; // Internal key for platform (e.g., "facebook", "twitter")
  label: string; // Display name (ex: "Facebook", "Twitter")
  link: string; // ex: "https://facebook.com/mybusiness"
  username: string; // ex: "mybusiness" (Social media account name)
  numPublished?: number;
}

// Summary of posts for the dashboard (Key Metric for Business)
export interface PostsSummary {
  numScheduled: number; // Number of scheduled posts
  numPublished: number; // Number of successfully uploaded posts
  numFailed: number; // Number of posts that failed to upload
}

export interface PostActivityData {
  platformsByDatetime: Record<string, string[]>; // { "2025-03-29T08:00:00Z": ["facebook", "instagram"] }
  lastPostDate: string | null; // ISO string (e.g., "2025-03-29T10:00:00Z")
}

// Data structure for the dashboard view
export interface DashboardData {
  business: Pick<Business, "name" | "logo">;
  linkedPlatforms: Platform[];
  postsSummary: PostsSummary;
  postActivity: PostActivityData;
}
