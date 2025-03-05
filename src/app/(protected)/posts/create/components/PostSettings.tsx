"use client";

import Card from "@/components/common/CompactCard";
import { getPlatformIcon } from "@/utils/icon";
import { PLATFORM_OPTIONS } from "@/utils/icon";
import { usePostCreation } from "@/context/PostCreationContext";

export default function PostSettings() {
    const { postCategories, setPostCategories, platformStates, setPlatformStates } = usePostCreation();
    
    const handleCategoryToggle = (categoryLabel: string) => {
        setPostCategories(postCategories.map((category) =>
                category.label === categoryLabel ? { ...category, selected: !category.selected } : category
            )
        );
        console.log(postCategories);
    };

    const handlePlatformToggle = (platformLabel: string) => {
        setPlatformStates(platformStates.map((platform) =>
            platform.label === platformLabel ? { ...platform, selected: !platform.isSelected } : platform
        ));
        console.log(platformStates);
    };

    return (
        <Card title="Post Settings">
            <div className="space-y-3">
                <div>
                    <p className="text-sm font-medium mb-1">📌 Select Purpose:</p>
                    <div className="flex flex-wrap gap-2">
                        {postCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryToggle(category.label)}
                                className={`px-3 py-1.5 rounded-md border text-sm transition ${
                                    category.selected ? "bg-gray-300" : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                                }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-sm font-medium mb-1">🌍 Choose Platforms:</p>
                    <div className="flex flex-wrap gap-2">
                        {PLATFORM_OPTIONS.map((platform: string) => {
                            const platformState = platformStates.find((p) => p.label === platform);
                            return (
                                <button
                                    key={platform}
                                    onClick={() => handlePlatformToggle(platform)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm transition ${
                                        platformState
                                            ? platformState.isSelected
                                                ? "bg-gray-300"
                                                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                                            : "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed"
                                    }`}
                                >
                                    {getPlatformIcon(platform)}
                                    {platform}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </Card>
    );
}