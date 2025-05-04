// src/app/(protected)/posts/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/common";
import { PostEditorProvider } from "@/context/PostEditorContext";
import { PostEditorEntry } from "./editor";

import { useFetchData } from "@/hooks/dataHooks";
import { POSTS_API } from "@/constants/api";
import { PostDto } from "@/types/dto";
import { mapPostDtoToPost } from "@/utils/transformers";


export default function PostsDashboard() {
  const router = useRouter();
  const { data, isLoading, error } = useFetchData<{ posts: PostDto[] }>(
    POSTS_API.LIST
  );
  const posts = (data?.posts || []).map(mapPostDtoToPost);

  return (
    <PostEditorProvider>
      <Header
        title="Posts"
        actionButton={{
          label: "Create Posts",
          onClick: () => router.push("/posts?mode=create", { scroll: false }),
        }}
      />
      <PostEditorEntry posts={posts} error={error} isLoading={isLoading} />
    </PostEditorProvider>
  );
}
