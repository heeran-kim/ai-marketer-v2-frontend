// src/components/CategoryChip.tsx
import React from "react";

interface CategoryChipProps {
  label: string;
}

const CategoryChip: React.FC<CategoryChipProps> = ({ label }) => {
  return (
    <span className="px-2 py-0.5 rounded-full bg-gray-200 text-xs text-gray-700">
      {label}
    </span>
  );
};

export default CategoryChip;
