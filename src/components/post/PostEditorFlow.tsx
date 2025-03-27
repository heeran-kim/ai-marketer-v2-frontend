// src/app/(protected)/posts/create/components/PostCreationFlow.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import { LoadingModal, ConfirmModal } from "@/components/common";
import { PostImageSelector } from "./create/PostImageSelector";
import PostDetails from "./create/PostDetails";
import CaptionSelection from "./create/CaptionSelection";
import PostReviewStep from "./create/PostReviewStep";

import { usePostEditorContext } from "@/context/PostEditorContext";
import { apiClient } from "@/hooks/dataHooks";

import { AI_API } from "@/constants/api";
import { PostEditorMode } from "@/app/types/post";

enum ConfirmModalMode {
  CLOSE,
  STEP1_CREATE_NO_IMAGE,
  STEP1_CREATE_NO_ANALYSIS,
  STEP1_EDIT_NO_IMAGE,
}

export const PostEditorFlow = () => {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmModalMode, setConfirmModalMode] = useState<ConfirmModalMode>(
    ConfirmModalMode.CLOSE
  );
  const {
    mode,
    image,
    detectedItems,
    customisedBusinessInfo,
    postCategories,
    platformStates,
    additionalPrompt,
    setCaptionSuggestions,
  } = usePostEditorContext();

  const isEditing = mode === PostEditorMode.EDIT;

  useEffect(() => {
    contentRef.current?.scrollTo({
      top: contentRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [detectedItems]);

  const handleNext = async (skipConfirm = false) => {
    if (step === 1 && !image && !isEditing) {
      setConfirmModalMode(ConfirmModalMode.STEP1_CREATE_NO_IMAGE);
      return;
    }

    if (step === 1 && !detectedItems?.length && !skipConfirm && !isEditing) {
      setConfirmModalMode(ConfirmModalMode.STEP1_CREATE_NO_ANALYSIS);
      return;
    }

    if (step === 1 && isEditing && !image && !skipConfirm) {
      setConfirmModalMode(ConfirmModalMode.STEP1_EDIT_NO_IMAGE);
      return;
    }

    setIsLoading(true);

    if (step === 2) {
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

  const handleGenerateCaptions = async () => {
    const res = await apiClient.post<{ captions: string[] }>(
      AI_API.CAPTION_GENERATE,
      {
        imgItems: detectedItems,
        businessInfo: customisedBusinessInfo,
        postCategories: postCategories,
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
      <LoadingModal isOpen={isLoading} />
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

          <h2 className="text-lg font-semibold">New Post</h2>

          {step < 4 ? (
            <button
              onClick={() => handleNext()}
              className="text-blue-600 text-sm font-medium"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => handlePost()}
              className="text-blue-600 text-sm font-medium"
            >
              Post
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

          {step === 3 && <CaptionSelection />}

          {step === 4 && <PostReviewStep />}
        </div>
      </div>
    </>
  );
};
