// Importing the SelectableCategory type from the post module
import { SelectableCategory } from "./post";

// Interface representing raw post data received from the backend
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

// Interface representing configuration data required for the post editor
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

export interface SquareStatusDto {
  squareConnected: boolean; // Indicates if the Square account is linked
  businessName: string | null; // Name of the linked business
}
