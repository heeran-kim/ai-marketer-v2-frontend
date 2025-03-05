import { createContext, useContext, useState } from "react";
import { PostCreationContextType, CustomisedBusinessInfo, PlatformState, PostCategory } from "@/app/types/post";

const PostCreationContext = createContext<PostCreationContextType | undefined>(undefined);

export const PostCreationProvider = ({ children }: { children: React.ReactNode }) => {
    const [image, setImage] = useState<File | null>(null);
    const [detectedItems, setDetectedItems] = useState<string[]>([]);
    const [customisedBusinessInfo, setCustomisedBusinessInfo] = useState<CustomisedBusinessInfo>({
        targetCustomers: "",
        vibe: "",
        isUsingSalesData: false,
    });
    const [postCategories, setPostCategories] = useState<PostCategory[]>([]);
    const [additionalPrompt, setAdditionalPrompt] = useState("");
    const [platformStates, setPlatformStates] = useState<PlatformState[]>([]);
    const [captionSuggestions, setCaptionSuggestions] = useState<string[]>([]);

    const setCaption = (platformKey: string, newCaption: string) => {
        setPlatformStates((prevStates) =>
            prevStates.map((state) =>
                state.key === platformKey ? { ...state, caption: newCaption } : state
            )
        );
    };

    const resetPostCreation = () => {
        setImage(null);
        setDetectedItems([]);
        setCustomisedBusinessInfo({ targetCustomers: "", vibe: "", isUsingSalesData: false });
        setPostCategories([]);
        setAdditionalPrompt("");
        setPlatformStates([]);
        setCaptionSuggestions([]);
    };

    return (
        <PostCreationContext.Provider
            value={{
                image,
                setImage,
                detectedItems,
                setDetectedItems,
                customisedBusinessInfo,
                setCustomisedBusinessInfo,
                postCategories,
                setPostCategories,
                additionalPrompt,
                setAdditionalPrompt,
                platformStates,
                setPlatformStates,
                captionSuggestions,
                setCaptionSuggestions,
                setCaption,
                resetPostCreation,
            }}
        >
            {children}
        </PostCreationContext.Provider>
    );
};

export const usePostCreation = () => {
    const context = useContext(PostCreationContext);
    if (!context) {
        throw new Error("usePostCreation must be used within a PostCreationProvider");
    }
    return context;
};