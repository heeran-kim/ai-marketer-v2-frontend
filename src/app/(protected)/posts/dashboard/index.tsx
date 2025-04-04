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
import type { KeyedMutator } from "swr";
import type { PostDto } from "@/types/dto";
import { POST_STATUS_OPTIONS } from "@/constants/posts";
import { PLATFORM_OPTIONS_WITH_LABEL } from "@/utils/icon";

const ITEMS_PER_PAGE = 5;

export const PostsDashboardView = ({
  posts,
  mutate,
  error,
}: {
  posts: Post[];
  mutate: KeyedMutator<{ posts: PostDto[] }>;
  error: unknown;
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

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-red-500">
        <p>Failed to load posts.</p>
        <button
          onClick={() => mutate()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Retry
        </button>
      </div>
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

  const handleRetry = (postId: string) => {
    console.log(`Retrying post: ${postId}`);
    // TODO: Implement retry logic
  };

  return (
    <div>
      <DeletePostHandler
        selectedPostId={selectedPostId}
        onClose={() => setSelectedPostId(undefined)}
        onSuccess={(message) => showNotification("success", message)}
        onError={(message) => showNotification("error", message)}
        onDeleteComplete={() => mutate()} // This will refresh the posts data
        posts={posts}
      />

      <PostsFilterBar
        setSearchTerm={setSearchTerm}
        selectedPlatform={selectedPlatform}
        setSelectedPlatform={setSelectedPlatform}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

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
