// src/app/(protected)/posts/create/page.tsx
"use client";

import { PostCreationProvider } from "@/context/PostCreationContext";
import { PostEditorFlow } from "@/components/post/PostEditorFlow";
import { PostMode } from "@/app/types/post";

export default function CreatePostPage() {
  return (
    <PostCreationProvider>
      <div className="max-w-3xl mx-auto p-4">
        <PostEditorFlow mode={PostMode.CREATE} />
      </div>
    </PostCreationProvider>
  );
}
