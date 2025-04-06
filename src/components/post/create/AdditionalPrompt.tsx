"use client";

import { CompactCard } from "@/components/common";
import { usePostEditorContext } from "@/context/PostEditorContext";

export default function AdditionalPrompt() {
  const { additionalPrompt, setAdditionalPrompt } = usePostEditorContext();

  return (
    <CompactCard title="Anything else to add?">
      <textarea
        className="w-full h-40 text-sm p-2 border rounded-md focus:ring focus:ring-blue-300"
        placeholder="e.g. 'Happy hour 5-7PM', 'Closed on Sunday', 'New seasonal menu!'"
        value={additionalPrompt}
        onChange={(e) => setAdditionalPrompt(e.target.value)}
      />
    </CompactCard>
  );
}
