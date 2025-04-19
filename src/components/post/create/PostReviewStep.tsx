"use client";

import { useEffect, useState } from "react";
import { CompactCard, ListCard } from "@/components/common";
import { LoadingModal } from "@/components/common";
import { usePostEditorContext } from "@/context/PostEditorContext";
import { PostEditorMode, PostReview } from "@/types/post";

export default function PostReviewStep() {
  const {
    mode,
    selectedPost,
    uploadedImageUrl,
    captionGenerationInfo,
    selectableCategories,
    platformStates,
    selectedAspectRatio,
  } = usePostEditorContext();
  const { image } = captionGenerationInfo;
  const isEditing = mode === PostEditorMode.EDIT;

  const [preparedReviewItems, setPreparedReviewItems] = useState<PostReview[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    let objectUrl: string | null = null;

    const timer = setTimeout(() => {
      let currentImageUrl: string = "";

      if (image) {
        objectUrl = URL.createObjectURL(image);
        currentImageUrl = objectUrl;
      } else if (uploadedImageUrl) {
        currentImageUrl = uploadedImageUrl;
      }

      if (!currentImageUrl) {
        console.error(
          "Unexpected: No image found in Step 4. Image upload is required in Step 1."
        );
        setIsLoading(false);
        return;
      }

      const categories = selectableCategories
        .filter((category) => category.isSelected)
        .map((category) => category.label);

      const reviewItems = platformStates.map((platformState) => {
        return {
          image: currentImageUrl,
          platform: platformState.key,
          selectedCategoryLabels: categories,
          caption: platformState.caption,
          aspectRatio: selectedAspectRatio,
          type: "postReview" as const,
        };
      });

      setPreparedReviewItems(reviewItems as PostReview[]);
      setIsLoading(false);
    }, 300);

    return () => {
      clearTimeout(timer);
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [
    image,
    uploadedImageUrl,
    selectableCategories,
    platformStates,
    isEditing,
    selectedPost,
  ]);

  return (
    <>
      <LoadingModal isOpen={isLoading} />

      <CompactCard>
        {!isLoading && preparedReviewItems.length > 0 && (
          <div className="space-y-4 mt-2">
            {preparedReviewItems.map((reviewItem, index) => (
              <ListCard
                key={`review-${reviewItem.platform}-${index}`}
                item={reviewItem}
              />
            ))}
          </div>
        )}
      </CompactCard>
    </>
  );
}
