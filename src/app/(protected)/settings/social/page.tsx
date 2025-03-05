"use client";

import { useState } from "react";
import Card from "@/components/common/Card";
import { platformConfig, getPlatformIcon } from "@/utils/icon";

export default function SocialMediaSettings() {
    const [businessInfo, setBusinessInfo] = useState({
        socials: Object.keys(platformConfig).reduce((acc, platform) => {
            acc[platform] = "";
            return acc;
        }, {} as Record<string, string>),
    });

    const handleSocialChange = (platform: string, value: string) => {
        setBusinessInfo((prev) => ({
            ...prev,
            socials: { ...prev.socials, [platform]: value },
        }));
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {Object.entries(platformConfig).map(([name]) => (
                <Card
                    key={name}
                    title={name.charAt(0).toUpperCase() + name.slice(1)}
                    description={`Enter your ${name} username to link your account.`}
                    restriction="Please enter your username only."
                >
                    <div className="flex items-center border rounded-md overflow-hidden">
                        <span className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-200">
                            {getPlatformIcon(name, "w-5 h-5")}
                            {`${name}.com/`}
                        </span>
                        <input
                            type="text"
                            value={businessInfo.socials[name]}
                            onChange={(e) => handleSocialChange(name, e.target.value)}
                            className="flex-1 text-sm p-2 border-l focus:ring focus:ring-blue-300"
                            placeholder="yourusername"
                        />
                    </div>
                </Card>
            ))}
        </div>
    );
}