"use client";

import { useState, useEffect, useRef } from "react";
import DragAndDropUploader from "@/components/common/DragAndDropUploader";
import { CompactCard } from "@/components/common";
import { usePostEditorContext } from "@/context/PostEditorContext";
import { apiClient } from "@/hooks/dataHooks";
import { ImageAnalysisResponse } from "@/types/post";
import { AI_API } from "@/constants/api";

export const PostImageSelector = () => {
  const {
    uploadedImageUrl,
    captionGenerationInfo,
    setCaptionGenerationInfo,
    captionGenerationSettings,
  } = usePostEditorContext();

  const [isLoading, setIsLoading] = useState(false);
  const captionInfoRef = useRef(captionGenerationInfo);

  useEffect(() => {
    captionInfoRef.current = captionGenerationInfo;
  }, [captionGenerationInfo]);

  useEffect(() => {
    setCaptionGenerationInfo({
      ...captionInfoRef.current,
      detectedItems: [],
    });
  }, [captionGenerationSettings, setCaptionGenerationInfo]);

  const handleImageChange = (file: File | null) => {
    setCaptionGenerationInfo({
      ...captionGenerationInfo,
      image: file,
      detectedItems: [],
    });
  };

  const handleAnalyseImage = async () => {
    if (!captionGenerationInfo.image) {
      alert("Please upload an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", captionGenerationInfo.image);

    setIsLoading(true);

    try {
      const res = await apiClient.post<ImageAnalysisResponse>(
        AI_API.IMG_ANALYSIS,
        formData,
        {},
        true // isFormData flag
      );

      setCaptionGenerationInfo({
        ...captionGenerationInfo,
        detectedItems: res?.detectedItems || [],
      });
    } catch (error) {
      console.error("Error analyzing image:", error);
      setCaptionGenerationInfo({
        ...captionGenerationInfo,
        detectedItems: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeDetectedItem = (index: number) => {
    setCaptionGenerationInfo({
      ...captionGenerationInfo,
      detectedItems: captionGenerationInfo.detectedItems.filter(
        (_, i) => i !== index
      ),
    });
  };

  const addDetectedItem = () => {
    const newItem = prompt("Enter a new item to add:");
    if (newItem && newItem.trim()) {
      setCaptionGenerationInfo({
        ...captionGenerationInfo,
        detectedItems: [...captionGenerationInfo.detectedItems, newItem.trim()],
      });
    }
  };

  return (
    <>
      <CompactCard>
        <DragAndDropUploader
          value={
            captionGenerationInfo.image
              ? URL.createObjectURL(captionGenerationInfo.image)
              : uploadedImageUrl ?? ""
          }
          onChange={handleImageChange}
          fileType="image"
        />

        {captionGenerationSettings.enableImageAnalysis &&
          captionGenerationInfo.image && (
            <button
              onClick={handleAnalyseImage}
              className="w-full text-sm bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition"
              disabled={isLoading}
            >
              {isLoading ? "Analysing..." : "Analyse Image"}
            </button>
          )}
      </CompactCard>

      {captionGenerationInfo.detectedItems.length > 0 && (
        <div className="mt-3 p-4 border border-gray-200 rounded-md bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Detected Items:</p>
            <button
              onClick={addDetectedItem}
              className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-md transition"
            >
              + Add Item
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {captionGenerationInfo.detectedItems.map((item, index) => (
              <div
                key={index}
                className="relative px-3 py-1 bg-gray-200 text-sm rounded-md group"
              >
                {item}
                <button
                  onClick={() => removeDetectedItem(index)}
                  className="absolute -top-2 -right-2 bg-black text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
