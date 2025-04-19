// src/app/(protected)/posts/components/captionEditor/CaptionEditor.tsx
"use client";

import { useState } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { usePostEditorContext } from "@/context/PostEditorContext";
import { SuggestedCaptions } from "./SuggestedCaptions";
import { PostEditorMode } from "@/types/post";
import { PlatformCaption } from "./PlatformCaption";

export default function CaptionEditor() {
  const { mode, captionGenerationSettings } = usePostEditorContext();
  const enableAI =
    mode === PostEditorMode.CREATE && captionGenerationSettings.method === "ai";

  const [activeSegment, setActiveSegment] = useState<
    "suggestedCaptions" | "platformCaption"
  >(enableAI ? "suggestedCaptions" : "platformCaption");

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full">
        {enableAI && (
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
