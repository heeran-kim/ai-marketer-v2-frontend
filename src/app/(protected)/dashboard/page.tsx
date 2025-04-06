// src/app/dashboard/page.tsx
"use client";

import { DashboardContent } from "./components/DashboardContent";
import EmptyBusinessState from "./components/EmptyBusinessState";
import { useFetchData } from "@/hooks/dataHooks";
import { DashboardData } from "@/types/business";
import { DASHBOARD_API } from "@/constants/api";
import { ErrorFallback } from "@/components/common";

export default function Dashboard() {
  // Fetches dashboard data
  const { data, isLoading, error, mutate } = useFetchData<DashboardData>(
    DASHBOARD_API.GET_ALL
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
        message="Failed to load data. Please try again later."
        onRetry={handleRetry}
        isProcessing={isLoading}
      />
    );
  }

  // Determine which component to render based on business data
  const content = data?.business ? (
    <DashboardContent data={data} />
  ) : (
    <EmptyBusinessState />
  );

  return <div className="max-w-7xl mx-auto p-6">{content}</div>;
}
