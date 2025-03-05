"use client";

import { usePostCreation } from "@/context/PostCreationContext";
import Card from "@/components/common/CompactCard";
import { useState } from "react";

export default function CaptionSelection({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
    const { captionSuggestions, setCaption } = usePostCreation();
    const [selectedCaption, setSelectedCaption] = useState<string | null>(null);
    const [editedCaption, setEditedCaption] = useState("");

    const handleSelectCaption = (caption: string) => {
        setSelectedCaption(caption);
        setEditedCaption(caption);
    };

    const handleEditCaption = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedCaption(e.target.value);
    };

    const handleConfirmCaption = () => {
        if (!selectedCaption) {
            alert("⚠️ Please select a caption before proceeding.");
            return;
        }
        setCaption("selected", editedCaption);
        onNext();
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-3 border-b bg-white text-center">
                <h2 className="text-sm font-medium text-gray-600">Suggested Captions</h2>
            </div>

            <div className="overflow-x-auto flex space-x-4 py-3 px-4">
                {captionSuggestions.length > 0 ? (
                    captionSuggestions.map((caption, index) => (
                        <Card
                            key={index}
                            title={caption}
                            description="Swipe to see more"
                            onClick={() => handleSelectCaption(caption)}
                            className={`cursor-pointer transition-all ${selectedCaption === caption ? "bg-blue-50 border-blue-500" : "border-gray-300"}`}
                        />
                    ))
                ) : (
                    <p className="text-gray-500 text-sm">No AI-generated captions available. Try generating again.</p>
                )}
            </div>

            <div className="p-3 border-t bg-white">
                <h3 className="text-sm font-medium">Selected Caption</h3>
                <input
                    type="text"
                    value={editedCaption}
                    onChange={handleEditCaption}
                    className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300 mt-2"
                />

                <div className="flex justify-between mt-4">
                    <button onClick={onBack} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">
                        Back
                    </button>

                    <button onClick={handleConfirmCaption} className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}