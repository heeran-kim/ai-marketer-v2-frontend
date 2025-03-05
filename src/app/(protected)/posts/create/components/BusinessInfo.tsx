"use client";

import Card from "@/components/common/CompactCard";
import { FaQuestionCircle } from "react-icons/fa";
import { usePostCreation } from "@/context/PostCreationContext";

export default function BusinessInfo() {
    const { hasSalesData, customisedBusinessInfo, setCustomisedBusinessInfo } = usePostCreation();

    const handleInputChange = (field: keyof typeof customisedBusinessInfo, value: string | boolean) => {
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
                        onChange={(e) => handleInputChange("targetCustomers", e.target.value)}
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
                        onChange={(e) => setCustomisedBusinessInfo({
                            ...customisedBusinessInfo,
                            isUsingSalesData: e.target.checked
                        })}
                        disabled={!hasSalesData}
                    />
                    <label htmlFor="useSalesData" className={`text-sm ${!hasSalesData ? "text-gray-400" : "text-gray-700 dark:text-gray-300"}`}>
                        {hasSalesData ? "Use Sales Data for AI captions" : "Sales data not available. Provide data in settings."}
                    </label>

                    <div className="relative inline-block">
                        <div className="group inline-block">
                            <FaQuestionCircle className="text-gray-500 hover:text-gray-700 cursor-pointer" />
                            <div className="absolute right-[-140px] top-full mt-2 w-64 p-2 text-xs bg-white border border-gray-300 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity translate-x-1/4">
                                <p className="font-medium">Sales Data Impact:</p>
                                <p><b>Without Sales Data:</b> &quot;Try our delicious steak! 🍽️&quot;</p>
                                <p><b>With Sales Data:</b> &quot;🔥 Best Seller! 500+ orders last week! Try our famous steak! 🍽️&quot;</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}