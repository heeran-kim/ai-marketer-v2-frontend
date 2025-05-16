"use client";

import { useState, useEffect } from "react";
import { SETTINGS_API } from "@/constants/api";
import { useFetchData, apiClient } from "@/hooks/dataHooks";
import { Card, ErrorFallback } from "@/components/common";
import { SquareStatusDto } from "@/types/dto";
import { squareIcon } from "@/utils/icon";
import { useSearchParams } from "next/navigation";
import { useNotification } from "@/context/NotificationContext";

export default function SquareSettings() {
  const searchParams = useSearchParams();
  const { showNotification } = useNotification();

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [businessName, setBusinessName] = useState<string>("Not connected");
  const [error, setError] = useState<string | null>(null);
  const {
    data,
    isLoading,
    error: fetchingError,
    mutate,
  } = useFetchData<SquareStatusDto>(SETTINGS_API.SQUARE);

  useEffect(() => {
    if (!data) return;
    setError(null);
    const { squareConnected, businessName } = data;
    setIsConnected(squareConnected);
    if (squareConnected) {
      if (businessName) {
        setBusinessName(businessName);
      } else {
        setBusinessName("No business registered");
        setError("You're connected to Square, but no business is registered.");
      }
    } else {
      setBusinessName("Not connected");
    }
  }, [data]);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      if (error === "user_denied") {
        setError(
          "You chose not to connect your Square account. You can try again anytime."
        );
      } else {
        console.error(`${error}: ${searchParams.get("error_description")}`);
        setError("It seems something went wrong. Please try connecting again.");
      }
    } else {
      const success = searchParams.get("success");
      if (success) {
        showNotification("success", "Successfully connected to Square!");
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (window.location.hash === "#_=_") {
      window.history.replaceState({}, "", window.location.href.split("#")[0]);
    }
  }, []);

  if (data === undefined) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (fetchingError) {
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

  const handleConnect = async () => {
    setIsProcessing(true);
    try {
      const response = await apiClient.post<Record<string, string>>(
        SETTINGS_API.SQUARE_CONNECT,
        {}
      );
      window.location.href = response.link;
    } catch (error: unknown) {
      console.error(error);
      setError("Failed to connect. Please try again later.");
    }
  };

  const handleDisconnect = async () => {
    setIsProcessing(true);
    try {
      await apiClient.post(SETTINGS_API.SQUARE_DISCONNECT, {});
      await mutate();
      showNotification("success", "Successfully disconnected from Square!");
    } catch (error) {
      console.error("Error disconnecting from Square:", error);
      setError("Failed to disconnect. Please try again later.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card
        title="Link Your Square Account"
        description="Connect your Square account to enable seamless integration with our platform."
        buttonText={
          isProcessing
            ? "Processing..."
            : isConnected
            ? "Disconnect"
            : "Connect"
        }
        onClick={() => (isConnected ? handleDisconnect() : handleConnect())}
        buttonDisabled={isProcessing}
      >
        <div className="max-w-xs w-full flex items-center border rounded-md overflow-hidden">
          <span className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-200">
            {squareIcon} square.com
          </span>
          <div
            className={`flex-1 text-sm p-2 border-l truncate ${
              businessName === "No business registered" ||
              businessName === "Not connected"
                ? "bg-gray-50 text-gray-400 italic"
                : ""
            }`}
          >
            {businessName}
          </div>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </Card>
    </div>
  );
}
