"use client";

import LoadingModal from "@/components/common/LoadingModal";
import ImageAnalyser from "./ImageAnalyser";
import PostDetails from "./PostDetails";
import CaptionSelection from "./CaptionSelection";
import PostReviewStep from "./PostReviewStep";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { usePostCreation } from "@/context/PostCreationContext";
import { mutateData } from "@/hooks/useApi";
import { AI_API } from "@/constants/api";


export default function PostCreationFlow() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const { image, detectedItems, customisedBusinessInfo, postCategories, platformStates, additionalPrompt, setCaptionSuggestions } = usePostCreation();

    useEffect(() => {
        contentRef.current?.scrollTo({ top: contentRef.current.scrollHeight, behavior: "smooth" });
    }, [detectedItems]);
    
    const handleNext = async () => {
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
        setIsLoading(true);
        if (step === 2) {
            await handleGenerateCaptions();
        }
        setIsLoading(false);
        contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
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
    };
    
    const handleBack = () => {
        contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        setStep((prev) => prev - 1)
    };
    
    return (
        <>
            <LoadingModal isOpen={isLoading} />
            <div className="absolute top-0 left-0 w-full flex justify-between items-center p-2 border-b bg-white rounded-lg">
                {step === 1 ? (
                    <button onClick={() => router.back()} className="text-gray-500 text-sm">Cancel</button>
                ) : (
                    <button onClick={handleBack} className="text-gray-500 text-sm">&lt; Back</button>
                )}
                
                <h2 className="text-lg font-semibold">New Post</h2>
                
                {step < 4 ? (
                    <button onClick={handleNext} className="text-blue-600 text-sm font-medium">
                        Next
                    </button>
                ) : (
                    <button onClick={() => {/* TODO */}} className="text-blue-600 text-sm font-medium">
                        Post
                    </button>
                )}
            </div>

            <div ref={contentRef} className="mx-auto mt-10 p-2 max-h-[550px] w-full overflow-y-auto">
                {step === 1 && <ImageAnalyser />}
                
                {step === 2 && <PostDetails />} 

                {step === 3 && <CaptionSelection />}
                
                {step === 4 && <PostReviewStep />}
            </div>            
        </>
    );
}
