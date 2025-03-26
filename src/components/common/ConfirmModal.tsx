// src/components/commom/ConfirmModal.tsx
import { Dialog } from "@headlessui/react";

export type ConfirmType = "warning" | "info";

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
  type = "info",
  itemId = undefined,
  onConfirm,
  onClose,
}: ConfirmModalProps) => {
  const confirmClass = type === "warning" ? "text-red-600" : "text-blue-600";

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
    >
      <div className="bg-white rounded-lg shadow-lg w-80 p-3">
        <h2 className="text-md font-semibold text-gray-800 text-center">
          {title}
        </h2>
        <p className="text-sm text-gray-600 mt-2 text-center">{message}</p>

        <div className="mt-4 border-t border-gray-300">
          <button
            onClick={() => onConfirm(itemId)}
            className={`w-full py-2 font-medium text-center text-md hover:bg-gray-100 ${confirmClass}`}
          >
            {confirmButtonText}
          </button>
        </div>

        <div className="border-t border-gray-300">
          <button
            onClick={onClose}
            className="w-full py-2 text-gray-600 font-medium text-center text-md hover:bg-gray-100"
          >
            {cancelButtonText}
          </button>
        </div>
      </div>
    </Dialog>
  );
};
