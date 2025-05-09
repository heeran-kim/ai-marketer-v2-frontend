// src/app/(protected)/promotions/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ManagementView from "./management/ManagementView";
import SuggestionsView from "./suggestions/SuggestionsView";

const PromotionsDashboard = () => {
  const searchParams = useSearchParams();
  const promotionId = searchParams.get("id");

  const [activeView, setActiveView] = useState<"management" | "suggestions">(
    "management"
  );

  useEffect(() => {
    if (promotionId) {
      setActiveView("management");
    }
  }, [promotionId]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Segmented Control */}
      <div className="flex justify-center items-center rounded-lg bg-gray-100 p-1 w-full mb-6">
        <button
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
            activeView === "management"
              ? "bg-white shadow-sm text-gray-800"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveView("management")}
        >
          My Promotions
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
            activeView === "suggestions"
              ? "bg-white shadow-sm text-gray-800"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveView("suggestions")}
        >
          Suggestions
        </button>
      </div>

      {/* Content based on active view */}
      {activeView === "management" ? (
        <ManagementView scrollToId={promotionId} />
      ) : (
        <SuggestionsView />
      )}
    </div>
  );
};

export default PromotionsDashboard;
