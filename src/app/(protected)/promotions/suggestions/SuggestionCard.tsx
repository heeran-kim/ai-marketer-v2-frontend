// src/app/(protected)/promotions/suggestions/SuggestionCard.tsx
import { useState } from "react";
import { PromotionSuggestion } from "@/types/promotion";
import {
  CategoryChipList,
  ConfirmModal,
  ProductChipList,
  NewProductChipList,
  InfoTooltip,
} from "@/components/common";
import { actionIcons } from "@/utils/icon";
import { apiClient } from "@/hooks/dataHooks";
import { PROMOTIONS_API } from "@/constants/api";
import { useNotification } from "@/context/NotificationContext";
import { formatLocalDateRange } from "@/utils/date";
import { PromotionCategoryKey } from "@/constants/promotions";

const CATEGORY_DESCRIPTIONS: Record<PromotionCategoryKey, string> = {
  discount:
    "Offers price reductions to drive immediate sales and attract price-sensitive customers.",
  bundle:
    "Combines multiple products for a better value, increasing average order size.",
  trend: "Promotions based on current market trends and popular items.",
  menu: "Focuses on introducing or highlighting menu items.",
  social: "Designed specifically for social media engagement and reach.",
};

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
  const {
    title,
    description,
    categories,
    dataPeriod,
    isDismissed,
    products,
    productNames,
  } = suggestion;
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
    ? `Based on data from
    ${formatLocalDateRange(dataPeriod.startDate, dataPeriod.endDate)}`
    : "";

  const hasProductCategoryInfo = products && products.length > 0;

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
          <div className="font-medium mb-2">{title}</div>
          {!isDismissed && (
            <button
              onClick={() => setIsConfirmOpen(true)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Dismiss suggestion"
            >
              {actionIcons.dismiss}
            </button>
          )}
        </div>

        {/* Category chips with tooltip */}
        {categories.length > 0 && (
          <div className="mb-3 flex items-center gap-2">
            <CategoryChipList labels={categories.map((cat) => cat.label)} />
            <InfoTooltip
              content={
                "Categories indicate the type of promotion strategy.\n\n" +
                categories
                  .map(
                    (cat) =>
                      `${cat.label}: ${CATEGORY_DESCRIPTIONS[cat.key] || ""}`
                  )
                  .join("\n")
              }
            />
          </div>
        )}

        {/* Product names with category indication */}
        <div className="mb-3">
          {hasProductCategoryInfo ? (
            <NewProductChipList products={products} />
          ) : productNames && productNames.length > 0 ? (
            <ProductChipList productNames={productNames} />
          ) : null}
        </div>

        {/* Description */}
        <div className="text-sm text-gray-700 mb-3 whitespace-pre-line">
          {description}
        </div>

        {/* Data period indicator and Create promotion button */}
        <div className="flex justify-between items-end">
          {dateRangeText && (
            <div className="text-xs text-gray-500 italic whitespace-pre-line">
              {dateRangeText}
            </div>
          )}
          {!isDismissed && (
            <button
              className="px-3 py-1 bg-black text-white rounded text-sm hover:bg-gray-800 whitespace-nowrap"
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
