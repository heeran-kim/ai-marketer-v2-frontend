// src/components/common/Header.tsx
"use client";

import { HeaderProps } from "@/types/nav";
import { useNotification } from "@/context/NotificationContext";
import { LoadingModal } from "@/components/common";
import { apiClient } from "@/hooks/dataHooks";
import { PROMOTIONS_API } from "@/constants/api";
import { useState } from "react";

export default function Header({ title, actionButton }: HeaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleGenerateSuggestions = async () => {
    setIsLoading(true);
    try {
      await apiClient.post(PROMOTIONS_API.GENERATE, {});
      showNotification("success", "Suggestions generated successfully!");
    } catch (error) {
      console.error(error);
      showNotification(
        "error",
        "Failed to generate suggestions. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingModal isOpen={isLoading} message="Generating suggestions..." />
      <div className="border-b border-gray-300 dark:border-gray-700 px-6 py-8">
        {actionButton && (
          <div className="relative text-sm">
            <button
              onClick={actionButton.onClick}
              disabled={actionButton.isLoading}
              className="absolute top-1/2 right-1 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition"
            >
              {actionButton.isLoading ? "Processing..." : actionButton.label}
            </button>
          </div>
        )}

        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          {title}
        </h1>
      </div>
    </>
  );
}
