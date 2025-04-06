"use client";

import { useDrop } from "react-dnd";
import { useRef, useEffect } from "react";

interface PlatformDropZoneProps {
    platformKey?: string;
    onDropCaption?: (platformKey: string, captionId: string) => void;
    isLinked: boolean;
    onClick: () => void;
    isSelected: boolean;
    children: React.ReactNode;
}

export default function PlatformDropZone({ platformKey, onDropCaption, isLinked, onClick, isSelected, children }: PlatformDropZoneProps) {
    const ref = useRef<HTMLDivElement>(null);

    const [{ isOver }, drop] = useDrop({
        accept: "CAPTION",
        drop: (item: { id: string, text: string }) => {
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
            className={`rounded-lg transition px-3 py-2 flex flex-1 justify-center items-center gap-2 text-sm border ${
                isLinked
                    ? isSelected
                            ? "bg-gray-100 border-gray-300"
                            : isOver
                                ? "border-blue-500 bg-blue-100"
                                : "border-gray-300 bg-white hover:bg-gray-100"
                            : "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed opacity-50"
            }`}
        >
            {children}
        </div>
    );
}