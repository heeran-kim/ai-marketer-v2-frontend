// src/app/(protected)/posts/page.tsx
"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Modal from "@/components/common/Modal";
import { PostEditorFlow } from "@/components/post/PostEditorFlow";
import PostsDashboardContent from "./PostsDashboardContent";
import { PostCreationProvider } from "@/context/PostCreationContext";
import { PostMode } from "@/app/types/post";

function PostsContent() {
  const searchParams = useSearchParams();
  const isCreating = searchParams.get("create") === "true";
  const router = useRouter();

  useEffect(() => {
    // If the user is on a mobile device and trying to create a post, redirect to a full page
    if (isCreating && window.innerWidth < 640) {
      router.replace("/posts/create");
    }
  }, [isCreating, router]);

  return (
    <>
      {/* Show a modal only on desktop (>=640) */}
      {isCreating && window.innerWidth >= 640 && (
        <PostCreationProvider>
          <Modal isOpen={true} onClose={() => router.push("/posts")}>
            <PostEditorFlow mode={PostMode.CREATE} />
          </Modal>
        </PostCreationProvider>
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
