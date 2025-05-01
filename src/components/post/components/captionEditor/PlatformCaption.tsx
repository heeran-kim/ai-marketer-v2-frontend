// src/app/(protected)/posts/components/captionEditor/PlatformCaption.tsx
import { usePostEditorContext } from "@/context/PostEditorContext";
import { PlatformCaptionEditor } from "./PlatformCaptionEditor";
import { PlatformSelect } from "./PlatformSelect";
import { PostEditorMode } from "@/types/post";
import { useEffect, useState } from "react";
import { PlatformKey } from "@/utils/icon";

interface PlatformCaptionProps {
  isExpanded: boolean;
  setActiveSegment: (segment: "suggestedCaptions" | "platformCaption") => void;
}

export const PlatformCaption = ({
  isExpanded,
  setActiveSegment,
}: PlatformCaptionProps) => {
  const { mode, platformStates, captionGenerationSettings } =
    usePostEditorContext();
  const enableAI =
    mode === PostEditorMode.CREATE && captionGenerationSettings.method === "ai";
  const [activePlatform, setActivePlatform] = useState<
    PlatformKey | undefined
  >();

  useEffect(() => {
    // If collapsed (isExpanded is false), reset activePlatform
    if (!isExpanded) {
      setActivePlatform(undefined);
      return;
    }
    if (!enableAI) setActivePlatform(platformStates[0].key);
  }, [enableAI, isExpanded, mode]);

  // Set the segment to 'platformCaption' when activePlatform is selected
  useEffect(() => {
    if (activePlatform) setActiveSegment("platformCaption");
  }, [activePlatform, setActiveSegment]);

  return (
    <div
      className={`transition-all duration-300 ${
        isExpanded ? "h-[calc(100%-40px)]" : "h-[70px]"
      }`}
    >
      {mode === PostEditorMode.CREATE && (
        <PlatformSelect
          activePlatform={activePlatform}
          setActivePlatform={setActivePlatform}
        />
      )}
      {isExpanded && <PlatformCaptionEditor activePlatform={activePlatform} />}
    </div>
  );
};
