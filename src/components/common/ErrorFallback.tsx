// src/components/common/ErrorFallback.tsx
import React, { useEffect, useState } from "react";
import backendCircuitBreaker, { CircuitState } from "@/utils/circuitBreaker";

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
  const [remainingBlockTime, setRemainingBlockTime] = useState<number>(0);
  const [circuitState, setCircuitState] = useState<CircuitState>(
    backendCircuitBreaker.getState()
  );

  useEffect(() => {
    const updateRemainingBlockTime = () => {
      if (backendCircuitBreaker.getState() === CircuitState.OPEN) {
        setRemainingBlockTime(
          Math.ceil(backendCircuitBreaker.getRemainingBlockTime() / 1000)
        );
      } else {
        setRemainingBlockTime(0);
      }
    };

    updateRemainingBlockTime();

    const interval = setInterval(() => {
      updateRemainingBlockTime();
    }, 1000);

    return () => clearInterval(interval);
  }, [circuitState]);

  useEffect(() => {
    const handleStateChange = () => {
      const newState = backendCircuitBreaker.getState();
      setCircuitState(newState);
    };

    const interval = setInterval(() => {
      handleStateChange();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const isButtonDisabled = isProcessing || remainingBlockTime > 0;

  return (
    <div className="flex flex-col justify-center items-center text-center h-64 text-red-500">
      {remainingBlockTime > 0 ? (
        <p className="whitespace-pre-line">
          {remainingBlockTime > 0 &&
            `Our system is temporarily unavailable.
            We'll automatically retry in ${remainingBlockTime} seconds.`}
        </p>
      ) : (
        <>
          <p>{message}</p>
          <button
            onClick={onRetry}
            disabled={isButtonDisabled}
            className={`mt-4 px-4 py-2 rounded transition-colors 
                    ${
                      isButtonDisabled
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }
                `}
          >
            {isProcessing ? "Processing..." : "Retry"}
          </button>
        </>
      )}
    </div>
  );
};
