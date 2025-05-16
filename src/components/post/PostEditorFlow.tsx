// src/components/post/PostEditorFlow.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  LoadingModal,
  ConfirmModalMode,
  ConfirmModalHandler,
} from "@/components/common";
import { CaptionMethodSelector } from "./create/CaptionMethodSelector";
import { PostImageSelector } from "./create/PostImageSelector";
import PostDetails from "./create/PostDetails";
import CaptionEditor from "./components/captionEditor/CaptionEditor";
import PostReviewStep from "./create/PostReviewStep";

import { usePostEditorContext } from "@/context/PostEditorContext";
import { PostEditorMode, StepNames } from "@/types/post";

export const PostEditorFlow = () => {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [confirmModalMode, setConfirmModalMode] = useState<ConfirmModalMode>(
    ConfirmModalMode.CLOSE
  );
  const {
    isLoading,
    setIsLoading,
    loadingMessage,
    setErrorMessage,
    mode,
    resetPostEditor,
    fetchCaptionSuggestions,
    createPost,
    updatePost,
    platformSchedule,
    stepState,
    dispatch,
    captionGenerationSettings,
    captionGenerationInfo,
  } = usePostEditorContext();

  const { image } = captionGenerationInfo;
  const isCreating = mode === PostEditorMode.CREATE;
  const isGeneratingCaption =
    isCreating && captionGenerationSettings.method === "ai";
  const isEditing = mode === PostEditorMode.EDIT;
  const [isLastStep, setIsLastStep] = useState<boolean>(false);

  useEffect(() => {
    setIsLastStep(stepState.stepName === StepNames[StepNames.length - 1]);
  }, [stepState.stepName]);

  const handleNext = async (skipConfirm = false) => {
    if (stepState.stepName === "IMAGE_SELECTION" && !image && isCreating) {
      setConfirmModalMode(ConfirmModalMode.STEP1_CREATE_NO_IMAGE);
      return;
    }

    if (
      stepState.stepName === "IMAGE_SELECTION" &&
      isEditing &&
      !image &&
      !skipConfirm
    ) {
      setConfirmModalMode(ConfirmModalMode.STEP1_EDIT_NO_IMAGE);
      return;
    }

    if (stepState.stepNumber === StepNames.length && !skipConfirm) {
      const allDontPost = Object.values(platformSchedule).every(
        (schedule) => schedule.scheduleType === "dontPost"
      );

      if (allDontPost) {
        setConfirmModalMode(ConfirmModalMode.STEP4_ALL_POSTS_DONT_POST);
        return;
      }
    }

    setIsLoading(true);

    if (stepState.stepName === "POST_DETAILS" && isGeneratingCaption) {
      await fetchCaptionSuggestions();
    }

    if (isLastStep) {
      if (isCreating) await createPost();
      else if (isEditing) await updatePost();
    }

    setIsLoading(false);
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    dispatch({
      type: "NEXT",
      payload: { captionGenerationSettings },
    });
  };

  const handleBack = () => {
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    dispatch({
      type: "BACK",
      payload: { captionGenerationSettings },
    });
    setErrorMessage(null);
  };

  return (
    <>
      <LoadingModal isOpen={isLoading} message={loadingMessage} />
      <ConfirmModalHandler
        mode={confirmModalMode}
        setMode={setConfirmModalMode}
        handleNext={handleNext}
      />

      <div className="flex flex-col h-full">
        {/* Modal Header */}
        <div className="w-full h-10 flex justify-between items-center p-2 border-b bg-white rounded-lg">
          {((isCreating && stepState.stepName === "CAPTION_METHOD_SELECTION") || // Cancel for CREATE mode
            (isEditing && stepState.stepName === "IMAGE_SELECTION")) && ( // Cancel for EDIT mode
            <button
              onClick={() => {
                resetPostEditor();
                router.back();
              }}
              className="text-gray-500 text-sm"
            >
              Cancel
            </button>
          )}
          {((isCreating &&
            stepState.stepNumber >
              StepNames.indexOf("CAPTION_METHOD_SELECTION")) || // Back for CREATE mode
            (isEditing &&
              stepState.stepNumber > StepNames.indexOf("IMAGE_SELECTION"))) && ( // Back for EDIT mode
            <button onClick={handleBack} className="text-gray-500 text-sm">
              Back
            </button>
          )}

          <h2 className="text-lg font-semibold">
            {isCreating ? "New Post" : isEditing ? "Edit Post" : ""}
          </h2>

          <button
            onClick={() => handleNext()}
            className="text-blue-600 text-sm font-medium"
          >
            {!isLastStep ? "Next" : isCreating ? "Post" : "Update"}
          </button>
        </div>

        {/* Main Content */}
        <div
          ref={contentRef}
          className="mx-auto p-2 w-full overflow-y-auto h-[calc(100%-40px)]"
        >
          {stepState.stepName === "CAPTION_METHOD_SELECTION" && (
            <CaptionMethodSelector />
          )}
          {stepState.stepName === "IMAGE_SELECTION" && <PostImageSelector />}
          {stepState.stepName === "POST_DETAILS" && <PostDetails />}
          {stepState.stepName === "CAPTION_EDITOR" && <CaptionEditor />}
          {stepState.stepName === "POST_REVIEW" && <PostReviewStep />}
        </div>
      </div>
    </>
  );
};
