// src/app/(protected)/posts/create/components/PlatformDropZone.tsx
import { useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import { usePostCreation } from "@/context/PostCreationContext";

export default function PlatformDropZone({ platform, children }: { platform: string; children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const { setCaption } = usePostCreation();

    const [{ isOver }, drop] = useDrop(() => ({
        accept: "CAPTION",
        drop: (item: { id: string }) => {
            setCaption(platform, item.id);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));

    useEffect(() => {
        if (ref.current) {
            drop(ref.current);
        }
    }, [drop]);

    return (
        <div 
            ref={ref}
            className={`p-2 border rounded-md transition ${
                isOver ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-white"
            }`}
        >
            {children}
        </div>
    );
}