// components/common/Modal.tsx
"use client";

import { useEffect } from "react";
import clsx from "clsx";

export default function Modal({
  isOpen,
  onClose,
  children,
  height = "sm:h-[500px]",
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: string;
}) {
  // Handle click outside the modal content to trigger close
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Clean up on unmount or when modal is closed
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div
      // Modal backdrop container with fade transition
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200",
        isOpen
          ? "opacity-100 pointer-events-auto" // Show modal
          : "opacity-0 pointer-events-none" // Hide modal and disable interaction
      )}
      onClick={handleOutsideClick}
    >
      <div
        // Modal content box
        className={`bg-white p-2 w-full sm:w-[430px] h-full ${height} max-w-md shadow-lg flex flex-col`}
      >
        {children}
      </div>
    </div>
  );
}
