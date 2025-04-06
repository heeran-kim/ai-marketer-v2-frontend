// src/components/common/NotificationModal.tsx
import { useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

export type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationModalProps {
  isOpen: boolean;
  message: string;
  type: NotificationType;
  onClose: () => void;
  duration?: number;
}

export default function NotificationModal({
  isOpen,
  message,
  type,
  onClose,
  duration = 3000,
}: NotificationModalProps) {
  // Auto-close after duration
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  // Styles based on notification type
  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-600",
          icon: <FaCheckCircle className="text-white text-lg" />,
        };
      case "error":
        return {
          bg: "bg-red-600",
          icon: <FaExclamationCircle className="text-white text-lg" />,
        };
      case "warning":
        return {
          bg: "bg-yellow-500",
          icon: <FaExclamationCircle className="text-white text-lg" />,
        };
      case "info":
      default:
        return {
          bg: "bg-blue-500",
          icon: <FaCheckCircle className="text-white text-lg" />,
        };
    }
  };

  const { bg, icon } = getStyles();

  return (
    <Transition
      show={isOpen}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-500"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Dialog
        open={isOpen}
        onClose={onClose}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50"
      >
        <div
          className={`${bg} text-white px-6 py-3 w-[400px] text-center text-sm font-medium tracking-wide shadow-md rounded-md flex items-center justify-center space-x-2`}
        >
          {icon}
          <span>{message}</span>
        </div>
      </Dialog>
    </Transition>
  );
}
