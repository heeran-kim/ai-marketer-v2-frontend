// src/app/(protected)/posts/create/components/PostDetails.tsx
"use client";

import { usePostEditorContext } from "@/context/PostEditorContext";
import { CompactCard } from "@/components/common";
import BusinessInfo from "./BusinessInfo";
import PostSettings from "./PostSettings";
import ItemInfo from "./ItemInfo";
import AdditionalPrompt from "./AdditionalPrompt";
import { PostEditorMode } from "@/types/post";

export default function PostDetails() {
  const { mode, captionGenerationSettings } = usePostEditorContext();
  const isCaptionGenerating =
    mode === PostEditorMode.CREATE && captionGenerationSettings.method === "ai";
  const includeItemDescription =
    captionGenerationSettings.includeItemDescription;

  return (
    <CompactCard>
      <div className="space-y-1">
        {isCaptionGenerating && <BusinessInfo />}
        <PostSettings />
        {includeItemDescription && isCaptionGenerating && <ItemInfo />}
        {isCaptionGenerating && <AdditionalPrompt />}
      </div>
    </CompactCard>
  );
}
