"use client";

import { useState } from "react";
import Card from "@/components/common/Card";
import DragAndDropUploader from "@/components/common/DragAndDropUploader";

export default function SalesDataUpload() {
    const [salesFile, setSalesFile] = useState<File | null>(null);

    const handleFileChange = (file: File | null) => {
        setSalesFile(file);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Upload Sales Data */}
            <Card
                title="Upload Sales Data"
                description="Drag and drop your sales data file here, or click to select."
                restriction="Supported formats: CSV, JSON, XLSX."
            >
                <DragAndDropUploader onChange={handleFileChange} fileType="data" />
                {salesFile && <p className="text-gray-600 text-sm mt-2">Uploaded: {salesFile.name}</p>}
            </Card>
        </div>
    );
}