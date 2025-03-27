// src/components/post/DeletePostHandler.tsx
import { useState } from "react";
import { Post } from "@/app/types/post";
import { POSTS_API } from "@/constants/api";
import { apiClient } from "@/hooks/dataHooks";
import { ConfirmModal } from "@/components/common/ConfirmModal";

interface DeletePostHandlerProps {
  selectedPostId: string | undefined;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError?: (message: string) => void;
  onDeleteComplete: () => void;
  posts: Post[];
}

export const DeletePostHandler = ({
  selectedPostId,
  onClose,
  onSuccess,
  onError,
  onDeleteComplete,
  posts,
}: DeletePostHandlerProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // Generate appropriate message based on post status
  const getDeleteConfirmMessage = () => {
    const post = posts.find((p) => p.id === selectedPostId);

    if (!post)
      return "Are you sure you want to delete this post? This action cannot be undone.";

    switch (post.status) {
      case "Posted":
        return "Are you sure you want to delete this posted content? This will remove it from social media platforms.";
      case "Scheduled":
        return "Are you sure you want to delete this scheduled post? This will cancel the scheduled publishing.";
      case "Failed":
        return "Are you sure you want to delete this failed post? You may want to retry publishing it instead.";
      default:
        return "Are you sure you want to delete this post? This action cannot be undone.";
    }
  };

  const handleDelete = async (itemId: string | undefined) => {
    if (!itemId) return;
    setIsLoading(true);

    try {
      await apiClient.delete(POSTS_API.DELETE(itemId));
      onSuccess("Post deleted successfully!");
      onDeleteComplete(); // This could trigger a data refresh through SWR mutate
    } catch (error) {
      console.error("Error deleting post:", error);
      if (onError) {
        onError("Failed to delete post. Please try again.");
      }
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <ConfirmModal
      isOpen={!!selectedPostId}
      title="Delete Confirmation"
      message={getDeleteConfirmMessage()}
      confirmButtonText={isLoading ? "Deleting..." : "Delete"}
      itemId={selectedPostId}
      onClose={onClose}
      onConfirm={() => handleDelete(selectedPostId)}
    />
  );
};
