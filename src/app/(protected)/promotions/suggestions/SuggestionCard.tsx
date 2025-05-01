// src/app/(protected)/promotions/suggestions/SuggestionCard.tsx
import React, { useState } from "react";
import { PromotionSuggestion } from "@/types/promotion";
import { CategoryChipList, ConfirmModal } from "@/components/common";
import { FaThumbsDown } from "react-icons/fa";
import { apiClient } from "@/hooks/dataHooks";
import { PROMOTIONS_API } from "@/constants/api";
import { useNotification } from "@/context/NotificationContext";
import { formatLocalDateRange } from "@/utils/date";

interface SuggestionCardProps {
  suggestion: PromotionSuggestion;
  onCreatePromotion: () => void;
  onDismiss: () => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({
  suggestion,
  onCreatePromotion,
  onDismiss,
}) => {
  const { title, description, categories, dataPeriod, isDismissed } =
    suggestion;
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useNotification();

  const handleDismiss = async () => {
    setIsSubmitting(true);
    try {
      await apiClient.post(
        PROMOTIONS_API.DISMISS(suggestion.id),
        { feedback },
        {},
        false
      );
      onDismiss();
    } catch (error) {
      console.error("Error dismissing suggestion:", error);
      showNotification(
        "error",
        "Failed to dismiss suggestion. Please try again"
      );
    } finally {
      setIsSubmitting(false);
      setIsConfirmOpen(false);
    }
  };

  const dateRangeText = dataPeriod
    ? `Based on data from ${formatLocalDateRange(
        dataPeriod.startDate,
        dataPeriod.endDate
      )}`
    : "";

  return (
    <>
      {isConfirmOpen && (
        <ConfirmModal
          isOpen={true}
          title="Dismiss Suggestion"
          message={`Are you sure you want to dismiss this suggestion?
            This will remove it from your suggestions list.`}
          confirmButtonText={isSubmitting ? "Dismissing..." : "Dismiss"}
          cancelButtonText="Cancel"
          type="warning"
          onConfirm={handleDismiss}
          onClose={() => setIsConfirmOpen(false)}
        >
          <div className="mt-2">
            <textarea
              className="w-full p-2 border rounded-md text-sm"
              placeholder="Tell us why you're dismissing this suggestion..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
            />
          </div>
        </ConfirmModal>
      )}

      <div className="bg-white border rounded-lg shadow-sm p-4">
        {/* Title with dismiss button */}
        <div className="flex justify-between items-start mb-3">
          <div className="dark:text-white font-medium mb-3">{title}</div>
          {!isDismissed && (
            <button
              onClick={() => setIsConfirmOpen(true)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Dismiss suggestion"
            >
              <FaThumbsDown size={16} />
            </button>
          )}
        </div>

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

        {/* Data period indicator and Create promotion button */}
        <div className="flex justify-between items-end">
          {dateRangeText && (
            <div className="text-xs text-gray-500 italic">{dateRangeText}</div>
          )}
          {!isDismissed && (
            <button
              className="px-3 py-1 bg-black text-white rounded text-sm hover:bg-gray-800"
              onClick={onCreatePromotion}
            >
              Create Promotion
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default SuggestionCard;
