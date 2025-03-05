// src/types/posts.ts
import { Business, Platform } from "./business";

// Represents a social media post
export interface Post {
    id: string;                     // Unique post ID
    business: string;               // Associated business name (ex: "My Coffee Shop")
    platform: string;               // ex: "facebook", "twitter"
    categories: string[];           // ex: ["Brand Story", "Product Highlight"]
    caption: string;                // Text content of the post
    image: string;                  // URL of the attached image
    link: string;                   // ex: "https://facebook.com/mybusiness/posts/12345"
    createdAt: string;              // ex: "2024-03-01T12:00:00Z" (ISO timestamp)
    postedAt: string;               // ex: "2024-03-02T14:30:00Z" (ISO timestamp)
    scheduledAt: string;            // ex: "2024-03-03T09:00:00Z" (ISO timestamp)
    status: string;                 // ex: "scheduled", "posted", "failed"
    reactions: number;              // Number of likes/reactions
    comments: number;               // Number of comments
    reposts: number;                // Number of times reposted
    shares: number;                 // Number of shares
}

// Represents a category assigned to a post
export interface PostCategory {
    id: number;                     // Unique category ID
    key: string;                    // Internal key for category (e.g., "brandStory", "productHighlight")
    label: string;                  // Display name (e.g., "Brand Story", "Product Highlight")
    selected: boolean;              // Whether this category is selected
}

// Configuration data required for post creation
export interface PostCreationConfig {
    business: Pick<Business, "targetCustomers" | "vibe" | "hasSalesData">;  
    postCategories: PostCategory[];
    linkedPlatforms: Pick<Platform, "key" | "label">[];
}

// Represents a social media platform selection state
export interface PlatformState {
    key: string;                    // ex: "facebook"
    label: string;                  // ex: "Facebook"
    isSelected: boolean;            // Whether this platform is selected for posting
    caption: string;                // The final caption chosen for this platform
}

// Represents the response from AI image analysis
export interface ImageAnalysisResponse {
    detectedItems: string[];        // List of detected objects (e.g., ["Steak", "Lemon"])
}

export interface CustomisedBusinessInfo extends Pick<Business, "targetCustomers" | "vibe"> {
    isUsingSalesData: boolean;
}

// Context type for managing post creation state
export interface PostCreationContextType {
    // Selected image for the post
    image: File | null;
    setImage: (image: File | null) => void;

    // AI-detected objects from the image (e.g., "Steak", "Lemon")
    detectedItems: string[];
    setDetectedItems: (items: string[]) => void;

    // Business-related details that influence post generation
    hasSalesData: boolean;
    customisedBusinessInfo: CustomisedBusinessInfo;
    setCustomisedBusinessInfo: (info: CustomisedBusinessInfo) => void;

    // Categories assigned to the post (e.g., "Brand Story", "Product Highlight")
    postCategories: PostCategory[];
    setPostCategories: (categories: PostCategory[]) => void;

    // User-provided additional details for AI-generated captions
    additionalPrompt: string;
    setAdditionalPrompt: (prompt: string) => void;

    // Platforms where the post will be uploaded (e.g., Facebook, Twitter)
    platformStates: PlatformState[];
    setPlatformStates: (states: PlatformState[]) => void;
    setCaption: (key: string, caption: string) => void;

    // AI-generated caption suggestions
    captionSuggestions: string[];
    setCaptionSuggestions: (captions: string[]) => void;

    // Function to reset all post creation data
    resetPostCreation: () => void;
}