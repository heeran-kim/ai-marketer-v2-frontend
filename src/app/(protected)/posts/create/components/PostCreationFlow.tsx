"use client";

import ImageAnalyser from "./ImageAnalyser";
import PostDetails from "./PostDetails";
import CaptionSelection from "./CaptionSelection";
// import PlatformMatching from "./PlatformMatching";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePostCreation } from "@/context/PostCreationContext";
import { mutateData } from "@/hooks/useApi";
import { AI_API } from "@/constants/api";


export default function PostCreationFlow() {
    const { image, detectedItems, customisedBusinessInfo, postCategories, platformStates, additionalPrompt, setCaptionSuggestions } = usePostCreation();
    const [step, setStep] = useState(1);
    const router = useRouter();
    
    const handleNext = () => {
        if (step === 1 && !image) {
            alert("⚠️ Please upload an image before proceeding.");
            return;
        }
        if (step === 1 && !detectedItems?.length) {
            const proceedWithoutImageDetails = confirm(
                "⚠️ No objects detected from the image. Captions may not include image-related descriptions. Do you want to continue?"
            );
            if (!proceedWithoutImageDetails) {
                return;
            }
        }
        setStep((prev) => prev + 1);
    };

const handleGenerateCaptions = async () => {
        const res: {captions: string[]} | null = await mutateData<{captions: string[]}>(
            AI_API.CAPTION_GENERATE,
            "POST",
            {
                "imgItems": detectedItems,
                "businessInfo": customisedBusinessInfo,
                "postCategories": postCategories,
                "platformStates": platformStates,
                "customText": additionalPrompt,
            },
            false
        );
        if (!res) {
            alert("❌ Failed to fetch caption generation result or empty data.");
            setCaptionSuggestions([]);
            return;
        }
        setCaptionSuggestions(res.captions);
        setStep((prev) => prev + 1);
    };
    
    const handleBack = () => setStep((prev) => prev - 1);
    
    return (
        <>
            <div className="flex justify-between items-center p-2 border-b bg-white">
                {step === 1 ? (
                    <button onClick={() => router.back()} className="text-gray-500 text-sm">Cancel</button>
                ) : (
                    <button onClick={handleBack} className="text-gray-500 text-sm">&lt; Back</button>
                )}
                
                <h2 className="text-lg font-semibold">New Post</h2>
                
                {step < 4 ? (
                    step === 2 ? (
                        <button onClick={handleGenerateCaptions} className="text-blue-600 text-sm font-medium">
                            Generate Captions
                        </button>
                    ) : (
                        <button onClick={handleNext} className="text-blue-600 text-sm font-medium">
                            Next
                        </button>
                    )
                ) : (
                    <button onClick={() => {/* TODO */}} className="text-blue-600 text-sm font-medium">
                        Post
                    </button>
                )}
            </div>
            <div className="mx-auto p-2 max-h-[550px] w-full">
                {step === 1 && <ImageAnalyser />}
                
                {step === 2 && <PostDetails />} 

                {step === 3 && <CaptionSelection />}
                
                {/* {step === 4 && <PlatformMatching />} */}
            </div>
        </>
    );
}