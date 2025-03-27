"use client";

import { useEffect, useState } from "react";
import Card from "@/components/common/CompactCard";
import ListCard from "@/components/common/ListCard";
import { usePostEditorContext } from "@/context/PostEditorContext";
import { PostEditorMode } from "@/types/post";

export default function PostReviewStep() {
  const {
    mode,
    uploadedImageUrl,
    image,
    selectableCategories,
    platformStates,
  } = usePostEditorContext();
  const isCreating = mode === PostEditorMode.CREATE;
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setImageUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    } else if (uploadedImageUrl) {
      setImageUrl(uploadedImageUrl);
    }
  }, [image, uploadedImageUrl]);

  if (isCreating && !image) {
    throw new Error(
      "Unexpected: No image found in Step 4. Image upload is required in Step 1."
    );
  }

  const categories = selectableCategories
    .filter((category) => category.isSelected)
    .map((category) => category.label);

  return (
    <Card>
      <div className="space-y-4 mt-2">
        {platformStates
          .filter((platform) => platform.isSelected)
          .map((platformState) => (
            <ListCard
              key={platformState.key}
              item={{
                image: imageUrl,
                platform: platformState.key,
                selectedCategoryLabels: categories,
                caption: platformState.caption,
                type: "postReview",
              }}
            />
          ))}
      </div>
    </Card>
  );
}
