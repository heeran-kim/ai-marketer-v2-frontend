// src/utils/apiClient.ts
import backendCircuitBreaker from "./circuitBreaker";
import { HEALTH_CHECK_API } from "@/constants/api";

// Converts snake_case to camelCase (for API responses)
export const toCamelCase = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase) as T;
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
        letter.toUpperCase()
      );
      (acc as Record<string, unknown>)[camelKey] = toCamelCase(
        (obj as Record<string, unknown>)[key]
      );
      return acc;
    }, {} as T);
  }
  return obj;
};

// Converts camelCase to snake_case (for API requests)
export const toSnakeCase = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase) as T;
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
      (acc as Record<string, unknown>)[snakeKey] = toSnakeCase(
        (obj as Record<string, unknown>)[key]
      );
      return acc;
    }, {} as T);
  }
  return obj;
};

// Converts camelCase to snake_case for FormData keys (for API requests)
export const toSnakeCaseForFormData = (formData: FormData): FormData => {
  const newFormData = new FormData();

  // Loop through FormData entries and convert keys to snake_case
  formData.forEach((value, key) => {
    // Convert the key to snake_case
    const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();

    // Append the value to newFormData with the converted snake_case key
    newFormData.append(snakeKey, value);
  });

  return newFormData;
};

interface FetchOptions extends RequestInit {
  timeout?: number;
}

interface ApiClientOptions {
  defaultHeaders?: HeadersInit;
  timeout?: number;
}

class ApiClient {
  private defaultHeaders: HeadersInit;
  private defaultTimeout: number;

  constructor(options: ApiClientOptions = {}) {
    this.defaultHeaders = options.defaultHeaders || {
      "Content-Type": "application/json",
    };
    this.defaultTimeout = options.timeout || 10000; // 10 seconds default
  }

  async get<T>(url: string, options: FetchOptions = {}): Promise<T> {
    return this.request<T>(url, {
      method: "GET",
      ...options,
    });
  }

  async post<T>(
    url: string,
    data: Record<string, unknown> | FormData,
    options: FetchOptions = {},
    isFormData = false
  ): Promise<T> {
    return this.request<T>(url, {
      method: "POST",
      headers: isFormData ? {} : { "Content-Type": "application/json" },
      body: isFormData
        ? toSnakeCaseForFormData(data as FormData)
        : JSON.stringify(toSnakeCase(data as Record<string, unknown>)),
      ...options,
    });
  }

  async put<T>(
    url: string,
    data: Record<string, unknown> | FormData,
    options: FetchOptions = {},
    isFormData = false
  ): Promise<T> {
    return this.request<T>(url, {
      method: "PUT",
      headers: isFormData ? {} : { "Content-Type": "application/json" },
      body: isFormData
        ? toSnakeCaseForFormData(data as FormData)
        : JSON.stringify(toSnakeCase(data as Record<string, unknown>)),
      ...options,
    });
  }

  async patch<T>(
    url: string,
    data: Record<string, unknown> | FormData,
    options: FetchOptions = {},
    isFormData = false
  ): Promise<T> {
    return this.request<T>(url, {
      method: "PATCH",
      headers: isFormData ? {} : { "Content-Type": "application/json" },
      body: isFormData
        ? toSnakeCaseForFormData(data as FormData)
        : JSON.stringify(toSnakeCase(data as Record<string, unknown>)),
      ...options,
    });
  }

  async delete<T>(url: string, options: FetchOptions = {}): Promise<T> {
    return this.request<T>(url, {
      method: "DELETE",
      ...options,
    });
  }

  private async request<T>(
    url: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { timeout = this.defaultTimeout, ...restOptions } = options;
    const fetchOptions: RequestInit = {
      ...restOptions,
      headers:
        options.body instanceof FormData
          ? undefined
          : {
              ...this.defaultHeaders,
              ...options.headers,
            },
      credentials: "include",
    };
    // Use circuit breaker to wrap the fetch call
    return backendCircuitBreaker.execute<T>(async () => {
      try {
        const response = await fetch(url, fetchOptions);

        // Handle HTTP error status codes
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            JSON.stringify({
              status: response.status,
              statusText: response.statusText,
              data: errorData,
            })
          );
        }

        // Handle different response types
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          const jsonData = await response.json();
          return toCamelCase(jsonData);
        } else if (contentType?.includes("text/")) {
          return (await response.text()) as unknown as T;
        } else {
          return (await response.blob()) as unknown as T;
        }
      } catch (error) {
        console.error(`API request failed for ${url}:`, error);
        throw error;
      }
    }, timeout);
  }

  // Health check method to test backend connectivity
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(HEALTH_CHECK_API, {
        method: "GET",
        headers: this.defaultHeaders,
        credentials: "include",
        // Short timeout for health checks
        signal: AbortSignal.timeout(3000),
      });
      return response.ok;
    } catch (error) {
      console.warn("Health check failed:", error);
      return false;
    }
  }
}

// Create a singleton instance - no baseUrl needed
const apiClient = new ApiClient({
  timeout: 10000,
});

export default apiClient;
