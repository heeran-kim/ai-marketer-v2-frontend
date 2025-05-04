// src/app/(protected)/promotions/sugesstions/SuggestionsView.tsx
import React, { useState } from "react";

import SuggestionCard from "./SuggestionCard";
import { PromotionsFilterBar } from "../components/PromotionsFilterBar";

import { useNotification } from "@/context/NotificationContext";
import { DateRangeModal, LoadingModal, Card } from "@/components/common";

import { apiClient } from "@/hooks/dataHooks";
import { useRouter } from "next/navigation";
import { PROMOTIONS_API } from "@/constants/api";

import { Promotion, PromotionSuggestion } from "@/types/promotion";
import { mutate } from "swr";

interface SuggestionsViewProps {
  hasSalesData: boolean;
  suggestions: PromotionSuggestion[];
}

const SuggestionsView = ({
  hasSalesData,
  suggestions,
}: SuggestionsViewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [createId, setCreateId] = useState<string | null>(null);

  const router = useRouter();

  const handleCreate = async (startDate: string, endDate: string | null) => {
    const suggestion = suggestions.find(
      (suggestion) => suggestion.id === createId
    );
    if (!suggestion) {
      console.error("Something wrong with promotion suggestion data");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post<Promotion>(
        PROMOTIONS_API.CREATE,
        {
          categoryIds: suggestion.categories.map((cat) => cat.id),
          description: suggestion.title + ": " + suggestion.description,
          startDate,
          endDate,
          suggestionId: suggestion.id,
        },
        {},
        false
      );
      await mutate(PROMOTIONS_API.LIST);
      showNotification("success", "Promotion created successfully!");
      setCreateId(null);
      router.push(`/promotions?id=${response.id}`);
    } catch (error) {
      console.error("Error creating promotion:", error);
      showNotification(
        "error",
        "Failed to create promotion. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = async () => {
    await mutate(PROMOTIONS_API.LIST);
    showNotification("success", "Suggestion dismissed successfully.");
  };

  // Apply filtering based on category and search term
  const filteredSuggestions = suggestions.filter(
    (suggestion: PromotionSuggestion) => {
      const categoryMatch =
        !selectedCategory ||
        suggestion.categories.some((cat) => cat.key === selectedCategory);
      const searchMatch =
        !searchTerm ||
        suggestion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        suggestion.description.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && searchMatch;
    }
  );

  return (
    <div>
      <LoadingModal isOpen={isLoading} message="Generating promotion..." />

      {createId && (
        <DateRangeModal
          isOpen={true}
          onClose={() => {
            setCreateId(null);
          }}
          onSubmit={handleCreate}
          title="Select Promotion Date Range"
        />
      )}

      <PromotionsFilterBar
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="space-y-4 mt-2">
        {!hasSalesData && (
          <Card showButton={false}>
            <div className="text-center py-8 text-sm">
              <p className="text-gray-600 mb-6 whitespace-pre-line">
                {`No sales data available.
                Please connect Square or upload a file first
                to generate promotion suggestions.`}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition flex items-center"
                  onClick={() => router.push("/settings/square")}
                >
                  Connect Square
                </button>
                <button
                  className="px-4 py-2 bg-white text-black border border-black rounded-md hover:bg-gray-100 transition flex items-center"
                  onClick={() => router.push("/settings/sales")}
                >
                  Upload CSV File
                </button>
              </div>
            </div>
          </Card>
        )}

        {hasSalesData && suggestions.length === 0 && (
          <Card showButton={false}>
            <div className="text-center py-8 text-sm">
              <p className="text-gray-600 mb-6 whitespace-pre-line">
                {`You haven't generated any suggestions yet.\nClick the 'Generate Suggestions' button above \nto let AI analyse your data and suggest promotions.`}
              </p>
            </div>
          </Card>
        )}

        {suggestions.length > 0 && filteredSuggestions?.length === 0 && (
          <Card showButton={false}>
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                No promotion suggestions found. Try adjusting your filters.
              </p>
            </div>
          </Card>
        )}

        {filteredSuggestions?.map((suggestion: PromotionSuggestion) => (
          <div
            key={suggestion.id}
            className={suggestion.isDismissed ? "opacity-60" : ""}
          >
            {suggestion.isDismissed && (
              <div className="text-xs text-gray-500 mb-1 italic">Dismissed</div>
            )}
            <SuggestionCard
              suggestion={suggestion}
              onCreatePromotion={() => setCreateId(suggestion.id)}
              onDismiss={handleDismiss}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionsView;
