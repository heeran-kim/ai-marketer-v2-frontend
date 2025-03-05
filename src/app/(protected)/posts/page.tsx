"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Modal from "@/components/common/Modal";
import CreatePostPage from "./create/page";
import PostsDashboardContent from "./PostsDashboardContent";

export default function PostsDashboard() {
    const searchParams = useSearchParams();
    const isCreating = searchParams.get("create") === "true";
    const router = useRouter();

    return (
        <>
            {isCreating && (
                <Modal isOpen={true} onClose={() => router.push("/posts")}>
                    <CreatePostPage />
                </Modal>
            )}

            <Suspense fallback={<p>Loading...</p>}>
                <PostsDashboardContent />
            </Suspense>
        </>
    );
}