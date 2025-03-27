// src/context/PostEditornContext.tsx
import { createContext, useContext, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  PostEditorConfig,
  PostEditorContextType,
  CustomisedBusinessInfo,
  PlatformState,
  SelectableCategory,
  PostEditorMode,
  Post,
} from "@/types/post";
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
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");

  const [mode, setMode] = useState<PostEditorMode | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [detectedItems, setDetectedItems] = useState<string[]>([]);
  const [hasSalesData, setHasSalesData] = useState<boolean>(false);
  const [customisedBusinessInfo, setCustomisedBusinessInfo] =
    useState<CustomisedBusinessInfo>({
      targetCustomers: "",
      vibe: "",
      isUsingSalesData: false,
    });
  const [selectableCategories, setSelectableCategories] = useState<
    SelectableCategory[]
  >([]);
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

    if (data?.selectableCategories) {
      setSelectableCategories(data.selectableCategories);
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
  }, [data, mode]);

  useEffect(() => {
    if (modeParam == PostEditorMode.CREATE) setMode(PostEditorMode.CREATE);
    else if (modeParam == PostEditorMode.EDIT) setMode(PostEditorMode.EDIT);
    else setMode(null);
  }, [modeParam]);

  const initializeEditorFromPost = (post: Post) => {
    setUploadedImageUrl(post.image);
    setPlatformStates([
      {
        key: post.platform.key,
        label: post.platform.label,
        isSelected: true,
        caption: post.caption,
      },
    ]);
    if (post.selectedCategoryLabels) {
      const mappedCategories = selectableCategories.map((category) => ({
        ...category,
        isSelected: post.selectedCategoryLabels.includes(category.label),
      }));
      setSelectableCategories(mappedCategories);
      console.log(mappedCategories);
    }
  };

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
    setMode(null);
    setSelectedPost(null);
    setUploadedImageUrl(null);
    setImage(null);
    setDetectedItems([]);
    setHasSalesData(false);
    setCustomisedBusinessInfo({
      targetCustomers: "",
      vibe: "",
      isUsingSalesData: false,
    });
    setSelectableCategories([]);
    setAdditionalPrompt("");
    setPlatformStates([]);
    setCaptionSuggestions([]);
  };

  return (
    <PostEditorContext.Provider
      value={{
        mode,
        selectedPost,
        setSelectedPost,
        initializeEditorFromPost,
        uploadedImageUrl,
        setUploadedImageUrl,
        image,
        setImage,
        detectedItems,
        setDetectedItems,
        hasSalesData,
        customisedBusinessInfo,
        setCustomisedBusinessInfo,
        selectableCategories,
        setSelectableCategories,
        additionalPrompt,
        setAdditionalPrompt,
        platformStates,
        setPlatformStates,
        captionSuggestions,
        setCaptionSuggestions,
        setCaption,
        updateCaptionSuggestion,
        resetPostEditor,
      }}
    >
      {children}
    </PostEditorContext.Provider>
  );
};

export const usePostEditorContext = () => {
  const context = useContext(PostEditorContext);
  if (!context) {
    throw new Error(
      "usePostEditorContext must be used within a PostEditorProvider"
    );
  }
  return context;
};
