// PromotionsFilterBar.tsx
"use client";

import { Select, SearchBar } from "@/components/common";
import {
  PROMOTION_CATEGORIES_OPTIONS,
  PROMOTION_STATUS_OPTIONS,
} from "@/constants/promotions";

interface Props {
  setSearchTerm: (value: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (value: string | null) => void;
  selectedStatus: string | null;
  setSelectedStatus: (value: string | null) => void;
}

export const PromotionsFilterBar = ({
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
}: Props) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 p-4 md:px-0">
      <SearchBar
        setSearchTerm={setSearchTerm}
        placeholder="Search promotions..."
      />
      <Select
        value={
          PROMOTION_CATEGORIES_OPTIONS.find(
            (opt) => opt.key === selectedCategory
          )?.label || null
        }
        onChange={setSelectedCategory}
        options={PROMOTION_CATEGORIES_OPTIONS}
        placeholder="All Categories"
      />
      <Select
        value={selectedStatus}
        onChange={setSelectedStatus}
        options={PROMOTION_STATUS_OPTIONS}
        placeholder="All Status"
      />
    </div>
  );
};
