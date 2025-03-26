"use client";

import Card from "@/components/common/CompactCard";
import { usePostCreation } from "@/context/PostCreationContext";

export default function AdditionalPrompt() {
    const { additionalPrompt, setAdditionalPrompt } = usePostCreation();
    
    return (
        <Card title="Anything else to add?">
            <textarea
                className="w-full text-sm p-2 border rounded-md focus:ring focus:ring-blue-300"
                placeholder="e.g. 'Happy hour 5-7PM', 'Closed on Sunday', 'New seasonal menu!'"
                value={additionalPrompt}
                onChange={(e) => setAdditionalPrompt(e.target.value)}
            />
        </Card>
    );
}