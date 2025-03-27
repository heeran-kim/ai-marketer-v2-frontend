"use client";

import { useState } from "react";
import DragAndDropUploader from "@/components/common/DragAndDropUploader";
import Card from "@/components/common/CompactCard";
import { usePostEditorContext } from "@/context/PostEditorContext";
import { apiClient } from "@/hooks/dataHooks";
import { ImageAnalysisResponse, PostEditorMode } from "@/types/post";
import { AI_API } from "@/constants/api";

export const PostImageSelector = () => {
  const {
    mode,
    uploadedImageUrl,
    image,
    setImage,
    detectedItems,
    setDetectedItems,
  } = usePostEditorContext();
  const isEditing = mode === PostEditorMode.EDIT;
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (file: File | null) => {
    setImage(file);
    setDetectedItems([]);
  };

  const handleAnalyseImage = async () => {
    if (!image) {
      alert("Please upload an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    setIsLoading(true);

    const res = await apiClient.post<ImageAnalysisResponse>(
      AI_API.IMG_ANALYSIS,
      formData,
      {},
      true // isFormData flag
    );

    if (!res?.detectedItems) {
      console.error("❌ No detected items returned from analysis.");
      setDetectedItems([]);
    } else {
      setDetectedItems(res.detectedItems);
    }

    setIsLoading(false);
  };

  const removeDetectedItem = (index: number) => {
    setDetectedItems(detectedItems.filter((_, i) => i !== index));
  };

  return (
    <>
      <Card>
        <DragAndDropUploader
          value={image ? URL.createObjectURL(image) : uploadedImageUrl ?? ""}
          onChange={handleImageChange}
          fileType="image"
        />

        {image && !isEditing && (
          <div className="mt-2">
            <button
              onClick={handleAnalyseImage}
              className="w-full text-sm bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition"
              disabled={isLoading}
            >
              {isLoading ? "Analysing..." : "Analyse Image"}
            </button>
          </div>
        )}
      </Card>

      {detectedItems.length > 0 && (
        <div className="mt-3 p-2 border border-gray-200 rounded-md bg-gray-50 dark:bg-gray-800">
          <p className="text-sm font-medium mb-2">Detected Items:</p>
          <div className="flex flex-wrap gap-2">
            {detectedItems.map((item, index) => (
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
