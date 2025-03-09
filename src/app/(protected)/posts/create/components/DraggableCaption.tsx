// src/app/(protected)/posts/create/components/DraggableCaption.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { useDrag } from "react-dnd";

export default function DraggableCaption({
    id,
    text,
    className = "",
}: {
    id: string;
    text: string;
    className?: string;
}) {
    const [isDragging, setIsDragging] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    let pressTimer: NodeJS.Timeout;

    const handleMouseDown = () => {
        pressTimer = setTimeout(() => {
            setIsDragging(true);
        }, 300);
    };

    const handleMouseUp = () => {
        clearTimeout(pressTimer);
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        clearTimeout(pressTimer);
    };

    const [{ isDragging: dndDragging }, drag] = useDrag(() => ({
        type: "CAPTION",
        item: { id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    useEffect(() => {
        if (ref.current) {
            drag(ref.current);
        }
    }, [drag]);

    return (
        <div
            ref={ref}
            className={`p-3 border rounded-lg cursor-move transition ${className} ${
                isDragging ? "opacity-50" : "opacity-100"
            }`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >
            {text}
        </div>
    );
}