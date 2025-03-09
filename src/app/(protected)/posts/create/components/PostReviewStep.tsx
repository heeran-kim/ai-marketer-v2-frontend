"use client";

import Card from "@/components/common/CompactCard";
import ListCard from "@/components/common/ListCard";
import { usePostCreation } from "@/context/PostCreationContext";
// import { PostReview } from "@/app/types/post";

export default function PostReviewStep() {
    const { image, postCategories, platformStates } = usePostCreation();
    
    const categories = postCategories
        .filter(category => category.isSelected)
        .map(category => category.label);

    return (
        <Card
            title="Step 4: Review & Post"
            description="Review and Post."
        >
            <div className="space-y-4 mt-2">
                {platformStates.filter(platform => platform.isSelected).map((platformState) => (
                    <ListCard 
                        key={platformState.key} 
                        item={{
                            platform: platformState.key,
                            categories: categories,
                            caption: platformState.caption,
                            image: image ? URL.createObjectURL(image) : "",
                        }} 
                        type="postReview" 
                    />
                ))}
            </div>
        </Card>
    )
}