// src/components/common/ConfirmModal.tsx
import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import {
  FaExclamationTriangle,
  FaInfoCircle,
  FaQuestion,
} from "react-icons/fa";

export type ConfirmType = "alert" | "warning" | "info";

interface ConfirmModalProps {
  isOpen?: boolean;
  title?: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  type?: ConfirmType;
  itemId?: string;
  onConfirm?: (itemId?: string) => void;
  onClose: () => void;
  children?: React.ReactNode;
}

export const ConfirmModal = ({
  isOpen = true,
  title = "Confirmation",
  message,
  confirmButtonText = "Continue",
  cancelButtonText = "Cancel",
  type = "warning",
  itemId = undefined,
  onConfirm,
  onClose,
  children,
}: ConfirmModalProps) => {
  // Store the message in local state to prevent it from changing during animations
  const [localTitle, setLocalTitle] = useState(title);
  const [localMessage, setLocalMessage] = useState(message);

  // Update local state when props change and modal is open or just opened
  useEffect(() => {
    if (isOpen) {
      setLocalTitle(title);
      setLocalMessage(message);
    }
  }, [isOpen, message, title]);

  // Prevent action handlers from firing multiple times
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = () => {
    if (isSubmitting) return;
    if (!onConfirm) return;
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
    alert: {
      icon: <FaExclamationTriangle className="h-5 w-5 text-red-500" />,
      headerBg: "bg-red-50",
      headerText: "text-red-700",
      confirmBg: "bg-red-600 hover:bg-red-700 active:bg-red-800",
    },
    warning: {
      icon: <FaQuestion className="h-5 w-5 text-orange-500" />,
      headerBg: "bg-orange-50",
      headerText: "text-orange-700",
      confirmBg: "bg-orange-600 hover:bg-orange-700 active:bg-orange-800",
    },
    info: {
      icon: <FaInfoCircle className="h-5 w-5 text-blue-500" />,
      headerBg: "bg-blue-50",
      headerText: "text-blue-700",
      confirmBg: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800",
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
        <Dialog.Panel className="w-full max-w-xs sm:max-w-sm bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header with colored background based on type */}
          <div className={`px-4 py-3 ${headerBg} flex items-center`}>
            <div className="mr-2 flex-shrink-0">{icon}</div>
            <Dialog.Title className={`text-base font-semibold ${headerText}`}>
              {localTitle}
            </Dialog.Title>
          </div>

          {/* Message body with proper padding */}
          <div className="px-4 py-3 text-center">
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {localMessage}
            </p>
            {children}
          </div>

          {/* Buttons with full width on mobile */}
          <div className="px-4 py-3 bg-gray-100 flex flex-col sm:flex-row-reverse gap-2">
            {/* Confirm button */}
            {type !== "alert" && (
              <button
                type="button"
                className={`w-full sm:w-auto px-4 py-2 text-sm font-medium text-white rounded-lg ${confirmBg}`}
                onClick={handleConfirm}
                disabled={isSubmitting}
              >
                {confirmButtonText}
              </button>
            )}

            {/* Cancel button */}
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 "
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
