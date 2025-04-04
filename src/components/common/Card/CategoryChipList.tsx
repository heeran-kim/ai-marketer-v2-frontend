// src/components/common/CategoryChipList.tsx
import React from "react";
import CategoryChip from "./CategoryChip";

interface CategoryChipListProps {
  labels: string[];
  maxVisible?: number;
}

const CategoryChipList: React.FC<CategoryChipListProps> = ({
  labels,
  maxVisible = 2,
}) => {
  const visibleLabels = labels.slice(0, maxVisible);
  const remainingCount = labels.length - maxVisible;

  return (
    <div className="flex flex-wrap gap-1">
      {visibleLabels.map((label) => (
        <CategoryChip key={label} label={label} />
      ))}
      {remainingCount > 0 && (
        <span className="px-2 py-0.5 rounded-full bg-gray-200 text-xs text-gray-700">
          +{remainingCount}
        </span>
      )}
    </div>
  );
};

export default CategoryChipList;
