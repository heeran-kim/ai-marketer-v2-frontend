// src/app/(protected)/settings/general/page.tsx
"use client";

import { useState, useEffect } from "react";
import Card from "@/components/common/Card";
import DragAndDropUploader from "@/components/common/DragAndDropUploader";
import { useFetchData, mutateData } from "@/hooks/useApi";
import { Business, EMPTY_BUSINESS } from "@/app/types/business";
import { INDUSTRY_OPTIONS, DEFAULT_LOGO_PATH } from "@/constants/settings";
import { BUSINESSES_API } from "@/constants/api";

export default function GeneralSettings() {
    const { data: businessData, error, isLoading, mutate } = useFetchData<Business>(BUSINESSES_API.GET_ALL);
    const [editedBusiness, setEditedBusiness] = useState<Business>(EMPTY_BUSINESS);
    const [googleMapsUrl, setGoogleMapsUrl] = useState("");
    const isPredefinedCategory = INDUSTRY_OPTIONS.includes(editedBusiness?.category ?? "");

    // Initialise `editedBusiness` with `businessData` when it loads
    useEffect(() => {
        if (businessData) {
            setEditedBusiness(businessData);
        }
    }, [businessData]);

    const fakeBusinessData = {
        name: "The Great Steakhouse",
        logo: "/images/the-great-steakhouse.jpeg",
        category: "Restaurant",
    };

    const handleSaveGoogleMapsLink = () => {
        setEditedBusiness((prev) => ({
            ...prev,
            name: fakeBusinessData.name,
            logo: fakeBusinessData.logo,
            category: fakeBusinessData.category,
        }));
    };

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fieldName = e.currentTarget.id as keyof Business;
        setEditedBusiness((prev) => ({ ...prev!, [fieldName]: e.target.value }));
    };

    // Handle logo changes
    const handleLogoChange = (file: File | null) => {
        const logoUrl = file ? URL.createObjectURL(file) : DEFAULT_LOGO_PATH;
        setEditedBusiness((prev) => ({ ...prev!, logo: logoUrl }));
    };

    const handleCategoryClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedBusiness((prev) => ({ ...prev!, category: e.currentTarget.id }));
    };

    // Save data to the backend
    const handleSave = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editedBusiness) return;
        const fieldName = e.currentTarget.id as keyof Business;
        await mutateData(BUSINESSES_API.UPDATE("todolater"), "PUT", {
            [fieldName]: editedBusiness[fieldName],
        });
        mutate(businessData, true);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><p className="text-gray-500">Loading...</p></div>;
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
            <Card
                title="Google Maps Business Link"
                description="If you want to use Google Maps data for Promoease, enter your Place ID below."
                restriction="Copy and paste the full Google Maps business URL."
                onSave={handleSaveGoogleMapsLink}
            >
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        className="w-1/2 text-sm p-2 border rounded-md focus:ring focus:ring-blue-300"
                        placeholder="Enter Google Maps URL"
                        value={googleMapsUrl}
                        onChange={(e) => setGoogleMapsUrl(e.target.value)}
                    />
                </div>
            </Card>

            {/* Business Name */}
            <Card
                id="name"
                title="Business Name"
                description="This is your business's visible name. Customers will see this name."
                restriction="Please use 32 characters at maximum."
                onSave={() => handleSave}
            >
                <input
                    id="name"
                    type="text"
                    className="w-1/2 text-sm p-2 border rounded-md focus:ring focus:ring-blue-300"
                    placeholder="Enter your business name"
                    value={editedBusiness?.name ?? ""}
                    onChange={handleInputChange}
                />
            </Card>

            {/* Business Logo */}
            <Card
                id="logo"
                title="Business Logo"
                description="Upload your business's logo. This will be displayed on your profile."
                restriction="Recommended size: 500x500px. PNG or JPG format."
                showSaveButton={false}
            >
                <DragAndDropUploader value={editedBusiness?.logo ?? ""} onChange={handleLogoChange} fileType="logo" />
            </Card>

            {/* Business Category Selection */}
            <Card
                id="type"
                title="Business Category"
                description="Select your business category. If your category is not listed or you want a more specific name, enter it manually."
                restriction="Choose one of the options or enter manually."
                onSave={() => handleSave}
            >
                <div className="flex flex-wrap gap-2">
                    {INDUSTRY_OPTIONS.map((industry) => {
                        const isSelected = isPredefinedCategory && editedBusiness?.category === industry;

                        return (
                            <button
                                key={industry}
                                id={industry}
                                onClick={() => handleCategoryClick}
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
                id="target"
                title="Target Customer"
                description="Provide information about your typical customers (Age, Gender)."
                restriction="Please use 32 characters at maximum."
                onSave={() => handleSave}
            >
                <input
                    id="target"
                    type="text"
                    className="w-1/2 text-sm p-2 border rounded-md focus:ring focus:ring-blue-300"
                    placeholder="e.g. 18-35 years old, mostly female"
                    value={editedBusiness?.targetCustomers ?? ""}
                    onChange={handleInputChange}
                />
            </Card>

            <Card
                id="vibe"
                title="Vibe"
                description="Describe the atmosphere of your business."
                restriction="Please use 32 characters at maximum."
                onSave={() => handleSave}
            >
                <input
                    id="vibe"
                    type="text"
                    className="w-3/4 text-sm p-2 border rounded-md focus:ring focus:ring-blue-300"
                    placeholder="e.g. Cozy and family-friendly"
                    value={editedBusiness?.vibe ?? ""}
                    onChange={handleInputChange}
                />
            </Card>

        </div>
    );
}