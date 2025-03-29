"use client";

import { useEffect, useState } from "react";
import Card from "@/components/common/CompactCard";
import ListCard from "@/components/common/ListCard";
import { LoadingModal } from "@/components/common";
import { usePostEditorContext } from "@/context/PostEditorContext";
import { PostEditorMode, PostReview } from "@/types/post";

export default function PostReviewStep() {
  const {
    mode,
    selectedPost,
    uploadedImageUrl,
    image,
    selectableCategories,
    platformStates,
    updatePlatformScheduleDate,
  } = usePostEditorContext();
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

      const reviewItems = platformStates
        .filter((platform) => platform.isSelected)
        .map((platformState) => {
          return {
            image: currentImageUrl,
            platform: platformState.key,
            selectedCategoryLabels: categories,
            caption: platformState.caption,
            scheduleDate: platformState.scheduleDate || "",
            onScheduleChange: (newDate: string) =>
              updatePlatformScheduleDate(platformState.key, newDate),
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
    updatePlatformScheduleDate,
  ]);

  return (
    <>
      <LoadingModal isOpen={isLoading} />

      <Card>
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
      </Card>
    </>
  );
}
