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
import { Promotion } from "@/types/promotion";
import { useEffect } from "react";
import { POSTS_API, PROMOTIONS_API } from "@/constants/api";
import { useFetchData } from "@/hooks/dataHooks";
import { toUtcFromLocalInput } from "@/utils/date";

const PostEditorContext = createContext<PostEditorContextType | undefined>(
  undefined
);

export const PostEditorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");

  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  const promoParam = searchParams.get("promotionId");

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

  const { data: postCreateFormData, isLoading: isLoadingPostCreateForm } =
    useFetchData<PostEditorConfig>(POSTS_API.CREATE);
  const { data: promoData, isLoading: isLoadingPromotion } =
    useFetchData<Promotion>(
      promoParam ? PROMOTIONS_API.DETAIL(promoParam) : null
    );

  useEffect(() => {
    if (!mode) return;
    if (step !== 2) return;
    setIsLoading(isLoadingPostCreateForm || isLoadingPromotion);
  }, [mode, step, isLoadingPostCreateForm, isLoadingPromotion]);

  useEffect(() => {
    if (mode !== PostEditorMode.CREATE) return;
    if (!postCreateFormData) return;
    if (promoParam && !promoData) return;

    if (postCreateFormData.business) {
      setCustomisedBusinessInfo({
        targetCustomers: postCreateFormData.business.targetCustomers,
        vibe: postCreateFormData.business.vibe,
        isUsingSalesData: postCreateFormData.business.hasSalesData ?? false,
      });
    }

    if (postCreateFormData.selectableCategories) {
      setSelectableCategories(postCreateFormData.selectableCategories);
    }

    if (postCreateFormData.linkedPlatforms) {
      const platformStates: PlatformState[] =
        postCreateFormData.linkedPlatforms.map((platform) => ({
          key: platform.key,
          label: platform.label,
          isSelected: true,
          caption: "",
        }));

      setPlatformStates(platformStates);
    }

    if (promoData) {
      setAdditionalPrompt(promoData.description);
    }
  }, [mode, promoParam, postCreateFormData, promoData]);

  useEffect(() => {
    if (mode !== PostEditorMode.EDIT) return;
    if (!selectedPost) return;
    if (!postCreateFormData) return;

    setUploadedImageUrl(selectedPost.image);

    setPlatformStates([
      {
        key: selectedPost.platform.key,
        label: selectedPost.platform.label,
        isSelected: true,
        caption: selectedPost.caption,
        scheduleDate: selectedPost.scheduledAt,
      },
    ]);

    const mappedCategories = postCreateFormData.selectableCategories.map(
      (category) => ({
        ...category,
        isSelected: selectedPost.selectedCategoryLabels.includes(
          category.label
        ),
      })
    );
    setSelectableCategories(mappedCategories);
  }, [mode, selectedPost, postCreateFormData]);

  useEffect(() => {
    if (modeParam == PostEditorMode.CREATE) setMode(PostEditorMode.CREATE);
    else if (modeParam == PostEditorMode.EDIT) setMode(PostEditorMode.EDIT);
    else setMode(null);
  }, [modeParam]);

  useEffect(() => {
    if (!mode) return;
    setStep(1);
  }, [mode]);

  const setPlatformCaption = (platformKey: string, newCaption: string) => {
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

  const updatePlatformScheduleDate = (platformKey: string, newDate: string) => {
    let formattedDate = "";
    if (newDate) {
      formattedDate = toUtcFromLocalInput(newDate);
    }

    setPlatformStates((prev) =>
      prev.map((platform) =>
        platform.key === platformKey
          ? { ...platform, scheduleDate: formattedDate }
          : platform
      )
    );
  };

  const resetPostEditor = () => {
    setStep(0);
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
        isLoading,
        setIsLoading,
        loadingMessage,
        setLoadingMessage,
        step,
        setStep,
        mode,
        selectedPost,
        setSelectedPost,
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
        setPlatformCaption: setPlatformCaption,
        updateCaptionSuggestion,
        updatePlatformScheduleDate,
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
