// src/app/(protected)/promotions/page.tsx
"use client";

import { useState } from "react";
import { useFetchData } from "@/hooks/dataHooks";
import { Promotion } from "@/types/promotion";
import { PROMOTIONS_API } from "@/constants/api";
import PromotionCard from "@/app/(protected)/promotions/components/PromotionCard";
import { PromotionsFilterBar } from "./components/PromotionsFilterBar";
import { useRouter } from "next/navigation";

export default function PromotionsDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const router = useRouter();

  const { data } = useFetchData<{ promotions: Promotion[] }>(
    PROMOTIONS_API.LIST
  );
  const promotions = data?.promotions || [];

  const handleCreatePost = (promotionId: string) => {
    router.push(`/posts?mode=create&promotionId=${promotionId}`);
  };

  const handleDuplicate = (promotionId: string) => {
    console.log(`Duplicate for promotion ID: ${promotionId}`);
  };

  const handleDelete = (promotionId: string) => {
    console.log(`Delete promotion ID: ${promotionId}`);
  };

  // Apply filtering based on category, status, and search term
  const filteredPromotions = promotions.filter((promo) => {
    const categoryMatch =
      !selectedCategory ||
      promo.categories.some((cat) => cat.key === selectedCategory);
    const statusMatch =
      !selectedStatus ||
      promo.status.toLowerCase() === selectedStatus.toLowerCase();
    const searchMatch =
      !searchTerm ||
      promo.description.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && statusMatch && searchMatch;
  });

  return (
    <div>
      <PromotionsFilterBar
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      <div className="space-y-4 mt-2">
        {filteredPromotions.map((promo) => (
          <PromotionCard
            key={promo.id}
            promotion={promo}
            onCreatePost={() => handleCreatePost(promo.id)}
            onDuplicate={() => handleDuplicate(promo.id)}
            onDelete={() => handleDelete(promo.id)}
          />
        ))}
      </div>
    </div>
  );
}
