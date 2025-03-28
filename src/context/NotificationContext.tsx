// src/context/NotificationContext.tsx
"use client";

import { createContext, useContext, useState } from "react";
import { NotificationModal, NotificationType } from "@/components/common";

const NotificationContext = createContext<{
  showNotification: (type: NotificationType, message: string) => void;
} | null>(null);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<{
    isOpen: boolean;
    type: NotificationType;
    message: string;
  }>({
    isOpen: false,
    type: "info",
    message: "",
  });

  const showNotification = (type: NotificationType, message: string) => {
    setState({ isOpen: true, type, message });
    setTimeout(() => setState((prev) => ({ ...prev, isOpen: false })), 2000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <NotificationModal
        isOpen={state.isOpen}
        type={state.type}
        message={state.message}
        onClose={() => setState((prev) => ({ ...prev, isOpen: false }))}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  return context;
};
