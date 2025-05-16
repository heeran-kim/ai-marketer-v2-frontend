// src/components/common/ConfirmModalHandler.tsx
import React from "react";
import { ConfirmModal } from "./ConfirmModal";

export enum ConfirmModalMode {
  CLOSE,
  STEP1_CREATE_NO_IMAGE,
  STEP1_EDIT_NO_IMAGE,
  STEP4_ALL_POSTS_DONT_POST,
}

interface ConfirmModalHandlerProps {
  mode: ConfirmModalMode;
  setMode: React.Dispatch<React.SetStateAction<ConfirmModalMode>>;
  handleNext?: (skipConfirm: boolean) => Promise<void>;
}

export const ConfirmModalHandler: React.FC<ConfirmModalHandlerProps> = ({
  mode,
  setMode,
  handleNext,
}) => {
  const handleClose = () => {
    setMode(ConfirmModalMode.CLOSE);
  };

  const handleConfirm = () => {
    setMode(ConfirmModalMode.CLOSE);
    if (handleNext) {
      handleNext(true);
    }
  };

  switch (mode) {
    case ConfirmModalMode.STEP1_CREATE_NO_IMAGE:
      return (
        <ConfirmModal
          isOpen={true}
          message="An image is required to proceed. Please upload one."
          cancelButtonText="OK"
          type="alert"
          onClose={handleClose}
        />
      );
    case ConfirmModalMode.STEP1_EDIT_NO_IMAGE:
      return (
        <ConfirmModal
          isOpen={true}
          message="No new image has been added. Do you want to continue with the existing uploaded image? Click 'Continue' to proceed, or click 'Cancel' to remove the current image and upload a new one."
          onConfirm={handleConfirm}
          onClose={handleClose}
        />
      );
    case ConfirmModalMode.STEP4_ALL_POSTS_DONT_POST:
      return (
        <ConfirmModal
          isOpen={true}
          message={`All posts are set to 'Don't Post'.
            This action will cancel the post creation process.
            Are you sure you want to proceed?`}
          onConfirm={handleConfirm}
          onClose={handleClose}
        />
      );
    default:
      return null;
  }
};

export default ConfirmModalHandler;
