// src/app/(protected)/settings/general/page.tsx
"use client";
import { USERS_API } from "@/constants/api";

import { useState, useEffect } from "react";
import { Card, DragAndDropUploader, ErrorFallback } from "@/components/common";
import { useAuth } from "@/components/auth/AuthProvider";
import { useNotification } from "@/context/NotificationContext";
import { useFetchData, apiClient } from "@/hooks/dataHooks";
import { Business } from "@/types/business";
import { INDUSTRY_OPTIONS } from "@/constants/settings";
import { SETTINGS_API } from "@/constants/api";

export default function GeneralSettings() {
  const { mutateUser } = useAuth();
  const {
    data: businessData,
    error,
    isLoading,
    mutate,
  } = useFetchData<Business>(SETTINGS_API.GENERAL);
  const [editedBusiness, setEditedBusiness] = useState<Business | null>(null);
  const [savingFields, setSavingFields] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const isPredefinedCategory = INDUSTRY_OPTIONS.includes(
    editedBusiness?.category ?? ""
  );
  const { showNotification } = useNotification();

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
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return "Logo must be a JPG, PNG, or GIF file";
    }

    return null;
  };

  // Handle logo changes
  const handleLogoChange = async (
    file: File | null,
    previewUrl: string | null
  ) => {
    if (!editedBusiness) return;

    // Clear any existing logo errors
    const newFieldErrors = { ...fieldErrors };
    delete newFieldErrors.logo;
    setFieldErrors(newFieldErrors);

    // If no file or file removed, update the UI with default logo
    if (!file) {
      setEditedBusiness((prev) => ({ ...prev!, logo: previewUrl || "" }));
      setSavingFields((prev) => ({ ...prev, logo: true }));

      try {
        const formData = new FormData();
        formData.append("logo_removed", "true");
        await apiClient.patch(SETTINGS_API.GENERAL, formData, {}, true);
        if (businessData) await mutate({ ...businessData, logo: null }, false);
        await mutateUser();
        showNotification("success", "Logo deleted successfully!");
      } catch (error) {
        console.error("Error deleting logo:", error);
        setEditedBusiness((prev) => ({
          ...prev!,
          logo: businessData?.logo || "",
        }));
        showNotification("error", "Failed to delete logo. Please try again.");
      } finally {
        setSavingFields((prev) => ({ ...prev, logo: false }));
      }
    }

    // If a file is selected, validate and save it immediately
    if (file) {
      // Validate the file before saving
      const errorMsg = validateLogoFile(file);
      if (errorMsg) {
        setFieldErrors((prev) => ({ ...prev, logo: errorMsg }));
        return;
      }

      setEditedBusiness((prev) => ({ ...prev!, logo: previewUrl || "" }));
      setSavingFields((prev) => ({ ...prev, logo: true }));

      try {
        const formData = new FormData();
        formData.append("logo", file);
        await apiClient.patch(SETTINGS_API.GENERAL, formData, {}, true);
        if (businessData) mutate({ ...businessData, logo: previewUrl }, false);
        await mutate();
        await mutateUser();
        showNotification("success", "Logo updated successfully!");
      } catch (error) {
        console.error("Error updating logo:", error);
        setEditedBusiness((prev) => ({
          ...prev!,
          logo: businessData?.logo || "",
        }));
        showNotification("error", "Failed to update logo. Please try again.");
      } finally {
        setSavingFields((prev) => ({ ...prev, logo: false }));
      }
    }
  };

  const handleCategoryClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const category = e.currentTarget.id;
    setEditedBusiness((prev) => ({ ...prev!, category }));
  };

  // Validate a specific field
  const validateField = (
    fieldName: keyof Business,
    value: string
  ): string | null => {
    // Clear previous error for this field
    const newFieldErrors = { ...fieldErrors };
    delete newFieldErrors[fieldName];

    switch (fieldName) {
      case "name":
        if (!value.trim()) {
          return "Business name is required";
        }
        if (value.trim().length < 3) {
          return "Business name must be at least 3 characters";
        }
        break;
      case "category":
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
      setFieldErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
      return;
    }

    // Set this specific field as saving
    setSavingFields((prev) => ({ ...prev, [fieldName]: true }));

    try {
      await apiClient.patch(SETTINGS_API.GENERAL, { [fieldName]: value });
      await mutate();
      await mutateUser();
      showNotification(
        "success",
        `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } updated successfully!`
      );
    } catch (error) {
      console.error(`Error updating ${fieldName}:`, error);
      showNotification(
        "error",
        `Failed to update ${fieldName}. Please try again.`
      );
    } finally {
      // Clear saving state for this field
      setSavingFields((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  if (businessData === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Show error UI if there's an error
  if (error) {
    const handleRetry = async () => {
      await mutate();
    };

    return (
      <ErrorFallback
        message="Failed to load business data. Please try again later."
        onRetry={handleRetry}
        isProcessing={isLoading}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {businessData &&
        Object.values(businessData).every((value) => value === null) && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded-lg">
            <strong>Business information is not set!</strong>
            <br />
            You must complete the business setup before accessing other
            features.
            <br />
            After setting up, you will be able to use all available features.
          </div>
        )}

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
            className={`max-w-xs w-full text-sm p-2 border rounded-md focus:ring focus:ring-blue-300 ${
              fieldErrors.name ? "border-red-500 bg-red-50" : ""
            }`}
            placeholder="Enter your business name"
            value={editedBusiness?.name || ""}
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
            value={editedBusiness?.logo || undefined}
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
          {INDUSTRY_OPTIONS.map((category) => (
            <button
              key={category}
              id="category"
              type="button"
              className={`py-1 px-3 rounded-full text-sm font-medium ${
                editedBusiness?.category === category
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={handleCategoryClick}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-3">
          <input
            id="category"
            type="text"
            className={`max-w-xs w-full text-sm p-2 border rounded-md focus:ring focus:ring-blue-300 ${
              fieldErrors.category ? "border-red-500 bg-red-50" : ""
            }`}
            placeholder="Or enter your category manually"
            value={
              isPredefinedCategory
                ? ""
                : editedBusiness?.category || ""
            }
            onChange={handleInputChange}
          />
          {fieldErrors.category && (
            <p className="text-red-500 text-xs mt-1">
              {fieldErrors.category}
            </p>
          )}
        </div>
      </Card>

      {/* Target Customer */}
      <Card
        id="targetCustomer"
        title="Target Customer"
        description="Provide information about your typical customers (Age, Gender)."
        restriction="Please use 32 characters at maximum."
        onClick={handleSave}
        buttonDisabled={savingFields["targetCustomer"]}
        buttonLoading={savingFields["targetCustomer"]}
      >
        <div className="space-y-1">
          <input
            id="targetCustomer"
            type="text"
            className="max-w-xs w-full text-sm p-2 border rounded-md focus:ring focus:ring-blue-300"
            placeholder="Example: '25-35 year old professionals'"
            value={editedBusiness?.targetCustomer || ""}
            onChange={handleInputChange}
            maxLength={32}
          />
        </div>
      </Card>

      {/* Vibe */}
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
            className="max-w-xs w-full text-sm p-2 border rounded-md focus:ring focus:ring-blue-300"
            placeholder="Example: 'Cozy and minimalist'"
            value={editedBusiness?.vibe || ""}
            onChange={handleInputChange}
            maxLength={32}
          />
        </div>
      </Card>
    </div>
  );
}