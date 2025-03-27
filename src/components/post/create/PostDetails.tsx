// src/app/(protected)/posts/create/components/PostDetails.tsx
"use client";

import { usePostEditorContext } from "@/context/PostEditorContext";
import Card from "@/components/common/CompactCard";
import BusinessInfo from "./BusinessInfo";
import PostSettings from "./PostSettings";
import AdditionalPrompt from "./AdditionalPrompt";
import { PostEditorMode } from "@/types/post";

export default function PostDetails() {
  const { mode } = usePostEditorContext();
  const isEditing = mode === PostEditorMode.EDIT;

  return (
    <Card
      title="Step 2: Tell AI About Your Post"
      description="Help AI understand your post by providing some details. Your selections will shape the generated captions!"
    >
      <div className="space-y-1">
        {!isEditing && <BusinessInfo />}
        <PostSettings />
        {!isEditing && <AdditionalPrompt />}
      </div>
    </Card>
  );
}
