// src/app/(protected)/promotions/management/ManagementView.tsx
import React, { useState, useEffect, useRef } from "react";

import PromotionCard from "./PromotionCard";
import { PromotionsFilterBar } from "../components/PromotionsFilterBar";

import { useNotification } from "@/context/NotificationContext";
import { Card, ConfirmModal, DateRangeModal } from "@/components/common";

import { apiClient } from "@/hooks/dataHooks";
import { useRouter } from "next/navigation";
import { PROMOTIONS_API } from "@/constants/api";
import { Promotion } from "@/types/promotion";
import { mutate } from "swr";

interface ManagementViewProps {
  promotions: Promotion[];
  scrollToId: string | null;
}

const ManagementView = ({ promotions, scrollToId }: ManagementViewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();
  const promotionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const [editId, setEditId] = useState<string | null>(null);
  const [duplicateId, setDuplicateId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const router = useRouter();

  // Auto-scroll to selected post when navigating from external links
  useEffect(() => {
    if (scrollToId && promotions && promotionRefs.current[scrollToId]) {
      promotionRefs.current[scrollToId]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [scrollToId, promotions]);

  // Redirects to post creation with promotion context
  const handleCreatePost = (id: string) => {
    const params = new URLSearchParams();
    params.append("mode", "create");
    params.append("promotionId", id);

    router.push(`/posts?${params.toString()}`, { scroll: false });
  };

  const handleEdit = async (startDate: string, endDate: string | null) => {
    const promo = promotions.find((promo) => promo.id === editId);
    if (!promo) {
      console.error("Something wrong with promotion data");
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.patch(
        PROMOTIONS_API.UPDATE(promo.id),
        {
          startDate,
          endDate,
        },
        {},
        false
      );
      await mutate(PROMOTIONS_API.LIST);
      showNotification("success", "The promotion was successfully edited!");
      setEditId(null);
    } catch (error) {
      console.error("Error editing promotion:", error);
      showNotification("error", "Failed to edit promotion. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicate = async (startDate: string, endDate: string | null) => {
    const promo = promotions.find((promo) => promo.id === duplicateId);
    if (!promo) {
      console.error("Something wrong with promotion data");
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post(
        PROMOTIONS_API.CREATE,
        {
          categoryIds: promo.categories.map((cat) => cat.id),
          description: promo.description,
          startDate,
          endDate,
        },
        {},
        false
      );
      await mutate(PROMOTIONS_API.LIST);
      showNotification("success", "The promotion was successfully duplicated!");
      setDuplicateId(null);
    } catch (error) {
      console.error("Error duplicating promotion:", error);
      showNotification(
        "error",
        "Failed to duplicate promotion. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handles promotion deletion with error handling and notification feedback
  const handleDelete = async () => {
    if (!deleteId) return;
    setIsLoading(true);
    try {
      await apiClient.delete(PROMOTIONS_API.DELETE(deleteId));
      await mutate(PROMOTIONS_API.LIST);
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
    setDeleteId(null);
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
      {(duplicateId || editId) && (
        <DateRangeModal
          isOpen={true}
          initialStart={
            editId
              ? promotions.find((promo) => promo.id === editId)?.startDate
              : undefined
          }
          initialEnd={
            editId
              ? promotions.find((promo) => promo.id === editId)?.endDate
              : undefined
          }
          onClose={() => {
            setDuplicateId(null);
            setEditId(null);
          }}
          onSubmit={duplicateId ? handleDuplicate : handleEdit}
          title="Select Promotion Date Range"
        />
      )}
      {deleteId && (
        <ConfirmModal
          isOpen={true}
          type="warning"
          title="Delete Promotion"
          message={`Are you sure you want to delete this promotion?
          This will also delete all related posts.`}
          confirmButtonText={isLoading ? "Deleting..." : "Delete"}
          cancelButtonText="Cancel"
          itemId={deleteId}
          onConfirm={handleDelete}
          onClose={() => setDeleteId(null)}
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
        {filteredPromotions.length === 0 && (
          <Card showButton={false}>
            <div className="text-center py-8 text-sm">
              <p className="text-gray-600 mb-6 whitespace-pre-line">
                {`No promotions yet.\nCheck out the Suggestions Tab to get AI-powered ideas\nand create your first promotion!`}
              </p>
            </div>
          </Card>
        )}

        {filteredPromotions.map((promo: Promotion) => (
          <div
            key={promo.id}
            ref={(el) => {
              promotionRefs.current[promo.id] = el;
            }}
          >
            <PromotionCard
              key={promo.id}
              promotion={promo}
              onCreatePost={() => handleCreatePost(promo.id)}
              onEdit={() => setEditId(promo.id)}
              onDuplicate={() => setDuplicateId(promo.id)}
              onDelete={() => setDeleteId(promo.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagementView;
