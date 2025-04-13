// src/app/(protected)/posts/components/captionEditor/PlatformSelect.tsx
import { usePostEditorContext } from "@/context/PostEditorContext";
import { getPlatformIcon, PLATFORM_OPTIONS, PlatformKey } from "@/utils/icon";
import PlatformDropZone from "./PlatformDropZone";

interface PlatformSelectProps {
  activePlatform: PlatformKey | undefined;
  setActivePlatform: (platform: PlatformKey) => void;
}

export const PlatformSelect = ({
  activePlatform,
  setActivePlatform,
}: PlatformSelectProps) => {
  const { platformStates, setPlatformCaption } = usePostEditorContext();

  return (
    <div className="p-3 w-full h-[60px]">
      <div className="flex justify-between items-center gap-3">
        {PLATFORM_OPTIONS.map((platform) => {
          const platformState = platformStates?.find((p) => p.key === platform);
          const isLinked = !!platformState;

          return (
            <PlatformDropZone
              key={`platform-${platform}`}
              platformKey={platform}
              isLinked={isLinked}
              onDropCaption={isLinked ? setPlatformCaption : undefined}
              onClick={() => setActivePlatform(platform)}
              isSelected={activePlatform === platform}
            >
              {getPlatformIcon(platform)}
            </PlatformDropZone>
          );
        })}
      </div>
    </div>
  );
};
