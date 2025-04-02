// src/components/PromotionCard.tsx
import React from "react";
import { Promotion } from "@/types/promotion";
import { formatDateRange } from "@/utils/date";
import Image from "next/image";
import { ActionDropdown, CategoryChipList } from "@/components/common";
import { Action } from "@/types/nav";
import StatusIcon from "./StatusIcon";

interface PromotionCardProps {
  promotion: Promotion;
  onCreatePost: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const PromotionCard: React.FC<PromotionCardProps> = ({
  promotion,
  onCreatePost,
  onDuplicate,
  onDelete,
}) => {
  const {
    description,
    startDate,
    endDate,
    status,
    soldCount,
    posts,
    categories,
  } = promotion;

  console.log(posts);
  // Format dates
  const dateRange = formatDateRange(startDate, endDate);

  // Prepare actions for the dropdown
  const actions: Action[] = [
    {
      label: "Create Post",
      onClick: onCreatePost,
    },
    {
      label: "Duplicate",
      onClick: onDuplicate,
    },
    {
      label: "Delete",
      onClick: onDelete,
    },
  ];

  return (
    <div className="flex items-start space-x-3 px-2 pb-4 border-b border-gray-200 text-sm">
      {/* Left: Status Icon */}
      <div className="flex-shrink-0">
        <StatusIcon status={status.toLowerCase()} />
      </div>

      {/* Right: Content */}
      <div className="flex-1">
        {/* Top row: date/status on the left, dropdown on the right */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="dark:text-white font-bold">{dateRange}</span>
          </div>
          <ActionDropdown actions={actions} variant="inline" />
        </div>

        {/* Category chips */}
        {categories.length > 0 && (
          <div className="mt-1">
            <CategoryChipList labels={categories.map((cat) => cat.label)} />
          </div>
        )}

        {/* Description (post content) */}
        <div className="text-gray-800 mt-2 whitespace-pre-line dark:text-gray-100">
          {description}
        </div>

        {/* Connected post images */}
        {posts.length > 0 && (
          <div className="flex space-x-2 overflow-x-auto mt-2">
            {posts.map((post) => (
              <div
                key={post.id}
                className="w-60 border border-gray-200 rounded-lg bg-white overflow-hidden relative"
              >
                {/* Image container (no longer needs 'relative' here) */}
                <div className="relative w-60 h-40 overflow-hidden">
                  <Image
                    src={post.image}
                    alt="Connected post"
                    className="object-cover"
                    fill
                  />
                </div>

                {/* Overlay icon at top-right, inside the same 'relative' container */}
                <div className="absolute top-2 right-2 z-10">
                  <StatusIcon status={post.status.toLowerCase()} />
                </div>

                {/* Post details: caption, likes, comments */}
                <div className="p-1 text-xs">
                  <div className="h-32 overflow-y-auto py-1">
                    <p className="font-semibold break-words">{post.caption}</p>
                  </div>
                  <div className="mt-1 pt-1 text-gray-500 border-t border-gray-200 flex justify-between">
                    <span>❤️ {post.reactions}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reactions/Statistics */}
        <div className="font-semibold text-gray-700 mt-2 dark:text-gray-200">
          Sold: {soldCount}
        </div>
      </div>
    </div>
  );
};

export default PromotionCard;
