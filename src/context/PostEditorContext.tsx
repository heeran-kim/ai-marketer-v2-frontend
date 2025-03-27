// src/context/PostEditornContext.tsx
import { createContext, useContext, useState } from "react";
import {
  PostEditorConfig,
  PostEditorContextType,
  CustomisedBusinessInfo,
  PlatformState,
  PostCategory,
} from "@/app/types/post";
import { useEffect } from "react";
import { POSTS_API } from "@/constants/api";
import { useFetchData } from "@/hooks/dataHooks";

const PostEditorContext = createContext<PostEditorContextType | undefined>(
  undefined
);

export const PostEditorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [detectedItems, setDetectedItems] = useState<string[]>([]);
  const [hasSalesData, setHasSalesData] = useState<boolean>(false);
  const [customisedBusinessInfo, setCustomisedBusinessInfo] =
    useState<CustomisedBusinessInfo>({
      targetCustomers: "",
      vibe: "",
      isUsingSalesData: false,
    });
  const [postCategories, setPostCategories] = useState<PostCategory[]>([]);
  const [additionalPrompt, setAdditionalPrompt] = useState("");
  const [platformStates, setPlatformStates] = useState<PlatformState[]>([]);
  const [captionSuggestions, setCaptionSuggestions] = useState<string[]>([]);
  const { data } = useFetchData<PostEditorConfig>(POSTS_API.CREATE);

  useEffect(() => {
    if (data?.business) {
      setCustomisedBusinessInfo({
        targetCustomers: data.business.targetCustomers,
        vibe: data.business.vibe,
        isUsingSalesData: data.business.hasSalesData ?? false,
      });
    }

    if (data?.postCategories) {
      setPostCategories(data.postCategories);
    }

    if (data?.linkedPlatforms) {
      const platformStates: PlatformState[] = data.linkedPlatforms.map(
        (platform) => ({
          key: platform.key,
          label: platform.label,
          isSelected: true,
          caption: "",
        })
      );

      setPlatformStates(platformStates);
    }
  }, [data]);

  const setCaption = (platformKey: string, newCaption: string) => {
    setPlatformStates((prevStates) =>
      prevStates.map((state) =>
        state.key === platformKey ? { ...state, caption: newCaption } : state
      )
    );
  };

  const updateCaptionSuggestion = (index: number, editedCaption: string) => {
    setCaptionSuggestions((prevCaptions) => {
      const updatedCaptions = [...prevCaptions];
      updatedCaptions[index] = editedCaption;
      return updatedCaptions;
    });
  };

  const resetPostEditor = () => {
    setImage(null);
    setDetectedItems([]);
    setHasSalesData(false);
    setCustomisedBusinessInfo({
      targetCustomers: "",
      vibe: "",
      isUsingSalesData: false,
    });
    setPostCategories([]);
    setAdditionalPrompt("");
    setPlatformStates([]);
    setCaptionSuggestions([]);
  };

  return (
    <PostEditorContext.Provider
      value={{
        image,
        setImage,
        detectedItems,
        setDetectedItems,
        hasSalesData,
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
        updateCaptionSuggestion,
        resetPostEditor: resetPostEditor,
      }}
    >
      {children}
    </PostEditorContext.Provider>
  );
};

export const usePostEditor = () => {
  const context = useContext(PostEditorContext);
  if (!context) {
    throw new Error("usePostEditor must be used within a PostEditorProvider");
  }
  return context;
};
