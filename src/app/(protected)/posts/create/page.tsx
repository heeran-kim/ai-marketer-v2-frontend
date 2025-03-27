// src/app/(protected)/posts/create/page.tsx
"use client";

import { PostCreationProvider } from "@/context/PostCreationContext";
import PostEditorFlow from "@/components/post/PostEditorFlow";

export default function CreatePostPage() {
  return (
    <PostCreationProvider>
      <div className="max-w-3xl mx-auto p-4">
        <PostEditorFlow />
      </div>
    </PostCreationProvider>
  );
}
