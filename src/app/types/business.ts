// src/types/business.ts

// Represents a business or brand
export interface Business {
    name: string;                   // Business name
    logo: string;                   // URL of the business logo (backend assigns a default if empty)
    category?: string;              // Business category (ex: "restaurant", "cafe")
    targetCustomers?: string;       // Target customer (ex: "young professionals", "students")
    vibe?: string;                  // Business branding or mood (ex: "luxury", "casual")
    hasSalesData?: boolean;         // Whether sales data is provided
}

// Default empty business object
export const EMPTY_BUSINESS: Business = {
    name: "",
    logo: "",
    category: "",
    targetCustomers: "",
    vibe: "",
    hasSalesData: false,
};

// Represents a linked social media account
export interface Platform {
    key: string;                    // Internal key for platform (e.g., "facebook", "twitter")
    label: string;                  // Display name (ex: "Facebook", "Twitter / X")
    link: string;                   // ex: "https://facebook.com/mybusiness"
    accountName: string;            // ex: "mybusiness" (Social media account name)
}

// Summary of posts for the dashboard (Key Metric for Business)
export interface PostsSummary {
    upcomingPosts: number;          // Number of scheduled posts
    uploadedPosts: number;          // Number of successfully uploaded posts
    failedPosts: number;            // Number of posts that failed to upload
    lastActivity: string | null;    // ex: "2024-03-01T12:00:00Z" (ISO timestamp) or null
    lastPostLink: string | null;    // ex: "https://facebook.com/mybusiness/posts/12345" or null
}

// Data structure for the dashboard view
export interface DashboardData {
    business: Pick<Business, "name" | "logo">;
    linkedPlatforms: Platform[];
    postsSummary: PostsSummary;
}
