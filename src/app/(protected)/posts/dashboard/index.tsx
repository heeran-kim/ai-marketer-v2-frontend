// src/app/(protected)/posts/dashboard/index.tsx
// Posts dashboard main view.
// - Lists posts with search, filter, and pagination
// - Allows edit, delete, and retry actions
// - Controls modal notifications
"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useFetchData } from "@/hooks/dataHooks";
import { NotificationModal, NotificationType } from "@/components/common";
import { DeletePostHandler } from "@/components/post/DeletePostHandler";
import { PLATFORM_OPTIONS } from "@/utils/icon";
import { Post } from "@/types/post";
import { DropboxItem } from "@/types/index";
import { POSTS_API } from "@/constants/api";
import { usePostEditorContext } from "@/context/PostEditorContext";
import { PostsFilterBar } from "./PostsFilterBar";
import { PostList } from "./PostList";
import { mapPostDtoToPost } from "@/utils/transformers";
import { PostDto } from "@/types/dto";

const ITEMS_PER_PAGE = 5;

export const PostsDashboardView = () => {
  const router = useRouter();
  const { setSelectedPost } = usePostEditorContext();

  const [postId, setPostId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | undefined>(
    undefined
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<
    (typeof PLATFORM_OPTIONS)[number] | null
  >(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const [notification, setNotification] = useState<{
    type: NotificationType;
    message: string;
    isOpen: boolean;
  }>({
    type: "info",
    message: "",
    isOpen: false,
  });

  const { data, error, mutate } = useFetchData<{ posts: PostDto[] }>(
    POSTS_API.LIST
  );
  const posts = (data?.posts || []).map(mapPostDtoToPost);

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
  const postRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const newPostId = searchParams.get("id");
    if (newPostId && newPostId !== postId) {
      setPostId(newPostId);
    }
  }, [searchParams, postId]);

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

  // Show notification helper function
  const showNotification = (type: NotificationType, message: string) => {
    setNotification({
      type,
      message,
      isOpen: true,
    });
  };

  // Close notification helper function
  const closeNotification = () => {
    setNotification((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

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
      <NotificationModal
        isOpen={notification.isOpen}
        type={notification.type}
        message={notification.message}
        onClose={closeNotification}
      />

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
            post.status !== "Posted"
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
