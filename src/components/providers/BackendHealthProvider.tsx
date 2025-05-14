// src/components/providers/BackendHealthProvider.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { checkBackendHealth } from "@/hooks/dataHooks";

/**
 * Context for backend health tracking
 * Provides application-wide access to backend health status
 */
interface BackendHealthContextType {
  isBackendHealthy: boolean; // Current health status
  checkHealth: () => Promise<void>; // Trigger manual health check
  lastChecked: Date | null; // Timestamp of last check
}

// Default context values
const BackendHealthContext = createContext<BackendHealthContextType>({
  isBackendHealthy: true,
  checkHealth: async () => {},
  lastChecked: null,
});

// Hook for consuming the health context
export const useBackendHealth = () => useContext(BackendHealthContext);

interface BackendHealthProviderProps {
  children: React.ReactNode;
  checkInterval?: number; // How often to check backend (ms)
  initialCheck?: boolean; // Whether to check immediately on mount
}

/**
 * BackendHealthProvider Component
 *
 * Monitors backend health status and provides a fallback UI
 * when backend is down. Works alongside the circuit breaker
 * for complete error handling.
 *
 * Benefits:
 * - Shows a user-friendly error page instead of multiple errors
 * - Periodically checks if backend has recovered
 * - Provides app-wide health status via context API
 */
export function BackendHealthProvider({
  children,
  checkInterval = 60000, // Check every minute by default
  initialCheck = true,
}: BackendHealthProviderProps) {
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean>(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  /**
   * Check backend health and update state
   * Called on initial render and periodically
   */
  const checkHealth = async () => {
    const isHealthy = await checkBackendHealth();
    setIsBackendHealthy(isHealthy);
    setLastChecked(new Date());
  };

  useEffect(() => {
    // Initial health check on component mount
    if (initialCheck) {
      checkHealth();
    }

    // Set up interval for periodic health checks
    const intervalId = setInterval(checkHealth, checkInterval);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [checkInterval, initialCheck]);

  return (
    <BackendHealthContext.Provider
      value={{
        isBackendHealthy,
        checkHealth,
        lastChecked,
      }}
    >
      {/* Show children if backend is healthy, fallback UI if unhealthy */}
      {isBackendHealthy ? (
        children
      ) : (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
          <div className="max-w-lg text-center p-8">
            <h1 className="text-2xl font-bold mb-4">
              Service Temporarily Unavailable
            </h1>
            <p className="mb-6">
              We&apos;re experiencing technical difficulties connecting to our
              servers. Our team has been notified and is working on a solution.
            </p>
            <button
              onClick={() => checkHealth()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}
    </BackendHealthContext.Provider>
  );
}
