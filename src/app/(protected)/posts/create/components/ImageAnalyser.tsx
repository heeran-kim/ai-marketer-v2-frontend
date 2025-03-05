"use client";

import { useState } from "react";
import DragAndDropUploader from "@/components/common/DragAndDropUploader";
import Card from "@/components/common/CompactCard";
import { usePostCreation } from "@/context/PostCreationContext";
import { mutateData } from "@/hooks/useApi";
import { ImageAnalysisResponse } from "@/app/types/post";
import { AI_API } from "@/constants/api";

export default function ImageAnalyser() {
    const { image, setImage, detectedItems, setDetectedItems } = usePostCreation();
    const [isLoading, setIsLoading] = useState(false);

    const handleImageUpload = (file: File | null) => {
        setImage(file);
        setDetectedItems([]);
    };

    const handleAnalyseImage = async () => {
        if (!image) {
            alert("Please upload an image first!");
            return;
        }
        
        const formData = new FormData();
        formData.append("image", image);
        
        setIsLoading(true);

        const res: ImageAnalysisResponse | null = await mutateData<ImageAnalysisResponse>(AI_API.IMG_ANALYSIS, "POST", formData, true);
        if (!res || !res.detectedItems) {
            console.error("❌ Failed to fetch image analysis result or empty data.");
            setDetectedItems([]);
            setIsLoading(false);
            return;
        }
        setDetectedItems(res.detectedItems);
        setIsLoading(false);
    };

    const removeDetectedItem = (index: number) => {
        setDetectedItems((prev: string[]) => prev.filter((_, i) => i !== index));
    };

    return (
        <Card
            title="Step 1: Upload & Analyse Image"
            description="Upload an image and let AI detect key elements to generate captions."
        >
            <DragAndDropUploader value={image ? URL.createObjectURL(image) : ""}  onChange={handleImageUpload} fileType="image" />
        
            {image && (
                <div className="mt-2">
                    <button
                        onClick={handleAnalyseImage}
                        className="w-full text-sm bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition"
                        disabled={isLoading}
                    >
                        {isLoading ? "Analysing..." : "Analyse Image"}
                    </button>

                    {detectedItems.length > 0 && (
                        <>
                            <div className="mt-3 p-2 border border-gray-200 rounded-md bg-gray-50 dark:bg-gray-800">
                                <p className="text-sm font-medium mb-2">Detected Items:</p>
                                <div className="flex flex-wrap gap-2">
                                    {detectedItems.map((item, index) => (
                                        <div key={index} className="relative px-3 py-1 bg-gray-200 text-sm rounded-md group">
                                            {item}
                                            <button
                                                onClick={() => removeDetectedItem(index)}
                                                className="absolute -top-2 -right-2 bg-black text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="text-xs mt-2 text-gray-500">
                                🚀 <strong>[AI Model Usage Plan]</strong> <br />
                                - This feature is currently a sample and the AI analysis function has not been implemented yet. <br />
                                - Image analysis AI will be used to detect objects within images. <br />
                                - Planned <strong>pre-trained open-source models</strong> from Hugging Face:  <br />
                                * <strong>CLIP</strong> (Image-to-text matching) <br /> 
                                * <strong>ResNet</strong> (Deep learning-based image classification)  <br />
                                * <strong>EfficientNet</strong> (Lightweight image recognition model) <br />
                                - One of these models will be selected, or a combination may be used for optimal performance.
                            </div>
                        </>
                    )}
                </div>
            )}
        </Card>
    );
}