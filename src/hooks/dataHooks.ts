// src/hooks/useApi.ts
import useSWR, { SWRConfiguration } from "swr";
import apiClient from "@/utils/apiClient";

// SWR fetcher function that uses our API client
const fetcher = async <T>(url: string): Promise<T> => {
  return apiClient.get<T>(url);
};

// Hook for fetching data with SWR and circuit breaker protection
export function useFetchData<T>(url: string | null, config?: SWRConfiguration) {
  const { data, error, isValidating, mutate } = useSWR<T>(url, fetcher, {
    revalidateOnFocus: false, // Disabling re-fetching on window focus for better performance
    shouldRetryOnError: true,
    errorRetryCount: 3,
    errorRetryInterval: 5000,
    suspense: false,
    ...config,
  });

  return {
    data,
    error,
    isLoading: isValidating,
    mutate,
  };
}

// Health check helper
export const checkBackendHealth = async (): Promise<boolean> => {
  return apiClient.checkHealth();
};

// Re-export the API client for direct use
export { apiClient };
