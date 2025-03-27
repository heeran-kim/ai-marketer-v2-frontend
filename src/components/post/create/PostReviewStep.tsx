"use client";

import Card from "@/components/common/CompactCard";
import ListCard from "@/components/common/ListCard";
import { usePostEditorContext } from "@/context/PostEditorContext";

export default function PostReviewStep() {
  const {
    image,
    selectableCategories: postCategories,
    platformStates,
  } = usePostEditorContext();

  if (!image) {
    throw new Error(
      "Unexpected: No image found in Step 4. Image upload is required in Step 1."
    );
  }

  const categories = postCategories
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
                image: image,
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
