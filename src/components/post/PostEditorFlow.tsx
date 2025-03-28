// src/components/post/PostEditorFlow.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { KeyedMutator } from "swr";

import { LoadingModal, ConfirmModal } from "@/components/common";
import { useNotification } from "@/context/NotificationContext";
import { PostImageSelector } from "./create/PostImageSelector";
import PostDetails from "./create/PostDetails";
import CaptionEditor from "./create/CaptionEditor";
import PostReviewStep from "./create/PostReviewStep";

import { usePostEditorContext } from "@/context/PostEditorContext";
import { apiClient } from "@/hooks/dataHooks";

import { AI_API, POSTS_API } from "@/constants/api";
import { PostEditorMode } from "@/types/post";
import { PostDto } from "@/types/dto";

enum ConfirmModalMode {
  CLOSE,
  STEP1_CREATE_NO_IMAGE,
  STEP1_CREATE_NO_ANALYSIS,
  STEP1_EDIT_NO_IMAGE,
}

export const PostEditorFlow = ({
  mutate,
}: {
  mutate: KeyedMutator<{ posts: PostDto[] }>;
}) => {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [confirmModalMode, setConfirmModalMode] = useState<ConfirmModalMode>(
    ConfirmModalMode.CLOSE
  );
  const {
    mode,
    selectedPost,
    image,
    detectedItems,
    customisedBusinessInfo,
    selectableCategories,
    platformStates,
    additionalPrompt,
    setCaptionSuggestions,
  } = usePostEditorContext();

  const isCreating = mode === PostEditorMode.CREATE;
  const isEditing = mode === PostEditorMode.EDIT;

  const { showNotification } = useNotification();

  useEffect(() => {
    contentRef.current?.scrollTo({
      top: contentRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [detectedItems]);

  const handleNext = async (skipConfirm = false) => {
    if (step === 1 && !image && isCreating) {
      setConfirmModalMode(ConfirmModalMode.STEP1_CREATE_NO_IMAGE);
      return;
    }

    if (step === 1 && !detectedItems?.length && !skipConfirm && isCreating) {
      setConfirmModalMode(ConfirmModalMode.STEP1_CREATE_NO_ANALYSIS);
      return;
    }

    if (step === 1 && isEditing && !image && !skipConfirm) {
      setConfirmModalMode(ConfirmModalMode.STEP1_EDIT_NO_IMAGE);
      return;
    }

    setIsLoading(true);

    if (step === 2 && isCreating) {
      await handleGenerateCaptions();
    }
    setIsLoading(false);
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setStep((prev) => prev + 1);
  };

  const handlePost = async () => {
    setIsLoading(true);
    setIsLoading(false);
  };

  const handleUpdate = async () => {
    if (!selectedPost) return;
    setIsLoading(true);
    setLoadingMessage("Updating post...");
    try {
      // Create FormData to handle file uploads
      const formData = new FormData();

      // Add caption
      formData.append("caption", platformStates[0]?.caption || "");

      // Add categories as an array
      const selectedCategories = selectableCategories
        .filter((cat) => cat.isSelected)
        .map((cat) => cat.label);

      // Add each category as a separate form field with the same name
      selectedCategories.forEach((category) => {
        formData.append("categories", category);
      });

      // Add scheduled time if available and it's a scheduled post
      if (platformStates[0]?.scheduleDate) {
        formData.append("scheduled_at", platformStates[0]?.scheduleDate);
      } else {
        formData.append("scheduled_at", "");
      }

      // Add image if a new one was uploaded
      if (image) {
        formData.append("image", image);
      }

      // Use the PATCH endpoint to update the post
      await apiClient.patch(
        POSTS_API.UPDATE(selectedPost.id),
        formData,
        {},
        true // isFormData flag
      );

      // Show success notification
      showNotification("success", "Post updated successfully!");

      // Refresh the data and redirect
      await mutate();
      router.push("/posts");
    } catch (error) {
      console.error("Error updating post:", error);
      // Show error notification
      showNotification("error", "Failed to update post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCaptions = async () => {
    const res = await apiClient.post<{ captions: string[] }>(
      AI_API.CAPTION_GENERATE,
      {
        imgItems: detectedItems,
        businessInfo: customisedBusinessInfo,
        postCategories: selectableCategories,
        platformStates: platformStates,
        customText: additionalPrompt,
      },
      {},
      false // isFormData flag
    );

    if (!res?.captions) {
      alert("❌ Failed to fetch caption generation result or empty data.");
      setCaptionSuggestions([]);
      return;
    }

    setCaptionSuggestions(res.captions);
  };

  const handleBack = () => {
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setStep((prev) => prev - 1);
  };

  return (
    <>
      <LoadingModal isOpen={isLoading} message={loadingMessage} />
      {confirmModalMode === ConfirmModalMode.STEP1_CREATE_NO_IMAGE && (
        <ConfirmModal
          isOpen={true}
          message="An image is required to proceed. Please upload one."
          cancelButtonText="OK"
          type="alert"
          onClose={() => setConfirmModalMode(ConfirmModalMode.CLOSE)}
        />
      )}
      {confirmModalMode === ConfirmModalMode.STEP1_CREATE_NO_ANALYSIS && (
        <ConfirmModal
          isOpen={true}
          message="No objects were detected in the image. The generated captions may not reference image content. Do you want to continue?"
          onConfirm={() => {
            setConfirmModalMode(ConfirmModalMode.CLOSE);
            handleNext(true);
          }}
          onClose={() => setConfirmModalMode(ConfirmModalMode.CLOSE)}
        />
      )}
      {confirmModalMode === ConfirmModalMode.STEP1_EDIT_NO_IMAGE && (
        <ConfirmModal
          isOpen={true}
          message="No new image has been added. Do you want to continue with the existing uploaded image? Click ‘Continue’ to proceed, or click ‘Cancel’ to remove the current image and upload a new one."
          onConfirm={() => {
            setConfirmModalMode(ConfirmModalMode.CLOSE);
            handleNext(true);
          }}
          onClose={() => setConfirmModalMode(ConfirmModalMode.CLOSE)}
        />
      )}

      <div className="flex flex-col h-full">
        {/* Modal Header */}
        <div className="w-full h-10 flex justify-between items-center p-2 border-b bg-white rounded-lg">
          {step === 1 ? (
            <button
              onClick={() => router.back()}
              className="text-gray-500 text-sm"
            >
              Cancel
            </button>
          ) : (
            <button onClick={handleBack} className="text-gray-500 text-sm">
              &lt; Back
            </button>
          )}

          <h2 className="text-lg font-semibold">
            {isCreating ? "New" : "Edit"} Post
          </h2>

          {step < 4 ? (
            <button
              onClick={() => handleNext()}
              className="text-blue-600 text-sm font-medium"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => (isCreating ? handlePost() : handleUpdate())}
              className="text-blue-600 text-sm font-medium"
            >
              {isCreating ? "Post" : "Update"}
            </button>
          )}
        </div>

        {/* Main Content */}
        <div
          ref={contentRef}
          className="mx-auto p-2 w-full overflow-y-auto h-[calc(100%-40px)]"
        >
          {step === 1 && <PostImageSelector />}

          {step === 2 && <PostDetails />}

          {step === 3 && <CaptionEditor />}

          {step === 4 && <PostReviewStep />}
        </div>
      </div>
    </>
  );
};
