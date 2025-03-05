"use client";

import { useDraggable } from "@dnd-kit/core";

export default function DraggableCaption({ id, text }: { id: string; text: string }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
        data: { text },
    });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined
    };

    return (
        <p
            ref={setNodeRef}
            style={{
                ...style,
                whiteSpace: "pre-line",
            }}
            {...attributes}
            {...listeners}
            className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-sm cursor-grab"
        >
            {text}
        </p>
    );
}