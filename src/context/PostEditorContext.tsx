// src/context/PostEditornContext.tsx
import {
  useReducer,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { mutate } from "swr";

import {
  PostEditorContextType,
  PlatformState,
  SelectableCategory,
  PostEditorMode,
  Post,
  PlatformScheduleMap,
  CaptionGenerationSettings,
  RESET_CAPTION_GENERATION_SETTINGS,
  CaptionGenerationInfo,
  RESET_CAPTION_GENERATION_INFO,
  StepState,
  StepNames,
  StepAction,
} from "@/types/post";
import { Promotion } from "@/types/promotion";
import { ScheduleType } from "@/constants/posts";

import { AI_API, POSTS_API, PROMOTIONS_API } from "@/constants/api";
import { apiClient, useFetchData } from "@/hooks/dataHooks";
import { PostEditorConfigDto } from "@/types/dto";

import { formatDateRange, toUtcFromLocalInput } from "@/utils/date";
import { useNotification } from "@/context/NotificationContext";

const PostEditorContext = createContext<PostEditorContextType | undefined>(
  undefined
);

const stepReducer = (state: StepState, action: StepAction): StepState => {
  switch (action.type) {
    case "NEXT": {
      const nextStepNumber = Math.min(
        state.stepNumber + 1,
        StepNames.length - 1
      );

      return {
        stepNumber: nextStepNumber,
        stepName: StepNames[nextStepNumber],
      };
    }
    case "BACK": {
      const prevStepNumber = Math.max(state.stepNumber - 1, 1);

      return {
        stepNumber: prevStepNumber,
        stepName: StepNames[prevStepNumber],
      };
    }
    case "INIT_FOR_CREATE":
      return { stepNumber: 1, stepName: StepNames[1] }; // Start at CAPTION_METHOD_SELECTION
    case "INIT_FOR_EDIT":
      return { stepNumber: 2, stepName: StepNames[2] }; // Start at IMAGE_SELECTION
    case "RESET":
      return { stepNumber: 0, stepName: StepNames[0] }; // Reset to RESET step
    default:
      return state;
  }
};

export const PostEditorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  const promoParam = searchParams.get("promotionId");

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { showNotification } = useNotification();

  const [stepState, dispatch] = useReducer(stepReducer, {
    stepNumber: 0,
    stepName: StepNames[0],
  });

  const [mode, setMode] = useState<PostEditorMode | null>(null);

  const [selectedAspectRatio, setAspectRatio] = useState("4/5");

  const [captionGenerationInfo, setCaptionGenerationInfo] =
    useState<CaptionGenerationInfo>(RESET_CAPTION_GENERATION_INFO);
  const [menuItems, setMenuItems] = useState<Record<string, string>>({});

  const [selectableCategories, setSelectableCategories] = useState<
    SelectableCategory[]
  >([]);
  const [platformStates, setPlatformStates] = useState<PlatformState[]>([]);
  const [platformSchedule, setPlatformSchedule] = useState<PlatformScheduleMap>(
    {}
  );
  const [captionSuggestions, setCaptionSuggestions] = useState<string[]>([]);
  const [captionGenerationSettings, setCaptionGenerationSettings] =
    useState<CaptionGenerationSettings>(RESET_CAPTION_GENERATION_SETTINGS);

  // For Edit Mode
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  // Fetch data for post creation form for Create mode
  const { data: postCreateFormData, isLoading: isLoadingPostCreateForm } =
    useFetchData<PostEditorConfigDto>(POSTS_API.CREATE);

  // Fetch data for selected promotion for Create mode
  const { data: promoData, isLoading: isLoadingPromotion } =
    useFetchData<Promotion>(
      promoParam ? PROMOTIONS_API.DETAIL(promoParam) : null
    );

  useEffect(() => {
    if (!mode) return;
    if (stepState.stepName !== "POST_DETAILS") return;
    setIsLoading(isLoadingPostCreateForm || isLoadingPromotion);
  }, [mode, isLoadingPostCreateForm, isLoadingPromotion, stepState.stepName]);

  useEffect(() => {
    if (mode !== PostEditorMode.CREATE) return;
    if (!postCreateFormData) return;
    if (promoParam && !promoData) return;

    if (postCreateFormData.business) {
      setCaptionGenerationInfo((prev) => ({
        ...prev,
        businessInfo: {
          targetCustomers: postCreateFormData.business.targetCustomers,
          vibe: postCreateFormData.business.vibe,
        },
      }));
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

    if (postCreateFormData.business.squareConnected) {
      setCaptionGenerationSettings({
        ...captionGenerationSettings,
        includeItemDescription: postCreateFormData.business.items
          ? true
          : false,
      });
      if (postCreateFormData.business.items) {
        setMenuItems(postCreateFormData.business.items);
      }
    }

    if (promoData) {
      const dateRange = formatDateRange(promoData.startDate, promoData.endDate);
      setCaptionGenerationInfo((prev) => ({
        ...prev,
        additionalPrompt: `Promotion date: ${dateRange}\n${promoData.description}`,
      }));

      if (promoData.productNames && promoData.productNames.length > 0) {
        const menuItems = postCreateFormData.business.items;
        const itemInfo = promoData.productNames.map((name) => {
          return {
            name: name,
            description: menuItems ? menuItems[name.toLowerCase()] : "",
          };
        });
        setCaptionGenerationInfo((prev) => ({
          ...prev,
          itemInfo: itemInfo,
        }));
      }
    }
  }, [mode, promoParam, postCreateFormData, promoData]);

  useEffect(() => {
    if (mode !== PostEditorMode.EDIT) return;
    if (!selectedPost) return;
    if (!postCreateFormData) return;

    setUploadedImageUrl(selectedPost.image);
    setAspectRatio(selectedPost.aspectRatio);

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
    if (modeParam === PostEditorMode.CREATE) setMode(PostEditorMode.CREATE);
    else if (modeParam === PostEditorMode.EDIT) setMode(PostEditorMode.EDIT);
    else setMode(null);
  }, [modeParam]);

  useEffect(() => {
    if (!mode) return;
    if (mode === PostEditorMode.CREATE) dispatch({ type: "INIT_FOR_CREATE" });
    else if (mode === PostEditorMode.EDIT) dispatch({ type: "INIT_FOR_EDIT" });
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
    dispatch({ type: "RESET" });
    setCaptionGenerationSettings(RESET_CAPTION_GENERATION_SETTINGS);
    setMode(null);
    setSelectedPost(null);
    setUploadedImageUrl(null);
    setCaptionGenerationInfo(RESET_CAPTION_GENERATION_INFO);
    setSelectableCategories([]);
    setCaptionSuggestions([]);
    setLoadingMessage("Loading...");
    setErrorMessage(null);
  };

  const fetchCaptionSuggestions = async () => {
    setIsLoading(true);
    setLoadingMessage("Generating captions...");

    const formData = new FormData();

    // Append categories, business info, item info, additional prompt, etc.
    formData.append(
      "categories",
      JSON.stringify(
        selectableCategories
          .filter((cat) => cat.isSelected)
          .map((cat) => cat.label)
      )
    );
    formData.append(
      "businessInfo",
      JSON.stringify({
        target_customers: captionGenerationInfo.businessInfo.targetCustomers,
        vibe: captionGenerationInfo.businessInfo.vibe,
      })
    );
    formData.append("itemInfo", JSON.stringify(captionGenerationInfo.itemInfo));
    formData.append("additionalPrompt", captionGenerationInfo.additionalPrompt);

    try {
      const res = await apiClient.post<{ captions: string[] }>(
        AI_API.CAPTION_GENERATE,
        formData,
        {},
        true
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

  const createPost = async () => {
    setIsLoading(true);
    setLoadingMessage("Creating posts...");

    try {
      // Derive selected category IDs from selectableCategories
      const selectedCategories = selectableCategories
        .filter((cat) => cat.isSelected)
        .map((cat) => cat.id);

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
        if (captionGenerationInfo.image) {
          formData.append("image", captionGenerationInfo.image);
        } else {
          showNotification(
            "error",
            "Failed to upload the image. Please try again."
          );
        }

        // Add caption
        formData.append("caption", platform.caption);

        // Add categories as an array
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

        if (selectedAspectRatio) {
          formData.append("aspect_ratio", selectedAspectRatio);
        }

        // Send the request to create the post
        try {
          const response = await apiClient.post(
            POSTS_API.LIST,
            formData,
            {},
            true
          );
          console.log(response);
        } catch (error) {
          console.error("Error creating post:", error);
          showNotification("error", "Failed to create post. Please try again.");
          return;
        }
      }

      // Show success notification
      showNotification("success", "Posts created successfully!");

      // Trigger global SWR revalidation
      await mutate(POSTS_API.LIST);
      resetPostEditor();
      router.back();
    } catch (error) {
      console.error("Error creating posts:", error);
      showNotification("error", "Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePost = async () => {
    if (!selectedPost) return;
    setIsLoading(true);
    setLoadingMessage("Updating post...");
    try {
      // Create FormData to handle file uploads
      const formData = new FormData();

      // Add caption
      formData.append("caption", platformStates[0]?.caption || "");

      // Derive selected category labels from selectableCategories
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
      if (captionGenerationInfo.image) {
        formData.append("image", captionGenerationInfo.image);
      }

      if (selectedAspectRatio) {
        formData.append("aspect_ratio", selectedAspectRatio);
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

      // Trigger global SWR revalidation
      await mutate(POSTS_API.LIST);
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
        stepState,
        dispatch,
        mode,
        selectedPost,
        setSelectedPost,
        uploadedImageUrl,
        setUploadedImageUrl,
        menuItems,
        captionGenerationInfo,
        setCaptionGenerationInfo,
        platformStates,
        setPlatformStates,
        platformSchedule,
        captionSuggestions,
        setCaptionSuggestions,
        setPlatformCaption,
        updateCaptionSuggestion,
        updatePlatformScheduleType,
        updatePlatformScheduleDate,
        captionGenerationSettings,
        setCaptionGenerationSettings,
        selectableCategories,
        setSelectableCategories,
        resetPostEditor,
        fetchCaptionSuggestions,
        createPost,
        updatePost,
        selectedAspectRatio,
        setAspectRatio,
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
