// src/types/posts.ts
import { PlatformKey } from "@/utils/icon";
import { Platform } from "./business";
import { PLATFORM_SCHEDULE_OPTIONS, ScheduleType } from "@/constants/posts";

// Represents a refined post model used in the frontend
export interface Post {
  imageUrl: string | undefined; // URL of the post's image
  id: string; // Unique identifier for the post
  business: string; // Name of the associated business
  platform: Platform; // Social media platform where the post will be published
  selectedCategoryLabels: string[]; // Labels for selected categories (e.g., "Brand Story")
  caption: string; // Text content of the post
  image: string; // URL of the attached image
  aspectRatio: string; // Aspect ratio of the image (e.g., "4/5")
  link: string; // Link to the post on the platform
  postId: string;
  createdAt: string; // ISO timestamp of when the post was created
  postedAt: string; // ISO timestamp of when the post was published
  scheduledAt: string; // ISO timestamp of when the post is scheduled
  status: string; // Status of the post (e.g., "scheduled", "posted", "failed")
  reactions: number; // Number of reactions/likes
  comments: number; // Number of comments
  reposts: number; // Number of reposts
  shares: number; // Number of shares
  type: string; // Type of the post (e.g., "post")
}

// Represents a post review before publishing on social media platforms
export type PostReview = {
  image: string; // URL of the user-uploaded image
  platform: string; // Target platform for the post (e.g., "facebook", "twitter")
  selectedCategoryLabels: string[]; // Selected categories describing the post content
  caption: string; // User-selected caption for the post
  aspectRatio: string; // Aspect ratio of the image (e.g., "4/5")
  type: string; // Type of the post
  onScheduleChange: (newDate: string) => void; // Callback to handle schedule changes
  scheduleDate: string; // Scheduled date for the post
};

// Represents a category that can be assigned to a post
export interface SelectableCategory {
  id: number; // Unique identifier for the category
  key: string; // Internal key for the category (e.g., "brandStory")
  label: string; // Display name for the category (e.g., "Brand Story")
  isSelected: boolean; // Indicates whether the category is selected
}

// Represents the state of a social media platform selection
export interface PlatformState {
  key: PlatformKey; // Key of the platform (e.g., "facebook")
  label: string; // Display name of the platform (e.g., "Facebook")
  caption: string; // Final caption chosen for the platform
}

// Represents the schedule state for each platform
export interface PlatformSchedule {
  scheduleType: (typeof PLATFORM_SCHEDULE_OPTIONS)[number]["key"]; // Type of schedule (e.g., "instant", "scheduled", "dontPost")
  scheduleDate: string | null; // Scheduled date in ISO format or null if not set
}

// Map of platform keys to their schedule states
export type PlatformScheduleMap = Record<PlatformKey, PlatformSchedule>;

// Represents AI settings for post generation
export interface CaptionGenerationSettings {
  method: "ai" | "manual"; // Caption generation method ("ai" for AI-generated, "manual" for user-written)
  includeItemDescription: boolean; // Indicates whether to include item descriptions from Square API in caption generation
}

export const RESET_CAPTION_GENERATION_SETTINGS: CaptionGenerationSettings = {
  method: "ai",
  includeItemDescription: false,
};

export type CaptionGenerationInfo = {
  image: File | null; // Uploaded image file
  businessInfo: {
    targetCustomers: string; // Target customers for the business (e.g., "Foodies")
    vibe: string; // Vibe of the business (e.g., "Casual Dining")
  };
  itemInfo: { name: string; description: string }[];
  additionalPrompt: string; // Additional custom prompt text provided by the user
};

export const RESET_CAPTION_GENERATION_INFO: CaptionGenerationInfo = {
  image: null,
  businessInfo: { targetCustomers: "", vibe: "" },
  itemInfo: [],
  additionalPrompt: "",
};

export const StepNames = [
  "RESET", // Explicit RESET step
  "CAPTION_METHOD_SELECTION",
  "IMAGE_SELECTION",
  "POST_DETAILS",
  "CAPTION_EDITOR",
  "POST_REVIEW",
] as const;

export type StepName = (typeof StepNames)[number];

export type StepState = {
  stepNumber: number;
  stepName: StepName;
};

export type StepAction =
  | {
      payload: { captionGenerationSettings: CaptionGenerationSettings };
      type: "NEXT";
    }
  | {
      payload: { captionGenerationSettings: CaptionGenerationSettings };
      type: "BACK";
    }
  | { type: "RESET" }
  | { type: "INIT_FOR_CREATE" }
  | { type: "INIT_FOR_EDIT" };

// Context type for managing post creation/editing state in the PostEditor
export interface PostEditorContextType {
  isLoading: boolean; // Indicates whether the editor is in a loading state
  setIsLoading: (isLoading: boolean) => void; // Function to update the loading state
  loadingMessage: string; // Message displayed during loading
  setLoadingMessage: (message: string) => void; // Function to update the loading message
  errorMessage: string | null; // Error message, if any
  setErrorMessage: (message: string | null) => void; // Function to update the error message

  mode: PostEditorMode | null; // Current editor mode ("create" or "edit")

  stepState: StepState; // Current step in the editor flow
  dispatch: (action: StepAction) => void; // Function to update the current step

  selectedPost: Post | null; // Post being edited (only available in edit mode)
  setSelectedPost: (post: Post | null) => void; // Function to update the selected post

  uploadedImageUrl: string | null; // URL of the uploaded image (used in edit mode)
  setUploadedImageUrl: (imageUrl: string | null) => void; // Function to update the uploaded image URL

  selectableCategories: SelectableCategory[]; // Categories assigned to the post
  setSelectableCategories: (categories: SelectableCategory[]) => void; // Function to update selectable categories

  platformStates: PlatformState[]; // Platforms where the post will be published
  setPlatformStates: (states: PlatformState[]) => void; // Function to update platform states

  platformSchedule: PlatformScheduleMap; // Schedule state for each platform

  selectedAspectRatio: string | "4/5"; // Aspect ratio of the image (e.g., "4/5")
  setAspectRatio: (aspectRatio: string) => void; // Function to update the aspectRatio

  setPlatformCaption: (key: string, caption: string) => void; // Function to update the caption for a specific platform

  captionSuggestions: string[]; // AI-generated caption suggestions
  setCaptionSuggestions: (captions: string[]) => void; // Function to update caption suggestions

  captionGenerationSettings: CaptionGenerationSettings; // Current AI settings for the post editor
  setCaptionGenerationSettings: (settings: CaptionGenerationSettings) => void; // Function to update AI settings

  menuItems: Record<string, string>; // List of items with name and description
  captionGenerationInfo: CaptionGenerationInfo; // Information used for AI caption generation
  setCaptionGenerationInfo: (info: CaptionGenerationInfo) => void; // Function to update caption generation info

  updateCaptionSuggestion: (index: number, editedCaption: string) => void; // Function to update a specific caption suggestion
  updatePlatformScheduleType: (
    platformKey: string,
    newType: ScheduleType
  ) => void; // Function to update the schedule type for a platform
  updatePlatformScheduleDate: (platformKey: string, newDate: string) => void; // Function to update the schedule date for a platform

  resetPostEditor: () => void; // Function to reset all editor state

  fetchCaptionSuggestions: () => void; // Function to fetch AI-generated caption suggestions
  createPost: () => void; // Function to create a new post
  updatePost: () => void; // Function to update an existing post
}

// Enum representing the editor mode
export enum PostEditorMode {
  CREATE = "create", // Create mode
  EDIT = "edit", // Edit mode
}
