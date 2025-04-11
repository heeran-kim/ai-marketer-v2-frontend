// src/app/(protected)/posts/components/captionEditor/SelectedCaptions.tsx
import { usePostEditorContext } from "@/context/PostEditorContext";
import { CaptionSwiper } from "./CaptionSwiper";
import { ErrorFallback } from "@/components/common";

interface SuggestedCaptionsProps {
  isExpanded: boolean;
  setActiveSegment: (segment: "suggestedCaptions" | "platformCaption") => void;
}

export const SuggestedCaptions = ({
  isExpanded,
  setActiveSegment,
}: SuggestedCaptionsProps) => {
  const { errorMessage, fetchCaptionSuggestions } = usePostEditorContext();

  return (
    <div
      className={`transition-all duration-300 bg-gray-100 rounded-lg ${
        isExpanded ? "h-[calc(100%-60px)]" : "h-[40px]"
      }`}
    >
      <div
        className="p-3 border-b text-center cursor-pointer w-full h-[40px]"
        onClick={() => setActiveSegment("suggestedCaptions")}
      >
        <h2 className="text-sm font-bold text-gray-600">Suggested Captions</h2>
      </div>

      {isExpanded && (
        <div
          className="p-3 overflow-y-auto"
          style={{ height: "calc(100% - 40px)" }}
        >
          {errorMessage ? (
            <ErrorFallback
              message={errorMessage}
              onRetry={fetchCaptionSuggestions}
            />
          ) : (
            <CaptionSwiper />
          )}
        </div>
      )}
    </div>
  );
};
