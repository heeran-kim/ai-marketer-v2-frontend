"use client";

import Card from "@/components/common/CompactCard";
import BusinessInfo from "./BusinessInfo";
import PostSettings from "./PostSettings";
import AdditionalPrompt from "./AdditionalPrompt";

export default function PostDetails() {
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