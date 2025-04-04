// src/app/(protected)/posts/components/captionEditor/CaptionEditor.tsx
"use client";

import { useState } from "react";
import "swiper/css";
import "swiper/css/mousewheel";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { usePostEditorContext } from "@/context/PostEditorContext";
import { SuggestedCaptions } from "./SuggestedCaptions";
import { PostEditorMode } from "@/types/post";
import { PlatformCaption } from "./PlatformCaption";

export default function CaptionEditor() {
  const { mode } = usePostEditorContext();
  const isCreating = mode === PostEditorMode.CREATE;

  const [activeSegment, setActiveSegment] = useState<
    "suggestedCaptions" | "platformCaption"
  >(isCreating ? "suggestedCaptions" : "platformCaption");

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-full">
        {isCreating && (
          <SuggestedCaptions
            isExpanded={activeSegment === "suggestedCaptions"}
            setActiveSegment={setActiveSegment}
          />
        )}

        <PlatformCaption
          isExpanded={activeSegment === "platformCaption"}
          setActiveSegment={setActiveSegment}
        />
      </div>
    </DndProvider>
  );
}
