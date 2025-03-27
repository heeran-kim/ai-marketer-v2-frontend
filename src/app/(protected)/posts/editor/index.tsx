// src/app/(protected)/posts/editor/index.tsx
// Editor route entry point.
// - Shows the post editor modal on desktop
// - Redirects to a full editor page on mobile
// - Renders PostsDashboardView behind the modal
"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Modal from "@/components/common/Modal";
import { PostsDashboardView } from "@/app/(protected)/posts/dashboard";
import { PostEditorFlow } from "@/components/post/PostEditorFlow";
import { usePostEditorContext } from "@/context/PostEditorContext";
import { PostEditorMode } from "@/types/post";

export const PostEditorEntry = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const postId = searchParams.get("id");
  const isCreating = mode === "create";
  const isEditing = mode === "edit";
  const showEditor = useMemo(
    () => mode === "create" || mode === "edit",
    [mode]
  );
  const { resetPostEditor } = usePostEditorContext();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      showEditor &&
      window.innerWidth < 640
    ) {
      if (isCreating) {
        router.push(`/posts/editor?mode=${PostEditorMode.CREATE}`);
      } else if (isEditing && postId) {
        router.push(`/posts/editor?mode=${PostEditorMode.EDIT}&id=${postId}`);
      }
    }
  }, [showEditor, isCreating, isEditing, postId, router]);

  return (
    <>
      {/* Show a modal only on desktop (>=640) */}
      {showEditor && window.innerWidth >= 640 && (
        <Modal
          isOpen={true}
          onClose={() => {
            resetPostEditor();
            router.push("/posts");
          }}
        >
          <PostEditorFlow />
        </Modal>
      )}

      {/* Render the posts dashboard */}
      <PostsDashboardView />
    </>
  );
};
