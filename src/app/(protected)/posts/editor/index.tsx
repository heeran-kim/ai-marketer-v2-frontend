// src/app/(protected)/posts/editor/index.tsx
// Editor route entry point.
// - Shows the post editor modal
// - Renders PostsDashboardView behind the modal
"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Modal } from "@/components/common";
import { PostsDashboardView } from "@/app/(protected)/posts/dashboard";
import { PostEditorFlow } from "@/components/post/PostEditorFlow";
import { usePostEditorContext } from "@/context/PostEditorContext";
import { Post } from "@/types/post";
import type { KeyedMutator } from "swr";
import type { PostDto } from "@/types/dto";

export const PostEditorEntry = ({
  posts,
  error,
  isLoading,
  mutate,
}: {
  posts: Post[];
  error: unknown;
  isLoading: boolean;
  mutate: KeyedMutator<{ posts: PostDto[] }>;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const showEditor = useMemo(() => mode !== null, [mode]);
  const { resetPostEditor } = usePostEditorContext();

  return (
    <>
      {showEditor && (
        <Modal
          isOpen={true}
          onClose={() => {
            resetPostEditor();
            // Use router.back() to maintain proper navigation history when closing modals
            router.back();
          }}
        >
          <PostEditorFlow mutate={mutate} />
        </Modal>
      )}

      {/* Render the posts dashboard */}
      <PostsDashboardView
        posts={posts}
        error={error}
        isLoading={isLoading}
        mutate={mutate}
      />
    </>
  );
};
