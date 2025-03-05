import { useDroppable } from "@dnd-kit/core";

export default function PlatformDropZone({ platform, children }: { platform: string; children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({ id: platform });

    return (
        <div 
            ref={setNodeRef}
            className={`p-2 border rounded-md transition ${
                isOver ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-white"
            }`}
        >
            {children}
        </div>
    );
}