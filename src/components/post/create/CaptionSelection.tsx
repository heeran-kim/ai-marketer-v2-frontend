// src/app/(protected)/posts/create/components/CaptionSelection.tsx
"use client";

import { usePostEditor } from "@/context/PostEditorContext";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/mousewheel";
import DraggableCaption from "./DraggableCaption";
import PlatformDropZone from "./PlatformDropZone";
import { getPlatformIcon, PLATFORM_OPTIONS } from "@/utils/icon";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

export default function CaptionSelection() {
  const {
    captionSuggestions,
    platformStates,
    updateCaptionSuggestion,
    setCaption,
  } = usePostEditor();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedView, setSelectedView] = useState<
    "suggestedCaptions" | string
  >("suggestedCaptions");

  const handleSelectView = (view: "suggestedCaptions" | string) => {
    setSelectedView((prev) => (prev === view ? "suggestedCaptions" : view));
  };

  const handleEditCaption = (
    index: number,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (!updateCaptionSuggestion) return;
    updateCaptionSuggestion(index, e.target.value);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-full">
        {/* Selected Captions */}
        <div
          className={`transition-all duration-300 bg-gray-100 rounded-lg ${
            selectedView === "suggestedCaptions"
              ? "h-[calc(100%-70px)]"
              : "h-[40px]"
          }`}
        >
          <div
            className="p-3 border-b text-center cursor-pointer w-full h-[40px]"
            onClick={() => handleSelectView("suggestedCaptions")}
          >
            <h2 className="text-sm font-bold text-gray-600">
              Suggested Captions
            </h2>
          </div>

          {selectedView === "suggestedCaptions" && (
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
                      key={index}
                      className="w-auto flex item-stretch h-full"
                    >
                      <DraggableCaption
                        id={caption}
                        text={caption}
                        index={index}
                        editingIndex={editingIndex}
                        setEditingIndex={setEditingIndex}
                        onEdit={handleEditCaption}
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

        {/* Platform Selection */}
        <div
          className={`transition-all duration-300 ${
            selectedView !== "suggestedCaptions"
              ? "h-[calc(100%-40px)]"
              : "h-[40px]"
          }`}
        >
          <div className="p-3 w-full h-[70px]">
            <div className="flex justify-between items-center gap-3">
              {PLATFORM_OPTIONS.map((platform) => {
                const platformState = platformStates?.find(
                  (p) => p.key === platform
                );
                const isLinked = !!platformState;

                return (
                  <PlatformDropZone
                    key={platform}
                    platformKey={platform}
                    isLinked={isLinked}
                    onDropCaption={isLinked ? setCaption : undefined}
                    onClick={() => handleSelectView(platform)}
                    isSelected={selectedView === platform}
                  >
                    {getPlatformIcon(platform)}
                  </PlatformDropZone>
                );
              })}
            </div>
          </div>

          {selectedView !== "suggestedCaptions" && (
            <div className="p-3" style={{ height: "calc(100% - 70px)" }}>
              {platformStates
                .filter((platform) => platform.key === selectedView)
                .map((platform) => (
                  <div
                    key={platform.key}
                    className="p-3 border rounded-md h-full"
                  >
                    <h3 className="text-xs mb-1 font-medium">
                      {platform.label}
                    </h3>
                    <textarea
                      value={platform.caption || ""}
                      className="border p-1 rounded-md w-full flex-grow text-sm h-[90%] min-h-[90%] resize-none whitespace-pre-line"
                      style={{ overflowY: "auto" }}
                      onChange={(e) =>
                        setCaption?.(platform.key, e.target.value)
                      }
                    />
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
}
