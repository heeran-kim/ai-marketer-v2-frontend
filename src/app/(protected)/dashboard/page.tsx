// src/app/dashboard/page.tsx
"use client";

import { DashboardContent } from "./components/DashboardContent";
import EmptyBusinessState from "./components/EmptyBusinessState";
import { useFetchData } from "@/hooks/dataHooks";
import { DashboardData } from "@/types/business";
import { DASHBOARD_API } from "@/constants/api";

export default function Dashboard() {
  // Fetches dashboard data
  const { data, error, mutate } = useFetchData<DashboardData>(
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
    console.error("Error occurred while loading data:", error);

    return (
      <div className="flex flex-col justify-center items-center h-64 text-red-500">
        <p>Failed to load data. Please try again later.</p>
        <button
          onClick={() => mutate()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Retry
        </button>
      </div>
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
