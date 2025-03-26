// src/components/common/ConfirmModal.tsx
import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import {
  FaExclamationTriangle,
  FaInfoCircle,
  FaQuestion,
} from "react-icons/fa";

export type ConfirmType = "warning" | "info" | "question";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  type?: ConfirmType;
  itemId?: string;
  onConfirm: (itemId?: string) => void;
  onClose: () => void;
}

export const ConfirmModal = ({
  isOpen,
  title = "Confirmation",
  message,
  confirmButtonText = "Continue",
  cancelButtonText = "Cancel",
  type = "question",
  itemId = undefined,
  onConfirm,
  onClose,
}: ConfirmModalProps) => {
  // Store the message in local state to prevent it from changing during animations
  const [localMessage, setLocalMessage] = useState(message);
  const [localTitle, setLocalTitle] = useState(title);

  // Update local state when props change and modal is open or just opened
  useEffect(() => {
    if (isOpen) {
      setLocalMessage(message);
      setLocalTitle(title);
    }
  }, [isOpen, message, title]);

  // Prevent action handlers from firing multiple times
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    onConfirm(itemId);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    onClose();
  };

  // Reset submitting state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 300);
    }
  }, [isOpen]);

  // Type-based styling and icons
  const typeStyles = {
    warning: {
      icon: <FaExclamationTriangle className="h-5 w-5 text-red-500" />,
      headerBg: "bg-red-50 dark:bg-red-900/10",
      headerText: "text-red-700 dark:text-red-400",
      confirmBg: "bg-red-600 hover:bg-red-700 active:bg-red-800",
    },
    info: {
      icon: <FaInfoCircle className="h-5 w-5 text-blue-500" />,
      headerBg: "bg-blue-50 dark:bg-blue-900/10",
      headerText: "text-blue-700 dark:text-blue-400",
      confirmBg: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800",
    },
    question: {
      icon: <FaQuestion className="h-5 w-5 text-indigo-500" />,
      headerBg: "bg-indigo-50 dark:bg-indigo-900/10",
      headerText: "text-indigo-700 dark:text-indigo-400",
      confirmBg: "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800",
    },
  };

  const { icon, headerBg, headerText, confirmBg } = typeStyles[type];

  if (!isOpen) return null;

  return (
    <Dialog
      className="relative z-50"
      open={isOpen}
      onClose={handleClose}
      static
    >
      {/* Background overlay with increased blur */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Center container with responsive width */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-xs sm:max-w-sm bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
          {/* Header with colored background based on type */}
          <div className={`px-4 py-3 ${headerBg} flex items-center`}>
            <div className="mr-2 flex-shrink-0">{icon}</div>
            <Dialog.Title className={`text-base font-semibold ${headerText}`}>
              {localTitle}
            </Dialog.Title>
          </div>

          {/* Message body with proper padding */}
          <div className="px-4 py-3 text-center">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {localMessage}
            </p>
          </div>

          {/* Buttons with full width on mobile */}
          <div className="px-4 py-3 bg-gray-100 dark:bg-gray-900/20 flex flex-col sm:flex-row-reverse gap-2">
            {/* Confirm button */}
            <button
              type="button"
              className={`w-full sm:w-auto px-4 py-2 text-sm font-medium text-white rounded-lg ${confirmBg}`}
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              {confirmButtonText}
            </button>

            {/* Cancel button */}
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {cancelButtonText}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
