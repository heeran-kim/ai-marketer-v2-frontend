// src/app/(protected)/settings/account/page.tsx
"use client";

import { useState } from "react";
import { Card } from "@/components/common";
import { useAuth } from "@/components/auth/AuthProvider";
import TwoFactorAuth from "../components/2FactorQR";
import { apiClient } from "@/hooks/dataHooks";
import { useNotification } from "@/context/NotificationContext";
import { USERS_API } from "@/constants/api";

export default function AccountSettings() {
  const { mutateUser } = useAuth();
  const { showNotification } = useNotification();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      await apiClient.delete(USERS_API.DELETE_ACCOUNT);
    } catch (error) {
      console.error(error);
      showNotification("error", "Failed to delete account. Please try again.");
    } finally {
      await mutateUser(undefined, true);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 2FA */}
      <Card
        id="2fa"
        title="2FA"
        description="Enabling 2FA provides a greater security level towards your account."
        restriction="Please follow the prompts."
        showButton={false}
      >
        <TwoFactorAuth />
      </Card>

      <Card
        id="delete"
        title="Delete Account"
        description="Permanently delete your account and all associated data."
        restriction="This action cannot be undone. All your data will be permanently deleted."
        showButton={false}
      >
        {!isConfirmOpen ? (
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete Account
          </button>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? "Deleting..." : "Confirm Delete"}
              </button>
              <button
                onClick={() => setIsConfirmOpen(false)}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
