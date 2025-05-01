// src/app/(protected)/posts/components/captionEditor/PlatformCaptionEditor.tsx
import { usePostEditorContext } from "@/context/PostEditorContext";
import { PlatformKey } from "@/utils/icon";

interface PlatformCaptionEditorProps {
  activePlatform: PlatformKey | undefined;
}

export const PlatformCaptionEditor = ({
  activePlatform,
}: PlatformCaptionEditorProps) => {
  const { platformStates, setPlatformCaption } = usePostEditorContext();

  return (
    <div style={{ height: "calc(100% - 70px)" }}>
      {platformStates
        .filter((platform) => platform.key === activePlatform)
        .map((platform) => (
          <div
            key={`platform-editor-${platform.key}`}
            className="p-3 border rounded-md h-full"
          >
            <p className="text-xs mb-1 font-medium">{platform.label}</p>
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
