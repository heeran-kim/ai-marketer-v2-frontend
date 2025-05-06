// src/app/(protected)/promotions/components/PromotionsFilterBar.tsx
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
  selectedStatus?: string | null;
  setSelectedStatus?: (value: string | null) => void;
}

export const PromotionsFilterBar = ({
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
}: Props) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full mb-4">
      <div className="w-full sm:flex-1">
        <SearchBar
          setSearchTerm={setSearchTerm}
          placeholder="Search promotions..."
        />
      </div>
      <div className="flex flex-row gap-2 w-full sm:w-auto">
        <div className="w-full sm:flex-1">
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
        </div>
        {selectedStatus !== undefined && setSelectedStatus !== undefined && (
          <div className="w-full sm:flex-1">
            <Select
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={PROMOTION_STATUS_OPTIONS}
              placeholder="All Status"
            />
          </div>
        )}
      </div>
    </div>
  );
};
