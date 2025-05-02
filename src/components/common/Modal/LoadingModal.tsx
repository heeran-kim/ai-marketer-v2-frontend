// src/components/common/LoadingModal.tsx

import { Dialog } from "@headlessui/react";

export default function LoadingModal({
  isOpen,
  message = "Loading, please wait...",
}: {
  isOpen: boolean;
  message?: string;
}) {
  return (
    <Dialog
      open={isOpen}
      onClose={() => {}}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        <p className="text-gray-600 text-sm text-center mt-2 whitespace-pre-line">
          {message}
        </p>
      </div>
    </Dialog>
  );
}
