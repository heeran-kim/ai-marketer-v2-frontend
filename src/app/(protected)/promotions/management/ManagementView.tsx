// src/app/(protected)/promotions/management/ManagementView.tsx

import React, { useState } from "react";

import PromotionCard from "./PromotionCard";
import { PromotionsFilterBar } from "../components/PromotionsFilterBar";

import { ConfirmModal } from "@/components/common";
import { useNotification } from "@/context/NotificationContext";
import { ErrorFallback } from "@/components/common";

import { useFetchData, apiClient } from "@/hooks/dataHooks";
import { useRouter } from "next/navigation";
import { PROMOTIONS_API } from "@/constants/api";
import { Promotion } from "@/types/promotion";

const ManagementView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedPromotionId, setSelectedPromotionId] = useState<string | null>(
    null
  );

  const {
    data: promotions,
    mutate,
    error,
  } = useFetchData<Promotion[]>(PROMOTIONS_API.LIST("management"));
  const router = useRouter();

  // Show loading UI
  if (promotions === undefined) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Show error UI if there's an error
  if (error) {
    const handleRetry = async () => {
      await mutate();
    };

    return (
      <ErrorFallback
        message="Failed to load promotion suggestions data. Please try again later."
        onRetry={handleRetry}
        isProcessing={isLoading}
      />
    );
  }

  // Redirects to post creation with promotion context
  const handleCreatePost = (id: string) => {
    router.push(`/posts?mode=create&promotionId=${id}`, { scroll: false });
  };

  const handleDuplicate = (id: string) => {
    // TODO
    console.log(`Duplicate for promotion ID: ${id}`);
  };

  // Handles promotion deletion with error handling and notification feedback
  const handleDelete = async () => {
    if (!selectedPromotionId) return;
    setIsLoading(true);
    try {
      await apiClient.delete(PROMOTIONS_API.DELETE(selectedPromotionId));
      await mutate();
      showNotification("success", "Promotion deleted successfully!");
    } catch (error) {
      console.error("Error deleting promotion:", error);
      showNotification(
        "error",
        "Failed to delete promotion. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
    setSelectedPromotionId(null);
  };

  // Apply filtering based on category, status, and search term
  const filteredPromotions = promotions.filter((promo: Promotion) => {
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
      {selectedPromotionId && (
        <ConfirmModal
          isOpen={!!selectedPromotionId}
          type="warning"
          title="Delete Promotion"
          message={`Are you sure you want to delete this promotion?
          This will also delete all related posts.`}
          confirmButtonText={isLoading ? "Deleting..." : "Delete"}
          cancelButtonText="Cancel"
          itemId={selectedPromotionId}
          onConfirm={handleDelete}
          onClose={() => setSelectedPromotionId(null)}
        />
      )}

      <PromotionsFilterBar
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      <div className="space-y-4 mt-2">
        {filteredPromotions.map((promo: Promotion) => (
          <PromotionCard
            key={promo.id}
            promotion={promo}
            onCreatePost={() => handleCreatePost(promo.id)}
            onDuplicate={() => handleDuplicate(promo.id)}
            onDelete={() => setSelectedPromotionId(promo.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ManagementView;
