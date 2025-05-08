// src/app/(protected)/promotions/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ErrorFallback, LoadingModal } from "@/components/common";
import { useNotification } from "@/context/NotificationContext";
import { Header } from "@/components/common";
import ManagementView from "./management/ManagementView";
import SuggestionsView from "./suggestions/SuggestionsView";

import { apiClient, useFetchData } from "@/hooks/dataHooks";
import { PROMOTIONS_API } from "@/constants/api";
import { Promotion } from "@/types/promotion";
import { PromotionSuggestionsDto } from "@/types/dto";

const PromotionsDashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promotionId = searchParams.get("id");
  const [activeView, setActiveView] = useState<"management" | "suggestions">(
    "management"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (promotionId) {
      setActiveView("management");
    }
  }, [promotionId]);

  const {
    data: promotions,
    error: promotionsError,
    isLoading: isPromotionsLoading,
    mutate: mutatePromotions,
  } = useFetchData<Promotion[]>(PROMOTIONS_API.LIST("management", false));

  const {
    data: suggestionData,
    error: suggestionsError,
    isLoading: isSuggestionsLoading,
    mutate: mutateSuggestions,
  } = useFetchData<PromotionSuggestionsDto>(
    PROMOTIONS_API.LIST("suggestions", false)
  );

  // Show loading UI
  if (
    isPromotionsLoading ||
    isSuggestionsLoading ||
    !promotions ||
    !suggestionData
  ) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Show error UI if there's an error
  if (promotionsError || suggestionsError) {
    const handleRetry = async () => {
      await Promise.all([mutatePromotions(), mutateSuggestions()]);
    };

    return (
      <ErrorFallback
        message="Failed to load promotion data. Please try again later."
        onRetry={handleRetry}
        isProcessing={isPromotionsLoading || isSuggestionsLoading}
      />
    );
  }

  const handleGenerateSuggestions = async () => {
    if (!suggestionData.hasSalesData) {
      showNotification(
        "error",
        "No sales data available to generate suggestions."
      );
      return;
    }

    setIsGenerating(true);
    try {
      await apiClient.post(PROMOTIONS_API.GENERATE, {}, { timeout: 60000 });
      showNotification("success", "Suggestions generated successfully!");
      await mutateSuggestions();
      setActiveView("suggestions");
    } catch (error) {
      console.error(error);
      showNotification(
        "error",
        "Failed to generate suggestions. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewChange = (view: "management" | "suggestions") => {
    setActiveView(view);
    if (promotionId) {
      router.push("/promotions", { scroll: false });
    }
  };

  return (
    <>
      <LoadingModal
        isOpen={isGenerating}
        message={`Generating AI-powered promotion suggestions.\nThis may take a moment...`}
      />
      <Header
        title="Promotions"
        actionButton={{
          label: isGenerating ? "Generating..." : "Generate Suggestions",
          onClick: handleGenerateSuggestions,
          isDisabled: isGenerating || !suggestionData.hasSalesData,
          tooltipContent: !suggestionData.hasSalesData
            ? "You need to upload sales data first."
            : `Our AI reviews your sales trends to find patterns and opportunities.
            It then suggests promotions for both high and low-performing products,
            based on your sales history and business context.`,
        }}
      />
      <div className="max-w-6xl mx-auto p-6">
        {/* Segmented Control */}
        <div className="flex justify-center items-center rounded-lg bg-gray-100 p-1 w-full mb-6">
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
              activeView === "management"
                ? "bg-white shadow-sm text-gray-800"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleViewChange("management")}
          >
            My Promotions
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
              activeView === "suggestions"
                ? "bg-white shadow-sm text-gray-800"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleViewChange("suggestions")}
          >
            Suggestions
          </button>
        </div>

        {/* Content based on active view */}
        {activeView === "management" ? (
          <ManagementView scrollToId={promotionId} promotions={promotions} />
        ) : (
          <SuggestionsView
            hasSalesData={suggestionData.hasSalesData}
            suggestions={suggestionData.suggestions}
          />
        )}
      </div>
    </>
  );
};

export default PromotionsDashboard;
