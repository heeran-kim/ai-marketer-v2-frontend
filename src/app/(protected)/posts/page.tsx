// src/app/(protected)/posts/page.tsx
"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PostsDashboardContent from "./PostsDashboardContent";
import Modal from "@/components/common/Modal";
import { PostEditorFlow } from "@/components/post/PostEditorFlow";
import { PostEditorProvider } from "@/context/PostEditorContext";
import { PostMode } from "@/app/types/post";

function PostsContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const isCreating = mode === "create";
  const isEditing = mode === "edit";
  const router = useRouter();

  useEffect(() => {
    // If the user is on a mobile device and trying to open the editor, redirect to a full page
    if ((isCreating || isEditing) && window.innerWidth < 640) {
      router.replace(isCreating ? "/posts/create" : "/posts/edit");
    }
  }, [isCreating, isEditing, router]);

  return (
    <>
      {/* Show a modal only on desktop (>=640) */}
      {(isCreating || isEditing) && window.innerWidth >= 640 && (
        <PostEditorProvider>
          <Modal isOpen={true} onClose={() => router.push("/posts")}>
            <PostEditorFlow
              mode={isCreating ? PostMode.CREATE : PostMode.EDIT}
            />
          </Modal>
        </PostEditorProvider>
      )}

      {/* Render the posts dashboard */}
      <PostsDashboardContent />
    </>
  );
}

export default function PostsDashboard() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PostsContent />
    </Suspense>
  );
}
