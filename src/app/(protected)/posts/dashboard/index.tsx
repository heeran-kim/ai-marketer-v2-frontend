// src/app/(protected)/posts/dashboard/index.tsx
// Posts dashboard main view.
// - Lists posts with search, filter, and pagination
// - Allows edit, delete, and retry actions
// - Controls modal notifications
"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useNotification } from "@/context/NotificationContext";
import { DeletePostHandler } from "@/components/post/DeletePostHandler";
import { PlatformKey } from "@/utils/icon";
import { Post } from "@/types/post";
import { DropboxItem } from "@/types/index";
import { usePostEditorContext } from "@/context/PostEditorContext";
import { PostsFilterBar } from "./PostsFilterBar";
import { PostList } from "./PostList";
import { POST_STATUS_OPTIONS } from "@/constants/posts";
import { PLATFORM_OPTIONS_WITH_LABEL } from "@/utils/icon";
import { Card, ErrorFallback } from "@/components/common";
import { mutate } from "swr";
import { POSTS_API } from "@/constants/api";
import { apiClient } from "@/hooks/dataHooks";

const ITEMS_PER_PAGE = 5;

export const PostsDashboardView = ({
  posts,
  error,
  isLoading,
}: {
  posts: Post[];
  error: unknown;
  isLoading: boolean;
}) => {
  const router = useRouter();
  const { setSelectedPost } = usePostEditorContext();
  const [selectedPostId, setSelectedPostId] = useState<string | undefined>(
    undefined
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformKey | null>(
    null
  );
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const { showNotification } = useNotification();

  const handleLoadMore = () => setVisibleCount((prev) => prev + ITEMS_PER_PAGE);

  const filteredPosts = posts.filter(
    (post) =>
      (!selectedPlatform || post.platform.key === selectedPlatform) &&
      (!selectedStatus || post.status === selectedStatus) &&
      (!searchTerm ||
        post.caption.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const slicedPosts = filteredPosts.slice(0, visibleCount);
  const searchParams = useSearchParams();
  const postIdParam = searchParams.get("id");
  const statusParam = searchParams.get("status");
  const platformParam = searchParams.get("platform");
  const postRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const normalisedStatus =
      POST_STATUS_OPTIONS.find(
        (s) => s.key.toLowerCase() === statusParam?.toLowerCase()
      )?.key ?? null;
    setSelectedStatus(normalisedStatus);
  }, [statusParam]);

  useEffect(() => {
    const normalisedPlatform =
      PLATFORM_OPTIONS_WITH_LABEL.find(
        (p) => p.key.toLowerCase() === platformParam?.toLowerCase()
      )?.key ?? null;
    setSelectedPlatform(normalisedPlatform);
  }, [platformParam]);

  // Auto-scroll to selected post when navigating from external links
  useEffect(() => {
    if (postIdParam && postRefs.current[postIdParam]) {
      postRefs.current[postIdParam]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [postRefs, slicedPosts, postIdParam]);

  // Automatically load more posts if the selected post isn't in the current view
  useEffect(() => {
    if (!postIdParam) return;

    const isVisible = slicedPosts.some((p) => p.id === postIdParam);

    if (!isVisible && filteredPosts.length > slicedPosts.length) {
      setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
    }
  }, [postIdParam, slicedPosts, filteredPosts]);

  // Show error UI if there's an error
  if (error) {
    const handleRetry = async () => {
      // Trigger global SWR revalidation
      await mutate(POSTS_API.LIST);
    };

    return (
      <ErrorFallback
        message="Failed to load posts. Please try again later."
        onRetry={handleRetry}
        isProcessing={isLoading}
      />
    );
  }

  // Replace your old delete functionality with:
  const handleOpenDeleteModal = (postId: string) => {
    setSelectedPostId(postId);
  };

  const handleEdit = (post: Post) => {
    setSelectedPost(post);
    router.push(`/posts?mode=edit&id=${post.id}`);
  };

  const handleRetry = async (postId: string) => {
    console.log(`Retrying post: ${postId}`);
    const formData = new FormData();
    formData.append("retry", "t");

    // Use the PATCH endpoint to retry the post
    await apiClient.patch(
      POSTS_API.UPDATE(postId),
      formData,
      {},
      true // isFormData flag
    );

    // Show success notification
    showNotification("success", "Post retry successfully!");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <DeletePostHandler
        selectedPostId={selectedPostId}
        onClose={() => setSelectedPostId(undefined)}
        onSuccess={(message) => showNotification("success", message)}
        onError={(message) => showNotification("error", message)}
        posts={posts}
      />

      <PostsFilterBar
        setSearchTerm={setSearchTerm}
        selectedPlatform={selectedPlatform}
        setSelectedPlatform={setSelectedPlatform}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />
      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : (
        posts.length === 0 && (
          <Card showButton={false}>
            <div className="text-center py-8 text-sm">
              <p className="text-gray-600 mb-6 whitespace-pre-line">
                {`No posts yet.\nClick 'Create Post' to start sharing your first post\nwith AI-powered help!`}
              </p>
            </div>
          </Card>
        )
      )}

      {posts.length > 0 && filteredPosts.length === 0 && (
        <Card showButton={false}>
          <div className="text-center py-8 text-sm">
            <p className="text-gray-600 mb-6 whitespace-pre-line">
              {`We couldn’t find any posts that match your search.\nTry changing the filters or keywords!`}
            </p>
          </div>
        </Card>
      )}

      <PostList
        posts={slicedPosts}
        actionsBuilder={(post) => {
          return [
            post.status === "Failed"
              ? { label: "Retry", onClick: () => handleRetry(post.id) }
              : false,
            post.status !== "Published"
              ? { label: "Edit", onClick: () => handleEdit(post) }
              : false,
            { label: "Delete", onClick: () => handleOpenDeleteModal(post.id) },
          ].filter(Boolean) as DropboxItem[];
        }}
        postRefs={postRefs}
      />

      {visibleCount < filteredPosts.length && (
        <div className="flex justify-center mt-6">
          <button
            id="load-more-button"
            onClick={handleLoadMore}
            className="w-full px-6 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-300 
                                rounded-lg shadow-sm hover:bg-gray-100 transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};
