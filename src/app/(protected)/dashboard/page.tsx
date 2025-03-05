// src/app/dashboard/page.tsx
"use client";

import DashboardCard from "./components/DashboardCard";
import EmptyBusinessState from "./components/EmptyBusinessState";
import { useFetchData } from "@/hooks/useApi";
import { DashboardData } from "@/app/types/business";
import { DASHBOARD_API } from "@/constants/api";

export default function Dashboard() {
    const { data, error, isLoading, mutate } = useFetchData<DashboardData>(DASHBOARD_API.GET_ALL);

    const handleRetry = async () => {
        await mutate();
    };
    
    return (
        <div className="max-w-7xl mx-auto p-6">
            {isLoading && (
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">Loading...</p>
                </div>
            )}

            {error && (
                <div className="flex flex-col justify-center items-center h-64 text-red-500">
                    <p>{error}</p>
                    <button onClick={handleRetry} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
                        Retry
                    </button>
                </div>
            )}

            {!isLoading && !error && (
                data?.business ? <DashboardCard dashboardData={data} /> : <EmptyBusinessState />
            )}
        </div>
    );
}