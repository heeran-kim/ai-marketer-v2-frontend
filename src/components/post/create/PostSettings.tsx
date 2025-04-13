"use client";

import { CompactCard } from "@/components/common";
import { usePostEditorContext } from "@/context/PostEditorContext";

export default function PostSettings() {
  const { selectableCategories, setSelectableCategories } =
    usePostEditorContext();

  const handleCategoryToggle = (categoryLabel: string) => {
    setSelectableCategories(
      selectableCategories.map((category) =>
        category.label === categoryLabel
          ? { ...category, isSelected: !category.isSelected }
          : category
      )
    );
  };

  return (
    <CompactCard title="Select Purpose">
      <div className="space-y-3">
        <div>
          <div className="flex flex-wrap gap-2">
            {selectableCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryToggle(category.label)}
                className={`px-3 py-1.5 rounded-md border text-sm transition ${
                  category.isSelected
                    ? "bg-gray-300"
                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </CompactCard>
  );
}
