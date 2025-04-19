"use client";

import { useDrop } from "react-dnd";
import { useRef, useEffect } from "react";
import { platformButtonStyles } from "@/components/styles";

interface PlatformDropZoneProps {
  platformKey?: string;
  onDropCaption?: (platformKey: string, captionId: string) => void;
  isLinked: boolean;
  onClick: () => void;
  isSelected: boolean;
  children: React.ReactNode;
}

export default function PlatformDropZone({
  platformKey,
  onDropCaption,
  isLinked,
  onClick,
  isSelected,
  children,
}: PlatformDropZoneProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop({
    accept: "CAPTION",
    drop: (item: { id: string; text: string }) => {
      if (isLinked && onDropCaption) {
        console.log(item.id);
        onDropCaption(platformKey ?? "", item.text);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver() && isLinked,
    }),
  });

  useEffect(() => {
    if (isLinked && ref.current) {
      drop(ref.current);
    }
  }, [isLinked, drop]);

  return (
    <div
      ref={ref}
      onClick={isLinked ? onClick : undefined}
      className={platformButtonStyles.getClassNames(
        isLinked,
        isSelected,
        isOver
      )}
    >
      {children}
    </div>
  );
}
