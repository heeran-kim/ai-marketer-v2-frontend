// src/app/(protected)/posts/create/components/PostDetails.tsx
"use client";

import { usePostEditorContext } from "@/context/PostEditorContext";
import { CompactCard } from "@/components/common";
import BusinessInfo from "./BusinessInfo";
import PostSettings from "./PostSettings";
import AdditionalPrompt from "./AdditionalPrompt";
import { PostEditorMode } from "@/types/post";

export default function PostDetails() {
  const { mode } = usePostEditorContext();
  const isEditing = mode === PostEditorMode.EDIT;

  return (
    <CompactCard>
      <div className="space-y-1">
        {!isEditing && <BusinessInfo />}
        <PostSettings />
        {!isEditing && <AdditionalPrompt />}
      </div>
    </CompactCard>
  );
}
