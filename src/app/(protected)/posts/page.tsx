// src/app/(protected)/posts/page.tsx
"use client";

import { Suspense } from "react";
import { PostEditorProvider } from "@/context/PostEditorContext";
import { PostEditorEntry } from "./editor";
import { useFetchData } from "@/hooks/dataHooks";
import { POSTS_API } from "@/constants/api";
import { PostDto } from "@/types/dto";
import { mapPostDtoToPost } from "@/utils/transformers";

export default function PostsDashboard() {
  const { data, isLoading, error, mutate } = useFetchData<{ posts: PostDto[] }>(
    POSTS_API.LIST
  );
  const posts = (data?.posts || []).map(mapPostDtoToPost);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PostEditorProvider>
        <PostEditorEntry
          posts={posts}
          mutate={mutate}
          error={error}
          isLoading={isLoading}
        />
      </PostEditorProvider>
    </Suspense>
  );
}
