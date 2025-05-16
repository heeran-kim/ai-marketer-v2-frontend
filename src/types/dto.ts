// src/types/dto.ts
import { SelectableCategory } from "./post";
import { PromotionSuggestion } from "./promotion";

export interface PostDto {
  id: string; // Unique identifier for the post
  business: string; // Business associated with the post
  platform: string; // Platform where the post is published
  categories: string[]; // Categories assigned to the post
  caption: string; // Caption text of the post
  image: string; // URL or path to the post's image
  link: string; // Link associated with the post
  postId: string;
  createdAt: string; // Timestamp when the post was created
  postedAt: string; // Timestamp when the post was published
  scheduledAt: string; // Timestamp when the post is scheduled to be published
  status: string; // Current status of the post (e.g., published, scheduled, or failed)
  reactions: number; // Number of reactions (likes, etc.) on the post
  comments: number; // Number of comments on the post
  reposts: number; // Number of reposts or shares
  shares: number; // Number of shares of the post
  type: string; // Type (e.g., post)
}

export interface PostListDto {
  linked: boolean; // Whether the business is linked to a platform or not
  posts: PostDto[]; // Array of posts
}

/**
 * DTO for the configuration required in the post editor.
 * Contains information about the business, selectable categories, and linked platforms.
 */
export interface PostEditorConfigDto {
  business: {
    targetCustomers: string; // Description of the target customers
    vibe: string; // Business vibe or tone
    items?: Record<string, string>; // Optional list of items with name and description
    squareConnected: boolean; // Indicates if POS integration is available
    hasSalesData: boolean; // Indicates if sales data is available
  };
  selectableCategories: SelectableCategory[]; // List of categories that can be selected
  linkedPlatforms: {
    key: string; // Unique key for the platform
    label: string; // Display label for the platform
  }[]; // List of linked platforms
}

/**
 * DTO for the status of the Square integration.
 * Contains whether the Square account is linked and the business name.
 */
export interface SquareStatusDto {
  squareConnected: boolean; // Indicates if the Square account is linked
  businessName: string | null; // Name of the linked business
}

/**
 * DTO for promotion suggestions response.
 * Contains information about whether sales data is available
 * and a list of promotion suggestions based on that data.
 */
export interface PromotionSuggestionsDto {
  hasSalesData: boolean; // Indicates whether sales data is available for the business
  suggestions: PromotionSuggestion[]; // List of promotion suggestions based on available sales data
}
