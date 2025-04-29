// src/components/common/Header.tsx
"use client";

import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";
import { HeaderProps } from "@/types/nav";
import { useNotification } from "@/context/NotificationContext";
import { LoadingModal } from "@/components/common";
import { apiClient } from "@/hooks/dataHooks";
import { PROMOTIONS_API } from "@/constants/api";
import { useState } from "react";

export default function Header({ title, description }: HeaderProps) {
  const router = useRouter();

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
        {title === "Posts" && (
          <div className="relative text-xs">
            <button
              onClick={() =>
                router.push("/posts?mode=create", { scroll: false })
              }
              className="absolute top-1/2 right-1 p-2 rounded-lg hover:bg-gray-200 transition"
            >
              <FaPlus className="text-gray-600" size={14} />
            </button>
          </div>
        )}

        {title === "Promotions" && (
          <div className="relative text-sm">
            <button
              onClick={handleGenerateSuggestions}
              className="absolute top-1/2 right-1 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition"
            >
              Generate Suggestions
            </button>
          </div>
        )}

        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          {title}
        </h1>

        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 whitespace-pre-wrap">
            {description.split("**").map((part, index) =>
              index % 2 === 1 ? (
                <strong key={index} className="text-black dark:text-white">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        )}
      </div>
    </>
  );
}
