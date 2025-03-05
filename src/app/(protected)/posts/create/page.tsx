"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { PostCreationProvider } from "@/context/PostCreationContext";
import Modal from "@/components/common/Modal";
import PostCreationFlow from "./components/PostCreationFlow";

export default function CreatePostPage() {
    const searchParams = useSearchParams();
    const isCreateModalOpen = searchParams.get("create") === "true";
    const router = useRouter();

    useEffect(() => {
        if (window.innerWidth < 768 && isCreateModalOpen) {
            router.replace("/posts/create");
        }
    }, [isCreateModalOpen, router]);

    return (
        <PostCreationProvider>
            <Modal isOpen={isCreateModalOpen} onClose={() => router.back()}>
                <PostCreationFlow />
            </Modal>
        </PostCreationProvider>
    );
}