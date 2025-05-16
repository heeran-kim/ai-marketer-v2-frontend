// src/app/(protected)/settings/account/page.tsx
"use client";

import { useState } from "react";
import { Card, NotificationModal, NotificationType } from "@/components/common";
import TwoFactorAuth from "../components/2FactorQR";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { SETTINGS_API } from "@/constants/api";

export default function AccountSettings() {
    const router = useRouter();
    const { authState } = useAuth();
    const [notification, setNotification] = useState<{
        type: NotificationType;
        message: string;
        isOpen: boolean;
    }>({
        type: "info",
        message: "",
        isOpen: false
    });
    
    // Account deletion states
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    
    // Check if user is authenticated
    const isAuthenticated = authState.status === "authenticated";
    
    // Close notification helper function
    const closeNotification = () => {
        setNotification(prev => ({
            ...prev,
            isOpen: false
        }));
    };
    
    // Handle account deletion
    const handleDeleteAccount = async () => {
        if (!isAuthenticated) return;
        
        setActionLoading(true);
        
        try {
            // Use the correct endpoint from your API constants
            const response = await fetch(SETTINGS_API.DELETE_ACCOUNT, {
                method: 'DELETE',
                credentials: 'include'  // Include cookies for authentication
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete account');
            }
            
            // Handle successful deletion
            window.location.href = '/login'; // Redirect to login page
            
        } catch (err) {
            setNotification({
                type: "error",
                message: err instanceof Error ? err.message : String(err),
                isOpen: true
            });
            setShowDeleteConfirm(false);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <NotificationModal
                isOpen={notification.isOpen}
                type={notification.type}
                message={notification.message}
                onClose={closeNotification}
            />
            
            {/* 2FA */}
            <Card
                id="2fa"
                title="2FA"
                description="Enabling 2FA provides a greater security level towards your account."
                restriction="Please follow the prompts."
                showButton={false}
            >
                <TwoFactorAuth/>
            </Card>
            
            {/* Account Deletion */}
            <Card
                id="delete"
                title="Delete Account"
                description="Permanently delete your account and all associated data."
                restriction="This action cannot be undone. All your data will be permanently deleted."
                showButton={false}
            >
                {!showDeleteConfirm ? (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        Delete Account
                    </button>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">Are you sure you want to delete your account? This action cannot be undone.</p>
                        <div className="flex space-x-4">
                            <button
                                onClick={handleDeleteAccount}
                                disabled={actionLoading}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {actionLoading ? "Deleting..." : "Confirm Delete"}
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={actionLoading}
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