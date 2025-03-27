// src/app/(protected)/posts/create/page.tsx
"use client";

import { PostEditorProvider } from "@/context/PostEditorContext";
import { PostEditorFlow } from "@/components/post/PostEditorFlow";
import { PostMode } from "@/app/types/post";

export default function CreatePostPage() {
  return (
    <PostEditorProvider>
      <div className="max-w-3xl mx-auto p-4">
        <PostEditorFlow mode={PostMode.CREATE} />
      </div>
    </PostEditorProvider>
  );
}
