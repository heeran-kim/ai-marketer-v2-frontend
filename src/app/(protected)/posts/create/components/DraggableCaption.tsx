"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useDrag, DragPreviewImage } from "react-dnd";

interface DraggableCaptionProps {
    id: string;
    text: string;
    index: number;
    editingIndex: number | null;
    setEditingIndex: (index: number | null) => void;
    onEdit: (index: number, e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    setSwiperGrabCursor: (enabled: boolean) => void;
}

export default function DraggableCaption({
    id,
    text,
    index,
    editingIndex,
    setEditingIndex,
    onEdit,
    setSwiperGrabCursor,
}: DraggableCaptionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [dragItem, setDragItem] = useState({ id, text });
    const [isDragging, setIsDragging] = useState(false);
    let pressTimer: NodeJS.Timeout;

    const handleMouseDown = () => {
        console.log("handleMouseDown");
        pressTimer = setTimeout(() => {
            setIsDragging(true);
            setSwiperGrabCursor(false);
        }, 200);
    };

    const handleMouseUp = () => {
        clearTimeout(pressTimer);
        setIsDragging(false);
        setSwiperGrabCursor(true);
    };

    const handleMouseLeave = () => {
        clearTimeout(pressTimer);
    };

    useEffect(() => {
        setDragItem({ id, text });
    }, [text]);

    const [{ isDragging: dndDragging }, drag, preview] = useDrag(() => ({
        type: "CAPTION",
        item: () => {
            setIsDragging(true);
            setSwiperGrabCursor(false);
            return dragItem;
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        options: {
            dropEffect: "move",
        }
    }));

    useEffect(() => {
        if (!dndDragging) {
            setIsDragging(false);
            setSwiperGrabCursor(true);
        }
    }, [dndDragging]);

    useEffect(() => {
        if (ref.current) {
            drag(ref.current);
        }
    }, [drag]);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            
            if (target.tagName.toLowerCase() !== "textarea") {
                setEditingIndex(null);
            }
        };
    
        const handleScroll = () => {
            setEditingIndex(null);
        };
    
        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("wheel", handleScroll);
    
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("wheel", handleScroll);
        };
    }, [setEditingIndex]);

    const handleTouchStart = (e: React.TouchEvent) => {
        console.log("handleTouchStart");
        e.stopPropagation();
    };

    return (
        <>
        <DragPreviewImage
            connect={preview}
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjM0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxzdHlsZT5zdmcgeyBmaWxsOiBibHVlOyB9PC9zdHlsZT48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjMwIiByeD0iNiIgZmlsbD0iI0YwRjBGMCIvPjwvc3ZnPg==" 
        />

        <div
            ref={ref}
            className={`p-3 bg-white border rounded-lg cursor-grab transition text-sm h-full flex-grow ${
                isDragging ? "opacity-50" : "opacity-100"
            }`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onClick={() => setEditingIndex(index)}
        >
            {editingIndex === index ? (
                <textarea
                    value={text}
                    onChange={(e) => onEdit(index, e)}
                    autoFocus
                    className="border p-1 rounded-md w-full flex-grow text-sm h-full min-h-full resize-none whitespace-pre-line"
                    style={{ overflowY: "auto" }} 
                />
            ) : (
                <p
                    className="whitespace-pre-line overflow-y-auto flex-grow"
                >
                    {text}
                </p>
            )}
        </div>
        </>
    );
}