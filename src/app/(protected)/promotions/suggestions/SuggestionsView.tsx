// src/app/(protected)/promotions/sugesstions/SuggestionsView.tsx

import React, { useState } from "react";

import SuggestionCard from "./SuggestionCard";
import { PromotionsFilterBar } from "../components/PromotionsFilterBar";

import { useNotification } from "@/context/NotificationContext";
import { DateRangeModal, ErrorFallback, Card } from "@/components/common";

import { apiClient, useFetchData } from "@/hooks/dataHooks";
import { useRouter } from "next/navigation";
import { PROMOTIONS_API } from "@/constants/api";

import { Promotion, PromotionSuggestion } from "@/types/promotion";
import { PromotionSuggestionsDto } from "@/types/dto";

const SuggestionsView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [createId, setCreateId] = useState<string | null>(null);

  const router = useRouter();

  const { data, mutate, error } = useFetchData<PromotionSuggestionsDto>(
    PROMOTIONS_API.LIST("suggestions")
  );

  // Show loading UI
  if (data === undefined) {
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

  const { hasSalesData, suggestions } = data;

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
        },
        {},
        false
      );
      await mutate();
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
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            onCreatePromotion={() => setCreateId(suggestion.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SuggestionsView;
