// src/context/PostEditornContext.tsx
import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {
  PostEditorConfig,
  PostEditorContextType,
  CustomisedBusinessInfo,
  PlatformState,
  SelectableCategory,
  PostEditorMode,
  Post,
  PlatformScheduleMap,
} from "@/types/post";
import { Promotion } from "@/types/promotion";
import { useEffect } from "react";
import { AI_API, POSTS_API, PROMOTIONS_API } from "@/constants/api";
import { apiClient, useFetchData } from "@/hooks/dataHooks";
import { formatDateRange, toUtcFromLocalInput } from "@/utils/date";
import { KeyedMutator } from "swr";
import { PostDto } from "@/types/dto";
import { useNotification } from "@/context/NotificationContext";
import { ScheduleType } from "@/constants/posts";

const PostEditorContext = createContext<PostEditorContextType | undefined>(
  undefined
);

export const PostEditorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { showNotification } = useNotification();

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
  const [platformSchedule, setPlatformSchedule] = useState<PlatformScheduleMap>(
    {}
  );
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
          caption: "",
        }));

      const platformSchedule: PlatformScheduleMap =
        postCreateFormData.linkedPlatforms.reduce((acc, platform) => {
          acc[platform.key] = {
            scheduleType: "instant",
            scheduleDate: null,
          };
          return acc;
        }, {} as PlatformScheduleMap);

      setPlatformStates(platformStates);
      setPlatformSchedule(platformSchedule);
    }

    if (promoData) {
      const dateRange = formatDateRange(promoData.startDate, promoData.endDate);
      setAdditionalPrompt(
        "Promotion date: " + dateRange + "\n" + promoData.description
      );
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
        caption: selectedPost.caption,
      },
    ]);

    setPlatformSchedule({
      [selectedPost.platform.key]: {
        scheduleType:
          selectedPost.status === "Scheduled" ? "scheduled" : "instant",
        scheduleDate:
          selectedPost.status === "Scheduled" ? selectedPost.scheduledAt : null,
      },
    });

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

  const updatePlatformScheduleType = (
    platformKey: string,
    newType: ScheduleType
  ) => {
    setPlatformSchedule((prev) => ({
      ...prev,
      [platformKey]: {
        ...prev[platformKey],
        scheduleType: newType,
      },
    }));
  };

  const updatePlatformScheduleDate = (platformKey: string, newDate: string) => {
    let formattedDate = "";
    if (newDate) {
      formattedDate = toUtcFromLocalInput(newDate);
    }

    setPlatformSchedule((prev) => ({
      ...prev,
      [platformKey]: {
        ...prev[platformKey],
        scheduleDate: formattedDate,
      },
    }));
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
    setLoadingMessage("Loading...");
    setErrorMessage(null);
  };

  const fetchCaptionSuggestions = async () => {
    setIsLoading(true);
    setLoadingMessage("Generating captions...");

    try {
      const res = await apiClient.post<{ captions: string[] }>(
        AI_API.CAPTION_GENERATE,
        {
          imgItems: detectedItems,
          businessInfo: customisedBusinessInfo,
          postCategories: selectableCategories,
          platformStates: platformStates,
          customText: additionalPrompt,
        },
        {},
        false // isFormData flag
      );

      if (!res?.captions?.length) {
        setErrorMessage(
          "Failed to fetch caption generation result or empty data. Please try again."
        );
        setCaptionSuggestions([]);
        return;
      }
      setErrorMessage(null);
      setCaptionSuggestions(res.captions);
    } catch (error) {
      console.log(error);
      setErrorMessage(
        "Failed to fetch caption generation result or empty data. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async (mutate: KeyedMutator<{ posts: PostDto[] }>) => {
    setIsLoading(true);
    setLoadingMessage("Creating posts...");

    try {
      // Filter platforms based on scheduleType, skipping those marked as "dontPost"
      const platformsToPost = platformStates.filter(
        (platform) =>
          platformSchedule[platform.key]?.scheduleType !== "dontPost"
      );

      // For each selected platform, create a post
      for (const platform of platformsToPost) {
        // Create FormData to handle file uploads
        const formData = new FormData();

        // Add platform
        formData.append("platform", platform.key);

        // Add image
        if (image) {
          formData.append("image", image);
        } else {
          showNotification(
            "error",
            "Failed to upload the image. Please try again."
          );
        }

        // Add caption
        formData.append("caption", platform.caption);

        // Add categories as an array
        const selectedCategories = selectableCategories
          .filter((cat) => cat.isSelected)
          .map((cat) => cat.id);
        formData.append("categories", JSON.stringify(selectedCategories));

        // Add scheduled time if available and it's a scheduled post
        const scheduleDate =
          platformSchedule[platform.key]?.scheduleDate ?? null;
        if (scheduleDate) {
          formData.append("scheduled_at", scheduleDate);
        }

        // Add promotion ID if posting through a promotion
        if (promoData) {
          formData.append("promotion", promoData.id);
        }

        // Send the request to create the post
        await apiClient.post(POSTS_API.LIST, formData, {}, true);
      }

      // Show success notification
      showNotification("success", "Posts created successfully!");

      // Refresh the data and redirect
      await mutate();
      resetPostEditor();
      router.back();
    } catch (error) {
      console.error("Error creating posts:", error);
      showNotification("error", "Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePost = async (mutate: KeyedMutator<{ posts: PostDto[] }>) => {
    if (!selectedPost) return;
    setIsLoading(true);
    setLoadingMessage("Updating post...");
    try {
      // Create FormData to handle file uploads
      const formData = new FormData();

      // Add caption
      formData.append("caption", platformStates[0]?.caption || "");

      // Add categories as an array
      const selectedCategories = selectableCategories
        .filter((cat) => cat.isSelected)
        .map((cat) => cat.label);

      // Add each category as a separate form field with the same name
      selectedCategories.forEach((category) => {
        formData.append("categories", category);
      });

      // Add scheduled time if available and it's a scheduled post
      const scheduleDate =
        platformSchedule[platformStates[0].key]?.scheduleDate ?? null;
      if (scheduleDate) {
        formData.append("scheduled_at", scheduleDate);
      } else {
        formData.append("scheduled_at", "");
      }

      // Add image if a new one was uploaded
      if (image) {
        formData.append("image", image);
      }

      // Use the PATCH endpoint to update the post
      await apiClient.patch(
        POSTS_API.UPDATE(selectedPost.id),
        formData,
        {},
        true // isFormData flag
      );

      // Show success notification
      showNotification("success", "Post updated successfully!");

      // Refresh the data and redirect
      await mutate();
      resetPostEditor();
      router.back();
    } catch (error) {
      console.error("Error updating post:", error);
      showNotification("error", "Failed to update post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PostEditorContext.Provider
      value={{
        isLoading,
        setIsLoading,
        loadingMessage,
        setLoadingMessage,
        errorMessage,
        setErrorMessage,
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
        platformSchedule,
        captionSuggestions,
        setCaptionSuggestions,
        setPlatformCaption,
        updateCaptionSuggestion,
        updatePlatformScheduleType,
        updatePlatformScheduleDate,
        resetPostEditor,
        fetchCaptionSuggestions,
        createPost,
        updatePost,
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
