// src/app/(protected)/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, NotificationModal, NotificationType, DragAndDropUploader } from "@/components/common";
import { useFetchData, apiClient } from "@/hooks/dataHooks";
import { Business, EMPTY_BUSINESS } from "@/app/types/business";
import { INDUSTRY_OPTIONS, DEFAULT_LOGO_PATH } from "@/constants/settings";
import { SETTINGS_API } from "@/constants/api";

export default function GeneralSettings() {
    const { data: businessData, error, isLoading, mutate } = useFetchData<Business>(SETTINGS_API.GENERAL);
    const [editedBusiness, setEditedBusiness] = useState<Business>(EMPTY_BUSINESS);
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
    const isPredefinedCategory = INDUSTRY_OPTIONS.includes(editedBusiness?.category ?? "");

    // Show notification helper function
    const showNotification = (type: NotificationType, message: string) => {
        setNotification({
            type,
            message,
            isOpen: true
        });
    };
    
    // Close notification helper function
    const closeNotification = () => {
        setNotification(prev => ({
            ...prev,
            isOpen: false
        }));
    };

    // Initialize `editedBusiness` with `businessData` when it loads
    useEffect(() => {
        if (businessData) {
            setEditedBusiness(businessData);
        }
    }, [businessData]);

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fieldName = e.currentTarget.id as keyof Business;
        const value = e.target.value;
        
        setEditedBusiness((prev) => ({ ...prev!, [fieldName]: value }));
        
        // Clear error when user starts typing
        if (fieldErrors[fieldName]) {
            const newFieldErrors = { ...fieldErrors };
            delete newFieldErrors[fieldName];
            setFieldErrors(newFieldErrors);
        }
    };

    // Validate logo file
    const validateLogoFile = (file: File): string | null => {
        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            return "Logo file size should be less than 2MB";
        }
        
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return "Logo must be a JPG, PNG, or GIF file";
        }
        
        return null;
    };

    // Handle logo changes
    const handleLogoChange = async (file: File | null) => {
        if (!editedBusiness) return;

        // Clear any existing logo errors
        const newFieldErrors = { ...fieldErrors };
        delete newFieldErrors.logo;
        setFieldErrors(newFieldErrors);

        // If no file or file removed, update the UI with default logo
        if (!file) setEditedBusiness((prev) => ({ ...prev!, logo: DEFAULT_LOGO_PATH }));
        
        // If a file is selected, validate and save it immediately
        if (file) {
            // Validate the file before saving
            const errorMsg = validateLogoFile(file);
            if (errorMsg) {
                setFieldErrors(prev => ({ ...prev, logo: errorMsg }));
                return;
            }
            
            // 
            const tempLogoUrl = URL.createObjectURL(file);
            setEditedBusiness((prev) => ({ ...prev!, logo: tempLogoUrl }));

            // Set logo as saving
            setSavingFields(prev => ({ ...prev, logo: true }));
            
            try {
                const formData = new FormData();
                formData.append('logo', file);
                await apiClient.patch(SETTINGS_API.GENERAL, formData, {}, true);
                await mutate(); // Refresh data
                showNotification("success", "Logo updated successfully!");
            } catch (error) {
                console.error("Error updating logo:", error);
                setEditedBusiness((prev) => ({ ...prev!, logo: businessData?.logo || DEFAULT_LOGO_PATH }));
                showNotification("error", "Failed to update logo. Please try again.");
            } finally {
                setSavingFields(prev => ({ ...prev, logo: false }));
                if (tempLogoUrl.startsWith('blob:')) URL.revokeObjectURL(tempLogoUrl);
            }
        }
    };

    const handleCategoryClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const category = e.currentTarget.id;
        setEditedBusiness((prev) => ({ ...prev!, category }));
    };

    // Validate a specific field
    const validateField = (fieldName: keyof Business, value: string): string | null => {
        // Clear previous error for this field
        const newFieldErrors = { ...fieldErrors };
        delete newFieldErrors[fieldName];
        
        switch (fieldName) {
            case 'name':
                if (!value.trim()) {
                    return "Business name is required";
                }
                if (value.trim().length < 3) {
                    return "Business name must be at least 3 characters";
                }
                break;
            case 'category':
                if (!value.trim() && !isPredefinedCategory) {
                    return "Please select or enter a category";
                }
                break;
        }
        
        setFieldErrors(newFieldErrors);
        return null;
    };

    // Save data to the backend
    const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!editedBusiness) return;

        const fieldName = e.currentTarget.id as keyof Business;
        const value = editedBusiness[fieldName] as string;
        
        // Validate the field before saving
        const errorMessage = validateField(fieldName, value);
        if (errorMessage) {
            setFieldErrors(prev => ({ ...prev, [fieldName]: errorMessage }));
            return;
        }
        
        // Set this specific field as saving
        setSavingFields(prev => ({ ...prev, [fieldName]: true }));
        
        try {
            await apiClient.patch(SETTINGS_API.GENERAL, {[fieldName]: value});
            showNotification("success", `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} updated successfully!`);
        } catch (error) {
            console.error(`Error updating ${fieldName}:`, error);
            showNotification("error", `Failed to update ${fieldName}. Please try again.`);
        } finally {
            // Clear saving state for this field
            setSavingFields(prev => ({ ...prev, [fieldName]: false }));
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

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
            <NotificationModal
                isOpen={notification.isOpen}
                type={notification.type}
                message={notification.message}
                onClose={closeNotification}
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
                <div className="space-y-1">
                    <input
                        id="name"
                        type="text"
                        className={`w-1/2 text-sm p-2 border rounded-md focus:ring focus:ring-blue-300 ${
                            fieldErrors.name ? 'border-red-500 bg-red-50' : ''
                        }`}
                        placeholder="Enter your business name"
                        value={editedBusiness?.name ?? ""}
                        onChange={handleInputChange}
                        maxLength={32}
                    />
                    {fieldErrors.name && (
                        <p className="text-red-500 text-xs">{fieldErrors.name}</p>
                    )}
                </div>
            </Card>

            {/* Business Logo */}
            <Card
                id="logo"
                title="Business Logo"
                description="Upload your business's logo. This will be displayed on your profile."
                restriction="Maximum size: 2MB. Allowed formats: JPG, PNG, or GIF. Upload to save automatically."
                showButton={false}
            >
                <div className="space-y-1">
                    <DragAndDropUploader
                        value={editedBusiness?.logo ?? ""}
                        onChange={handleLogoChange}
                        fileType="logo"
                    />
                    {fieldErrors.logo && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.logo}</p>
                    )}
                </div>
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

                <div className="space-y-1 mt-2">
                    <input
                        id="category"
                        type="text"
                        className={`w-1/2 text-sm p-2 border rounded-md focus:ring focus:ring-blue-300 ${
                            fieldErrors.category ? 'border-red-500 bg-red-50' : ''
                        }`}
                        placeholder="Enter a more specific type"
                        value={isPredefinedCategory ? "" : editedBusiness?.category}
                        onChange={handleInputChange}
                    />
                    {fieldErrors.category && (
                        <p className="text-red-500 text-xs">{fieldErrors.category}</p>
                    )}
                </div>
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
                <div className="space-y-1">
                    <input
                        id="targetCustomers"
                        type="text"
                        className={`w-1/2 text-sm p-2 border rounded-md focus:ring focus:ring-blue-300 ${
                            fieldErrors.targetCustomers ? 'border-red-500 bg-red-50' : ''
                        }`}
                        placeholder="e.g. 18-35 years old, mostly female"
                        value={editedBusiness?.targetCustomers ?? ""}
                        onChange={handleInputChange}
                        maxLength={32}
                    />
                    {fieldErrors.targetCustomers && (
                        <p className="text-red-500 text-xs">{fieldErrors.targetCustomers}</p>
                    )}
                </div>
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
                <div className="space-y-1">
                    <input
                        id="vibe"
                        type="text"
                        className={`w-3/4 text-sm p-2 border rounded-md focus:ring focus:ring-blue-300 ${
                            fieldErrors.vibe ? 'border-red-500 bg-red-50' : ''
                        }`}
                        placeholder="e.g. Cozy and family-friendly"
                        value={editedBusiness?.vibe ?? ""}
                        onChange={handleInputChange}
                        maxLength={32}
                    />
                    {fieldErrors.vibe && (
                        <p className="text-red-500 text-xs">{fieldErrors.vibe}</p>
                    )}
                </div>
            </Card>
        </div>
    );
}