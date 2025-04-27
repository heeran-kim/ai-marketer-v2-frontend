// src/app/(protected)/posts/page.tsx
"use client";

import { PostEditorProvider } from "@/context/PostEditorContext";
import { PostEditorEntry } from "./editor";
import { useFetchData } from "@/hooks/dataHooks";
import { POSTS_API } from "@/constants/api";
import { PostDto } from "@/types/dto";
import { mapPostDtoToPost } from "@/utils/transformers";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PostsDashboard() {

  //Following unused for the moment
  // const [params,setParams]=useState('');
  // const searchParams = useSearchParams();
  // useEffect(() => {
  //   const status = searchParams.get('status')

  //   if (!status||params!=='') {
  //     return;
  //   }

  //   if (status) {
  //     setParams(status);
  //     console.log(status);
  //   }
  // })

  const { data, isLoading, error } = useFetchData<{ posts: PostDto[] }>(
    POSTS_API.LIST
  );
  const posts = (data?.posts || []).map(mapPostDtoToPost);

  return (
    <PostEditorProvider>
      <PostEditorEntry posts={posts} error={error} isLoading={isLoading} />
    </PostEditorProvider>
  );
}
