// src/app/(protected)/settings/social.tsx
"use client";

import { useState } from "react";
import { SETTINGS_API } from "@/constants/api";
import { useFetchData, apiClient } from "@/hooks/dataHooks";
import { Platform } from "@/types/business";
import { Card, ErrorFallback } from "@/components/common";
import { PLATFORM_OPTIONS, getPlatformIcon } from "@/utils/icon";

export default function SocialMediaSettings() {
  // Tracks which platform is currently being processed (connect/disconnect in progress)
  const [processingPlatform, setProcessingPlatform] = useState<string | null>(
    null
  );

  // Fetches linked social accounts data
  const {
    data: linkedPlatforms,
    isLoading,
    error,
    mutate,
  } = useFetchData<Platform[]>(SETTINGS_API.GET_SOCIAL);

  // Handle loading state for the initial data fetch from useFetchData
  if (linkedPlatforms === undefined) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Handle error state for the initial data fetch from useFetchData
  // This doesn't cover errors from connect/disconnect operations
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

  // Connect to a social platform
  const handleConnect = async (provider: string) => {
    setProcessingPlatform(provider);
    // Make API call to start OAuth flow
    // TODO: Error handling, set redirect url
    try{
      const response = await apiClient.post<Record<string,string>>(SETTINGS_API.CONNECT_SOCIAL(provider), {});
      window.location.href = response.link;
    }
    catch(error:unknown)
    {
      console.log(error);
    }
  };

  // Disconnect from a social platform
  const handleDisconnect = async (provider: string) => {
    setProcessingPlatform(provider);
    // Make API call to disconnect
    // TODO: Error handling
    await apiClient.delete(SETTINGS_API.DISCONNECT_SOCIAL(provider));
    // Refresh the data to show updated connection status
    mutate();
    setProcessingPlatform(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {PLATFORM_OPTIONS.map((key: string) => {
        const linkedPlatform = linkedPlatforms.find(
          (platform) => platform.key === key
        );
        const isProcessing = processingPlatform === key;
        const accountName = linkedPlatform
          ? linkedPlatform.username
          : "Not connected";
        const buttonText = linkedPlatform ? "Disconnect" : "Connect";
        const description = linkedPlatform
          ? `Connected as ${accountName}. Click "Disconnect" to unlink.`
          : `Click "Connect" to link your ${key} account.`;

        return (
          <Card
            key={key}
            title={
              linkedPlatform?.label ||
              key.charAt(0).toUpperCase() + key.slice(1)
            }
            description={description}
            buttonText={isProcessing ? "Processing..." : buttonText}
            onClick={() =>
              linkedPlatform ? handleDisconnect(key) : handleConnect(key)
            }
            buttonDisabled={isProcessing}
          >
            <div className="max-w-xs w-full flex items-center border rounded-md overflow-hidden">
              <span className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-200">
                {getPlatformIcon(key, "w-5 h-5")}
                {`${key}.com/`}
              </span>
              <div
                className={`flex-1 text-sm p-2 border-l truncate ${
                  linkedPlatform ? "" : "bg-gray-50 text-gray-400 italic"
                }`}
                title={accountName}
              >
                {accountName}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
