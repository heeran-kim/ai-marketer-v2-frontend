"use client";

import { useEffect, useRef } from "react";
import DragAndDropUploader from "@/components/common/DragAndDropUploader";
import { CompactCard } from "@/components/common";
import { usePostEditorContext } from "@/context/PostEditorContext";

export const PostImageSelector = () => {
  const {
    uploadedImageUrl,
    captionGenerationInfo,
    setCaptionGenerationInfo,
    setAspectRatio,
  } = usePostEditorContext();

  const captionInfoRef = useRef(captionGenerationInfo);

  useEffect(() => {
    captionInfoRef.current = captionGenerationInfo;
  }, [captionGenerationInfo]);

  const handleImageChange = (
    file: File | null,
    previewUrl: string | null,
    aspectRatio: string | "4/5"
  ) => {
    if (!file && previewUrl === "keep") {
      setAspectRatio(aspectRatio);
      return;
    }
    setCaptionGenerationInfo({
      ...captionGenerationInfo,
      image: file,
    });
  };

  return (
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
    </CompactCard>
  );
};
