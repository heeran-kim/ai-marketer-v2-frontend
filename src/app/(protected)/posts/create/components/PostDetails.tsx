"use client";

import { usePostCreation } from "@/context/PostCreationContext";
import Card from "@/components/common/CompactCard";
import { useEffect } from "react";
import { POSTS_API } from "@/constants/api";
import { PostCreationConfig } from "@/app/types/post";
import { useFetchData } from "@/hooks/useApi";
import { PlatformState } from "@/app/types/post";
import BusinessInfo from "./BusinessInfo";
import PostSettings from "./PostSettings";
import AdditionalPrompt from "./AdditionalPrompt";

export default function PostDetails() {
    const { setCustomisedBusinessInfo, setPostCategories, setPlatformStates } = usePostCreation();
    const { data } = useFetchData<PostCreationConfig>(POSTS_API.CREATE);

    useEffect(() => {
        if (data?.business) {
            setCustomisedBusinessInfo({
                "targetCustomers": data.business.targetCustomers,
                "vibe": data.business.vibe,
                "isUsingSalesData": data.business.hasSalesData ?? false,
            });
        }

        if (data?.postCategories) {
            setPostCategories(data.postCategories);
        }

        if (data?.linkedPlatforms) {
            const platformStates: PlatformState[] = data.linkedPlatforms.map((platform) => ({
                key: platform.key,
                label: platform.label,
                isSelected: false,
                caption: "",
            }));
            
            setPlatformStates(platformStates);
        }
    }, [data]);

    return (
        <Card title="Step 2: Tell AI About Your Post" description="Help AI understand your post by providing some details. Your selections will shape the generated captions!">
            <div className="space-y-1">
                <BusinessInfo />
                <PostSettings />
                <AdditionalPrompt />
            </div>
        </Card>
    );
}