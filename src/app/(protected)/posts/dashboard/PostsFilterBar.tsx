// src/app/(protected)/posts/dashboard/PostsFilterBar.tsx
"use client";

import { Select, SearchBar } from "@/components/common";
import { PLATFORM_OPTIONS_WITH_LABEL } from "@/utils/icon";
import { POST_STATUS_OPTIONS } from "@/constants/posts";

interface Props {
  setSearchTerm: (value: string) => void;
  selectedPlatform: string | null;
  setSelectedPlatform: (value: string | null) => void;
  selectedStatus: string | null;
  setSelectedStatus: (value: string | null) => void;
}

export const PostsFilterBar = ({
  setSearchTerm,
  selectedPlatform,
  setSelectedPlatform,
  selectedStatus,
  setSelectedStatus,
}: Props) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full mb-4">
      <div className="w-full sm:flex-1">
        <SearchBar
          setSearchTerm={setSearchTerm}
          placeholder="Search posts..."
        />
      </div>
      <div className="flex flex-row gap-2 w-full sm:w-auto">
        <div className="w-full sm:flex-1">
          <Select
            value={
              PLATFORM_OPTIONS_WITH_LABEL.find(
                (opt) => opt.key === selectedPlatform
              )?.label || null
            }
            onChange={setSelectedPlatform}
            options={PLATFORM_OPTIONS_WITH_LABEL}
            placeholder="All Platforms"
          />
        </div>
        <div className="w-full sm:flex-1">
          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={POST_STATUS_OPTIONS}
            placeholder="All Status"
          />
        </div>
      </div>
    </div>
  );
};
