// src/app/(protected)/posts/components/captionEditor/SelectedCaptions.tsx
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import DraggableCaption from "./DraggableCaption";
import { usePostEditorContext } from "@/context/PostEditorContext";

interface SuggestedCaptionsProps {
  isSelected: boolean;
  setActiveSegment: (segment: "suggestedCaptions" | "platformCaption") => void;
}

export const SuggestedCaptions = ({
  isSelected,
  setActiveSegment,
}: SuggestedCaptionsProps) => {
  const { captionSuggestions } = usePostEditorContext();

  // State for tracking the currently edited caption index
  const [activeSuggestedIndex, setActiveSuggestedIndex] = useState<
    number | null
  >(null);

  return (
    <div
      className={`transition-all duration-300 bg-gray-100 rounded-lg ${
        isSelected ? "h-[calc(100%-70px)]" : "h-[40px]"
      }`}
    >
      <div
        className="p-3 border-b text-center cursor-pointer w-full h-[40px]"
        onClick={() => setActiveSegment("suggestedCaptions")}
      >
        <h2 className="text-sm font-bold text-gray-600">Suggested Captions</h2>
      </div>

      {isSelected && (
        <div
          className="p-3 overflow-y-auto"
          style={{ height: "calc(100% - 40px)" }}
        >
          <Swiper
            spaceBetween={10}
            slidesPerView={1.4}
            centeredSlides={true}
            freeMode={true}
            grabCursor={false}
            simulateTouch={false}
            mousewheel={{ forceToAxis: true }}
            modules={[Mousewheel]}
            className="p-3 h-full"
          >
            {captionSuggestions.length > 0 ? (
              captionSuggestions.map((caption, index) => (
                <SwiperSlide
                  key={`caption-${index}`}
                  className="w-auto flex item-stretch h-full"
                >
                  <DraggableCaption
                    id={`caption-${index}`}
                    text={caption}
                    index={index}
                    editingIndex={activeSuggestedIndex}
                    setEditingIndex={setActiveSuggestedIndex}
                  />
                </SwiperSlide>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center">
                No AI-generated captions available.
              </p>
            )}
          </Swiper>
        </div>
      )}
    </div>
  );
};
