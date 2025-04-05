"use client";

import Card from "@/components/common/CompactCard";
import { usePostEditorContext } from "@/context/PostEditorContext";

export default function BusinessInfo() {
  const { hasSalesData, customisedBusinessInfo, setCustomisedBusinessInfo } =
    usePostEditorContext();

  const handleInputChange = (
    field: keyof typeof customisedBusinessInfo,
    value: string | boolean
  ) => {
    setCustomisedBusinessInfo({ ...customisedBusinessInfo, [field]: value });
  };

  return (
    <Card title="Business Information">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium">🎯 Target Customers</label>
          <input
            type="text"
            className="w-full text-sm p-2 border rounded-md focus:ring focus:ring-blue-300"
            value={customisedBusinessInfo.targetCustomers}
            onChange={(e) =>
              handleInputChange("targetCustomers", e.target.value)
            }
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium">🌟 Vibe</label>
          <input
            type="text"
            className="w-full text-sm p-2 border rounded-md focus:ring focus:ring-blue-300"
            value={customisedBusinessInfo.vibe}
            onChange={(e) => handleInputChange("vibe", e.target.value)}
          />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="useSalesData"
            className="w-4 h-4"
            checked={customisedBusinessInfo.isUsingSalesData}
            onChange={(e) =>
              setCustomisedBusinessInfo({
                ...customisedBusinessInfo,
                isUsingSalesData: e.target.checked,
              })
            }
            disabled={!hasSalesData}
          />
          <label
            htmlFor="useSalesData"
            className={`text-sm ${
              !hasSalesData
                ? "text-gray-400"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {hasSalesData
              ? "Use Sales Data for AI captions"
              : "Sales data not available. Provide data in settings."}
          </label>
        </div>
      </div>
    </Card>
  );
}
