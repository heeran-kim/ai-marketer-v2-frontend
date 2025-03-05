// src/app/posts/create/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/common/Card";
import ImageAnalyser from "./components/ImageAnalyser";
import BusinessInfo from "./components/BusinessInfo";
import PostSettings from "./components/PostSettings";
import UserCustomization from "./components/AdditionalPrompt";
import CaptionSuggestions from "./components/CaptionSuggestions";
import { useFetchData, mutateData } from "@/hooks/useApi";
import { PostCreationConfig, PlatformState, ImageAnalysisResponse } from "@/app/types/post";
import { AI_API, POSTS_API } from "@/constants/api";


export default function NewPost() {
    const [step, setStep] = useState(2);

    const { data, error, mutate } = useFetchData<PostCreationConfig>(POSTS_API.CREATE);

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const router = useRouter();

    useEffect(() => {
        if (data?.postCategories) {
            setPostCategories(data.postCategories);
        }

        if (data?.linkedPlatforms) {
            const platformStates: PlatformState[] = data.linkedPlatforms.map((platform) => ({
                key: platform.key,
                label: platform.label,
                isSelected: false,
                caption: "",
            }));
            
            setPlatformStates(platformStates);
        }
    }, [data]);

    const handleAnalyseImage = async () => {
        if (!image) {
            alert("Please select an image first!");
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

    const handleGenerateCaptions = async () => {
        if (!image) {
            alert("Please upload an image before generating AI captions.");
            return;
        }
        if (!detectedItems?.length) {
            const proceedWithoutImageDetails = confirm(
                "⚠️ No objects detected from the image. Captions may not include image-related descriptions. Do you want to continue?"
            );
            if (!proceedWithoutImageDetails) {
                return;
            }
        }
        setIsLoading(true);

         const res: {captions: string[]} | null = await mutateData<{captions: string[]}>(
            AI_API.CAPTION_GENERATE,
            "POST",
            {
                "businessInfo": data?.business,
                "postCategories": postCategories,
                "platformStates": platformStates,
                "customText": customText,
                "imgItems": detectedItems
            },
            false
        );
        if (!res) {
            alert("❌ Failed to fetch caption generation result or empty data.");
            setCaptions([]);
            setIsLoading(false);
            return;
        }
        setCaptions(res.captions);
        setIsLoading(false);
        setStep(3);
    };

    const handleConfirmPost = () => {
        if (platformStates.length === 0) {
            alert("Please select at least one platform to upload your post.");
            return;
        }
        setIsLoading(true);

        setTimeout(() => {
            setIsSuccess(true);
    
            setTimeout(() => {
                setIsLoading(false);
                router.push("/posts");
            }, 1500);
        }, 2000);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><p className="text-gray-500">Loading...</p></div>;
    }

    if (error || !data) {
        return (
            <div className="flex flex-col justify-center items-center h-64 text-red-500">
                <p>Failed to load data for creating post.</p>
                <button onClick={() => mutate()} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto flex gap-6 p-6">
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                        {isSuccess ? (
                            <>
                                <div className="w-12 h-12 flex items-center justify-center bg-green-500 text-white rounded-full text-3xl mb-3">
                                    ✔
                                </div>
                                <p className="text-lg font-semibold text-gray-700">Posted Successfully!</p>
                            </>
                        ) : (
                            <>
                                <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-3"></div>
                                <p className="text-lg font-semibold text-gray-700">Processing...</p>
                            </>
                        )}
                    </div>
                </div>
            )}

            {step == 2 ? (
                <div className="flex flex-col lg:flex-row items-start gap-6">
                    <ImageAnalyser 
                        image={image} 
                        setImage={setImage} 
                        detectedItems={detectedItems} 
                        setDetectedItems={setDetectedItems} 
                        handleAnalyseImage={handleAnalyseImage}
                    />
                    <div className="w-full lg:w-2/3 flex-grow space-y-6">
                        <Card title="Step 2: Tell AI About Your Post" description="Help AI understand your post by providing some details. Your selections will shape the generated captions!">
                            <div className="space-y-1">
                                <BusinessInfo business={data.business} />
                                <PostSettings
                                    postCategories={postCategories}
                                    setPostCategories={setPostCategories}
                                    platformStates={platformStates}
                                    setPlatformStates={setPlatformStates}
                                />
                                <UserCustomization customText={customText} setCustomText={setCustomText} />
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={handleGenerateCaptions}
                                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                                >
                                    Generate Captions
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>
            ):(
                <CaptionSuggestions
                    setStep={setStep}
                    platformStates={platformStates}
                    setPlatformStates={setPlatformStates}
                    handleConfirmPost={handleConfirmPost}
                    captions={captions}
                />
            )}
        </div>
    );
}