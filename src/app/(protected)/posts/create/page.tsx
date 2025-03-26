// src/app/(protected)/posts/create/page.tsx
"use client";

import { PostCreationProvider } from "@/context/PostCreationContext";
import PostCreationFlow from "@/components/post/create/PostCreationFlow";

export default function CreatePostPage() {
  return (
    <PostCreationProvider>
      <div className="max-w-3xl mx-auto p-4">
        <PostCreationFlow />
      </div>
    </PostCreationProvider>
  );
}
