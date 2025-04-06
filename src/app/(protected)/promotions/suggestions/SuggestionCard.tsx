// src/components/PromotionCard.tsx
import React from "react";
import { PromotionSuggestion } from "@/types/promotion";
import { CategoryChipList } from "@/components/common";

interface SuggestionCardProps {
  suggestion: PromotionSuggestion;
  onCreatePromotion: () => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({
  suggestion,
  onCreatePromotion,
}) => {
  const { title, description, categories } = suggestion;

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4">
      {/* Title */}
      <div className="dark:text-white font-medium mb-3">{title}</div>

      {/* Category chips */}
      {categories.length > 0 && (
        <div className="mb-3">
          <CategoryChipList labels={categories.map((cat) => cat.label)} />
        </div>
      )}

      {/* Description */}
      <div className="text-sm text-gray-700 mb-3 whitespace-pre-line">
        {description}
      </div>

      {/* Statistics and Create promotion button */}
      <div className="flex justify-end">
        <button
          className="px-3 py-1 bg-black text-white rounded text-sm hover:bg-gray-800"
          onClick={onCreatePromotion}
        >
          Create Promotion
        </button>
      </div>
    </div>
  );
};

export default SuggestionCard;
