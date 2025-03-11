"use client";

import { LoadingModal, ConfirmModal } from "@/components/common";
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
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const { image, detectedItems, customisedBusinessInfo, postCategories, platformStates, additionalPrompt, setCaptionSuggestions } = usePostCreation();

    useEffect(() => {
        contentRef.current?.scrollTo({ top: contentRef.current.scrollHeight, behavior: "smooth" });
    }, [detectedItems]);
    
    const handleNext = async (skipConfirm = false) => {
        if (step === 1 && !image) {
            alert("⚠️ Please upload an image before proceeding.");
            return;
        }
        if (step === 1 && !detectedItems?.length && !skipConfirm) {
            setIsConfirmModalOpen(true);
            return;
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
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                message="No objects detected from the image. Captions may not include image-related descriptions. Do you want to continue?"
                onConfirm={() => {
                    setIsConfirmModalOpen(false);
                    handleNext(true);
                }}
                onClose={() => setIsConfirmModalOpen(false)}
            />

            <div className="flex flex-col h-full">
                {/* Modal Header */}
                <div className="w-full h-10 flex justify-between items-center p-2 border-b bg-white rounded-lg">
                    {step === 1 ? (
                        <button onClick={() => router.back()} className="text-gray-500 text-sm">Cancel</button>
                    ) : (
                        <button onClick={handleBack} className="text-gray-500 text-sm">&lt; Back</button>
                    )}
                    
                    <h2 className="text-lg font-semibold">New Post</h2>
                    
                    {step < 4 ? (
                        <button onClick={() => handleNext()} className="text-blue-600 text-sm font-medium">
                            Next
                        </button>
                    ) : (
                        <button onClick={() => {/* TODO */}} className="text-blue-600 text-sm font-medium">
                            Post
                        </button>
                    )}
                </div>

                {/* Main Content */}
                <div ref={contentRef} className="mx-auto p-2 w-full overflow-y-auto h-[calc(100%-40px)]">
                    {step === 1 && <ImageAnalyser />}
                    
                    {step === 2 && <PostDetails />} 

                    {step === 3 && <CaptionSelection />}
                    
                    {step === 4 && <PostReviewStep />}
                </div>            
            </div>
        </>
    );
}
