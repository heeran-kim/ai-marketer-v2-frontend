// src/types/posts.ts
import { Business, Platform } from "./business";

// Refined post model used in frontend
export interface Post {
  imageUrl: string | undefined;
  id: string; // Unique post ID
  business: string; // Associated business name (ex: "My Coffee Shop")
  platform: Platform; // Changed from string to Platform interface
  selectedCategoryLabels: string[];
  caption: string; // Text content of the post
  image: string; // URL of the attached image
  link: string; // ex: "https://facebook.com/mybusiness/posts/12345"
  createdAt: string; // ex: "2024-03-01T12:00:00Z" (ISO timestamp)
  postedAt: string; // ex: "2024-03-02T14:30:00Z" (ISO timestamp)
  scheduledAt: string; // ex: "2024-03-03T09:00:00Z" (ISO timestamp)
  status: string; // ex: "scheduled", "posted", "failed"
  reactions: number; // Number of likes/reactions
  comments: number; // Number of comments
  reposts: number; // Number of times reposted
  shares: number; // Number of shares
  type: string; // post
}

// Represents a post review before publishing on social media platforms.
export type PostReview = {
  image: string; // User-uploaded image URL
  platform: string; // Target platform for the post (e.g., "facebook", "twitter")
  selectedCategoryLabels: string[]; // Selected categories describing the post content (e.g., ["Brand Story", "Product Highlight"])
  caption: string; // User-selected caption for the post
  type: string;
  onScheduleChange: (newDate: string) => void;
  scheduleDate: string;
};

// Represents a category assigned to a post
export interface SelectableCategory {
  id: number; // Unique category ID
  key: string; // Internal key for category (e.g., "brandStory", "productHighlight")
  label: string; // Display name (e.g., "Brand Story", "Product Highlight")
  isSelected: boolean; // Whether this category is selected
}

// Configuration data required for post editor
export interface PostEditorConfig {
  business: Pick<Business, "targetCustomers" | "vibe" | "hasSalesData">; // Business preferences used to generate tailored captions
  selectableCategories: SelectableCategory[]; // Categories available for the post with selection state (for UI toggle)
  linkedPlatforms: Pick<Platform, "key" | "label">[]; // Social media platforms linked to the business
}

// Represents a social media platform selection state
export interface PlatformState {
  key: string; // ex: "facebook"
  label: string; // ex: "Facebook"
  isSelected: boolean; // Whether this platform is selected for posting
  caption: string; // The final caption chosen for this platform
  scheduleDate?: string; // (Optional) ISO timestamp for scheduled post time on this platform
}

// Represents the response from AI image analysis
export interface ImageAnalysisResponse {
  detectedItems: string[]; // List of detected objects (e.g., ["Steak", "Lemon"])
}

export interface CustomisedBusinessInfo
  extends Pick<Business, "targetCustomers" | "vibe"> {
  isUsingSalesData: boolean;
}

// Context type for managing post creation/editing state in the PostEditor
export interface PostEditorContextType {
  // Current editor mode: "create" or "edit"
  mode: PostEditorMode | null;

  // Post being edited (only available in edit mode)
  selectedPost: Post | null;
  setSelectedPost: (post: Post | null) => void;

  // URL of the image uploaded in a previous session (used in edit mode)
  uploadedImageUrl: string | null;
  setUploadedImageUrl: (imageUrl: string | null) => void;

  // Selected image file for the post (local File object)
  image: File | null;
  setImage: (image: File | null) => void;

  // AI-detected objects from the image (e.g., "Steak", "Lemon")
  detectedItems: string[];
  setDetectedItems: (items: string[]) => void;

  // Whether the business has associated sales data
  hasSalesData: boolean;

  // Business-related details that influence post generation
  customisedBusinessInfo: CustomisedBusinessInfo;
  setCustomisedBusinessInfo: (info: CustomisedBusinessInfo) => void;

  // Categories assigned to the post (e.g., "Brand Story", "Product Highlight")
  selectableCategories: SelectableCategory[];
  setSelectableCategories: (categories: SelectableCategory[]) => void;

  // Additional custom prompt text provided by the user
  additionalPrompt: string;
  setAdditionalPrompt: (prompt: string) => void;

  // Platforms where the post will be published (e.g., Facebook, Twitter), with caption state
  platformStates: PlatformState[];
  setPlatformStates: (states: PlatformState[]) => void;

  // Updates the caption for a specific platform
  setCaption: (key: string, caption: string) => void;

  // AI-generated caption suggestions (used in caption selection step)
  captionSuggestions: string[];
  setCaptionSuggestions: (captions: string[]) => void;

  // Updates a specific caption suggestion (after user edits)
  updateCaptionSuggestion: (index: number, editedCaption: string) => void;

  updatePlatformScheduleDate: (platformKey: string, newDate: string) => void;

  // Resets all editor state back to initial
  resetPostEditor: () => void;
}

// Editor mode used in PostEditorContext
export enum PostEditorMode {
  CREATE = "create",
  EDIT = "edit",
}
