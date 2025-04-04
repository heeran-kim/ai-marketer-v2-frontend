"use client";

import { usePostEditorContext } from "@/context/PostEditorContext";
import { useRef, useEffect, useState } from "react";
import { useDrag } from "react-dnd";

interface DraggableCaptionProps {
  id: string;
  text: string;
  index: number;
}

export default function DraggableCaption({
  id,
  text,
  index,
}: DraggableCaptionProps) {
  const { updateCaptionSuggestion } = usePostEditorContext();

  // State for tracking the currently edited caption index
  const [activeSuggestedIndex, setActiveSuggestedIndex] = useState<
    number | null
  >(null);

  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: "CAPTION",
      item: () => ({ id, text }),
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      options: {
        dropEffect: "move",
      },
    }),
    [text]
  );

  useEffect(() => {
    if (ref.current) {
      preview(ref.current);
    }
  }, [preview, ref]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (target.tagName.toLowerCase() !== "textarea") {
        setActiveSuggestedIndex(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setActiveSuggestedIndex]);

  return (
    <div
      ref={(node) => {
        if (node) {
          drag(node);
          ref.current = node;
        }
      }}
      className={`p-3 bg-white border rounded-lg cursor-grab transition text-sm h-full flex-grow  ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
      onClick={() => setActiveSuggestedIndex(index)}
    >
      {activeSuggestedIndex === index ? (
        <textarea
          value={text}
          onChange={(e) => {
            updateCaptionSuggestion(index, e.target.value);
          }}
          autoFocus
          className="border p-1 rounded-md w-full flex-grow text-sm h-full min-h-full resize-none whitespace-pre-line"
          style={{ overflowY: "auto" }}
        />
      ) : (
        <p className="overflow-y-auto h-full whitespace-pre-line flex-grow">
          {text}
        </p>
      )}
    </div>
  );
}
