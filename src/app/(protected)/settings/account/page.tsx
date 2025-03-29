// src/app/(protected)/settings/general/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, NotificationModal, NotificationType, DragAndDropUploader } from "@/components/common";
import { useFetchData, apiClient } from "@/hooks/dataHooks";
import { INDUSTRY_OPTIONS } from "@/constants/settings";
import { SETTINGS_API } from "@/constants/api";
import TwoFactorAuth from "@/components/common/2FactorQR";

export default function GeneralSettings() {
    const [savingFields, setSavingFields] = useState<Record<string, boolean>>({});
    const [notification, setNotification] = useState<{
        type: NotificationType;
        message: string;
        isOpen: boolean;
    }>({
        type: "info",
        message: "",
        isOpen: false
    });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    
    // Close notification helper function
    const closeNotification = () => {
        setNotification(prev => ({
            ...prev,
            isOpen: false
        }));
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
                id="name"
                title="2FA"
                description="Enabling 2FA provides a greater security level towards your account."
                restriction="Please follow the prompts."
                buttonDisabled={savingFields["name"]}
                buttonLoading={savingFields["name"]}
                showButton={false}
            >
                <div className="space-y-1">
                    {fieldErrors.name && (
                        <p className="text-red-500 text-xs">{fieldErrors.name}</p>
                    )}
                </div>
                <TwoFactorAuth/>
            </Card>
        </div>
    );
}