// src/components/common/ErrorFallback.tsx
import React from "react";

interface ErrorFallbackProps {
  message: string;
  onRetry: () => void | Promise<void>;
  isProcessing?: boolean;
}

/**
 * A reusable error fallback component for displaying error messages with retry functionality
 */
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  message,
  onRetry,
  isProcessing = false,
}) => {
  return (
    <div className="flex flex-col justify-center items-center text-center h-64 text-red-500">
      <p>{message}</p>
      <button
        onClick={onRetry}
        disabled={isProcessing}
        className={`mt-4 px-4 py-2 rounded transition-colors 
                    ${
                      isProcessing
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }
                `}
      >
        {isProcessing ? "Processing..." : "Retry"}
      </button>
    </div>
  );
};
