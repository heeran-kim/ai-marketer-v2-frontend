// src/app/(protected)/settings/account/page.tsx
"use client";

import { useState } from "react";
import { Card, NotificationModal, NotificationType } from "@/components/common";
import TwoFactorAuth from "../components/2FactorQR";

export default function GeneralSettings() {
    const [notification, setNotification] = useState<{
        type: NotificationType;
        message: string;
        isOpen: boolean;
    }>({
        type: "info",
        message: "",
        isOpen: false
    });

    
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
                showButton={false}
            >
                <TwoFactorAuth/>
            </Card>
        </div>
    );
}