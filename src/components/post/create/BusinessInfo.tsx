"use client";

import { CompactCard } from "@/components/common";
import { usePostEditorContext } from "@/context/PostEditorContext";

export default function BusinessInfo() {
  const { captionGenerationInfo, setCaptionGenerationInfo } =
    usePostEditorContext();

  const handleInputChange = (
    field: keyof typeof captionGenerationInfo.businessInfo,
    value: string | boolean
  ) => {
    setCaptionGenerationInfo({
      ...captionGenerationInfo,
      businessInfo: {
        ...captionGenerationInfo.businessInfo,
        [field]: value,
      },
    });
  };

  return (
    <CompactCard title="Business Information">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium">Target Customers</label>
          <input
            type="text"
            className="w-full text-sm p-2 border rounded-md focus:ring focus:ring-blue-300"
            value={captionGenerationInfo.businessInfo.targetCustomers}
            onChange={(e) =>
              handleInputChange("targetCustomers", e.target.value)
            }
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium">Vibe</label>
          <input
            type="text"
            className="w-full text-sm p-2 border rounded-md focus:ring focus:ring-blue-300"
            value={captionGenerationInfo.businessInfo.vibe}
            onChange={(e) => handleInputChange("vibe", e.target.value)}
          />
        </div>
      </div>
    </CompactCard>
  );
}
