// src/app/(protected)/posts/page.tsx
"use client";

import { Suspense } from "react";
import { PostEditorProvider } from "@/context/PostEditorContext";
import { PostsContent } from "./PostsContent";

export default function PostsDashboard() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PostEditorProvider>
        <PostsContent />
      </PostEditorProvider>
    </Suspense>
  );
}
