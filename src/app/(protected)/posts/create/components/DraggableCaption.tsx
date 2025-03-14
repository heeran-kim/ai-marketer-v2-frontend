"use client";

import { useRef, useEffect, useCallback } from "react";
import { useDrag, DragPreviewImage } from "react-dnd";

interface DraggableCaptionProps {
    id: string;
    text: string;
    index: number;
    editingIndex: number | null;
    setEditingIndex: (index: number | null) => void;
    onEdit: (index: number, e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function DraggableCaption({
    id,
    text,
    index,
    editingIndex,
    setEditingIndex,
    onEdit,
}: DraggableCaptionProps) {
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
            }
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

    return (
        <>
        <DragPreviewImage
            connect={preview}
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjM0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxzdHlsZT5zdmcgeyBmaWxsOiBibHVlOyB9PC9zdHlsZT48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjMwIiByeD0iNiIgZmlsbD0iI0YwRjBGMCIvPjwvc3ZnPg==" 
        />

        <div
            ref={(node) => {
                if (node) {
                    drag(node);
                    ref.current = node;
                }
            }}
            className={`p-3 bg-white border rounded-lg cursor-grab transition text-sm h-full flex-grow ${
                isDragging ? "opacity-50" : "opacity-100"
            }`}
            onMouseDown={(e) => e.stopPropagation()}
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