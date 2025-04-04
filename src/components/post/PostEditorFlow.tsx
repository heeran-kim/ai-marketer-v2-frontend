// src/components/post/PostEditorFlow.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { KeyedMutator } from "swr";

import {
  LoadingModal,
  ConfirmModalMode,
  ConfirmModalHandler,
} from "@/components/common";
import { PostImageSelector } from "./create/PostImageSelector";
import PostDetails from "./create/PostDetails";
import CaptionEditor from "./components/captionEditor/CaptionEditor";
import PostReviewStep from "./create/PostReviewStep";

import { usePostEditorContext } from "@/context/PostEditorContext";
import { PostEditorMode } from "@/types/post";
import { PostDto } from "@/types/dto";

export const PostEditorFlow = ({
  mutate,
}: {
  mutate: KeyedMutator<{ posts: PostDto[] }>;
}) => {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [confirmModalMode, setConfirmModalMode] = useState<ConfirmModalMode>(
    ConfirmModalMode.CLOSE
  );
  const {
    isLoading,
    setIsLoading,
    loadingMessage,
    mode,
    step,
    setStep,
    image,
    detectedItems,
    resetPostEditor,
    fetchCaptionSuggestions,
    updatePost,
    platformSchedule,
  } = usePostEditorContext();

  const isCreating = mode === PostEditorMode.CREATE;
  const isEditing = mode === PostEditorMode.EDIT;

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

    if (step === 4 && !skipConfirm) {
      console.log(platformSchedule);
      const allDontPost = Object.values(platformSchedule).every(
        (schedule) => schedule.scheduleType === "dontPost"
      );

      if (allDontPost) {
        setConfirmModalMode(ConfirmModalMode.STEP4_ALL_POSTS_DONT_POST);
        return;
      }
    }

    setIsLoading(true);

    if (step === 2 && isCreating) {
      await fetchCaptionSuggestions();
    }

    if (step === 4 && isCreating) {
      handlePost();
    }

    if (step === 4 && isEditing) {
      updatePost(mutate);
    }

    setIsLoading(false);
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setStep(step + 1);
  };

  const handlePost = async () => {
    setIsLoading(true);
    setIsLoading(false);
  };

  const handleBack = () => {
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setStep(step - 1);
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
          {step === 1 ? (
            <button
              onClick={() => {
                resetPostEditor();
                router.back();
              }}
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

          <button
            onClick={() => handleNext()}
            className="text-blue-600 text-sm font-medium"
          >
            {step < 4 ? "Next" : isCreating ? "Post" : "Update"}
          </button>
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
