// src/app/(protected)/posts/create/page.tsx
"use client";

import { PostEditorProvider } from "@/context/PostEditorContext";
import { PostEditorFlow } from "@/components/post/PostEditorFlow";

export default function CreatePostPage() {
  return (
    <PostEditorProvider>
      <div className="max-w-3xl mx-auto p-4">
        <PostEditorFlow />
      </div>
    </PostEditorProvider>
  );
}
