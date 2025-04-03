// src/app/(protected)/posts/components/captionEditor/PlatformCaptionEditor.tsx
import { usePostEditorContext } from "@/context/PostEditorContext";
import { PLATFORM_OPTIONS } from "@/utils/icon";

interface PlatformCaptionEditorProps {
  activePlatform: (typeof PLATFORM_OPTIONS)[number] | undefined;
}

export const PlatformCaptionEditor = ({
  activePlatform,
}: PlatformCaptionEditorProps) => {
  const { platformStates, setPlatformCaption } = usePostEditorContext();

  return (
    <div className="p-3" style={{ height: "calc(100% - 70px)" }}>
      {platformStates
        .filter((platform) => platform.key === activePlatform)
        .map((platform) => (
          <div
            key={`platform-editor-${platform.key}`}
            className="p-3 border rounded-md h-full"
          >
            <h3 className="text-xs mb-1 font-medium">{platform.label}</h3>
            <textarea
              value={platform.caption || ""}
              className="border p-1 rounded-md w-full flex-grow text-sm h-[90%] min-h-[90%] resize-none whitespace-pre-line"
              style={{ overflowY: "auto" }}
              onChange={(e) =>
                setPlatformCaption?.(platform.key, e.target.value)
              }
            />
          </div>
        ))}
    </div>
  );
};
