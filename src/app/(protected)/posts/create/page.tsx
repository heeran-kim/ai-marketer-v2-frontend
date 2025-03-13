// src/app/(protected)/posts/create/page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { PostCreationProvider } from "@/context/PostCreationContext";
import Modal from "@/components/common/Modal";
import PostCreationFlow from "./components/PostCreationFlow";

function CreatePostContent() {
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

import { Suspense } from "react";

export default function CreatePostPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreatePostContent />
    </Suspense>
  );
}