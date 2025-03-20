// src/app/(protected)/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import Card from "@/components/common/Card";
import DragAndDropUploader from "@/components/common/DragAndDropUploader";
import { useFetchData, apiClient } from "@/hooks/dataHooks";
import { Business, EMPTY_BUSINESS } from "@/app/types/business";
import { INDUSTRY_OPTIONS, DEFAULT_LOGO_PATH } from "@/constants/settings";
import { SETTINGS_API } from "@/constants/api";
import { SuccessModal } from "@/components/common";

export default function GeneralSettings() {
    const { data: businessData, error, mutate } = useFetchData<Business>(SETTINGS_API.GET_GENERAL);
    const [editedBusiness, setEditedBusiness] = useState<Business>(EMPTY_BUSINESS);
    const [savingFields, setSavingFields] = useState<Record<string, boolean>>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const isPredefinedCategory = INDUSTRY_OPTIONS.includes(editedBusiness?.category ?? "");

    // Initialize `editedBusiness` with `businessData` when it loads
    useEffect(() => {
        if (businessData) {
            setEditedBusiness(businessData);
        }
    }, [businessData]);

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fieldName = e.currentTarget.id as keyof Business;
        setEditedBusiness((prev) => ({ ...prev!, [fieldName]: e.target.value }));
    };

    // Handle logo changes
    const handleLogoChange = async (file: File | null) => {
        // If a file is selected, save it immediately
        if (file) {
            try {
                const formData = new FormData();
                formData.append('logo', file);
                await apiClient.put(SETTINGS_API.UPDATE_GENERAL("me"), formData, {}, true);

                // Update the UI with the new logo URL
                const logoUrl = URL.createObjectURL(file);
                setEditedBusiness((prev) => ({ ...prev!, logo: logoUrl }));

                await mutate(); // Refresh data
                setSuccessMessage("Logo updated successfully!");
            } catch (error) {
                console.error("Error updating logo:", error);
            }
        } else {
            // If no file or file removed, update the UI with default logo
            setEditedBusiness((prev) => ({ ...prev!, logo: DEFAULT_LOGO_PATH }));
        }
    };

    const handleCategoryClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const category = e.currentTarget.id;
        setEditedBusiness((prev) => ({ ...prev!, category }));
    };

    // Save data to the backend
    const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!editedBusiness) return;

        const fieldName = e.currentTarget.id as keyof Business;
        setSavingFields(prev => ({ ...prev, [fieldName]: true }));
        try {
            await apiClient.put(SETTINGS_API.UPDATE_GENERAL("me"), {
                [fieldName]: editedBusiness[fieldName],
            });
            await mutate(); // Refresh data
            setSuccessMessage(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} updated successfully!`);
        } catch (error) {
            console.error(`Error updating ${fieldName}:`, error);
        } finally {
            setSavingFields(prev => ({ ...prev, [fieldName]: false }));
        }
    };

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-64 text-red-500">
                <p>Failed to load business data.</p>
                <button onClick={() => mutate()} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <SuccessModal
                isOpen={!!successMessage}
                message={successMessage || ""}
                onClose={() => setSuccessMessage(null)}
            />
            
            {/* Business Name */}
            <Card
                id="name"
                title="Business Name"
                description="This is your business's visible name. Customers will see this name."
                restriction="Please use 32 characters at maximum."
                onClick={handleSave}
                buttonDisabled={savingFields["name"]}
                buttonLoading={savingFields["name"]}
            >
                <input
                    id="name"
                    type="text"
                    className="w-1/2 text-sm p-2 border rounded-md focus:ring focus:ring-blue-300"
                    placeholder="Enter your business name"
                    value={editedBusiness?.name ?? ""}
                    onChange={handleInputChange}
                    maxLength={32}
                />
            </Card>

            {/* Business Logo */}
            <Card
                id="logo"
                title="Business Logo"
                description="Upload your business's logo. This will be displayed on your profile."
                restriction="Recommended size: 500x500px. PNG or JPG format. Upload to save automatically."
                showButton={false}
            >
                <DragAndDropUploader
                    value={editedBusiness?.logo ?? ""}
                    onChange={handleLogoChange}
                    fileType="logo"
                />
            </Card>

            {/* Business Category Selection */}
            <Card
                id="category"
                title="Business Category"
                description="Select your business category. If your category is not listed or you want a more specific name, enter it manually."
                restriction="Choose one of the options or enter manually."
                onClick={handleSave}
                buttonDisabled={savingFields["category"]}
                buttonLoading={savingFields["category"]}
            >
                <div className="flex flex-wrap gap-2">
                    {INDUSTRY_OPTIONS.map((industry) => {
                        const isSelected = isPredefinedCategory && editedBusiness?.category === industry;

                        return (
                            <button
                                key={industry}
                                id={industry}
                                onClick={handleCategoryClick}
                                className={`px-3 py-1.5 rounded-md border text-sm ${
                                    isSelected || (!isPredefinedCategory && industry === "Others")
                                        ? "bg-black text-white border-black"
                                        : "bg-white border-gray-300 hover:bg-gray-100"
                                }`}
                            >
                                {industry}
                            </button>
                        );
                    })}
                </div>

                <input
                    id="category"
                    type="text"
                    className="w-1/2 mt-2 text-sm p-2 border rounded-md focus:ring focus:ring-blue-300"
                    placeholder="Enter a more specific type"
                    value={isPredefinedCategory ? "" : editedBusiness?.category}
                    onChange={handleInputChange}
                />
            </Card>

            <Card
                id="targetCustomers"
                title="Target Customer"
                description="Provide information about your typical customers (Age, Gender)."
                restriction="Please use 32 characters at maximum."
                onClick={handleSave}
                buttonDisabled={savingFields["targetCustomers"]}
                buttonLoading={savingFields["targetCustomers"]}
            >
                <input
                    id="targetCustomers"
                    type="text"
                    className="w-1/2 text-sm p-2 border rounded-md focus:ring focus:ring-blue-300"
                    placeholder="e.g. 18-35 years old, mostly female"
                    value={editedBusiness?.targetCustomers ?? ""}
                    onChange={handleInputChange}
                    maxLength={32}
                />
            </Card>

            <Card
                id="vibe"
                title="Vibe"
                description="Describe the atmosphere of your business."
                restriction="Please use 32 characters at maximum."
                onClick={handleSave}
                buttonDisabled={savingFields["vibe"]}
                buttonLoading={savingFields["vibe"]}
            >
                <input
                    id="vibe"
                    type="text"
                    className="w-3/4 text-sm p-2 border rounded-md focus:ring focus:ring-blue-300"
                    placeholder="e.g. Cozy and family-friendly"
                    value={editedBusiness?.vibe ?? ""}
                    onChange={handleInputChange}
                    maxLength={32}
                />
            </Card>
        </div>
    );
}