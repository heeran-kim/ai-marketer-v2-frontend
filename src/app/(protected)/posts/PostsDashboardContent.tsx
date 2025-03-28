// src/app/(protected)/posts/PostsDashboardContent.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useFetchData, apiClient } from "@/hooks/dataHooks";
import { SearchBar, DateRangePicker, ListCard, Select, DeleteConfirmModal, NotificationModal, TopLoadingBar } from "@/components/common";
import { PLATFORM_OPTIONS } from "@/utils/icon";
import { Post } from "@/app/types/post";
import { DropboxItem } from "@/app/types/index";
import { POST_STATUS_OPTIONS } from "@/constants/posts";
import { POSTS_API } from "@/constants/api";

const ITEMS_PER_PAGE = 5; 

export default function PostsDashboardContent() {
    const [postId, setPostId] = useState<string | null>(null);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPlatform, setSelectedPlatform] = useState<(typeof PLATFORM_OPTIONS)[number] | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    const { data, error, mutate } = useFetchData<{ posts: Post[]}>(POSTS_API.GET_ALL);

    const posts = data?.posts || [];
    
    const handleDelete = async () => {
        if (!selectedItemId) return;
        setIsLoading(true);
        await apiClient.delete(POSTS_API.DELETE(selectedItemId));
        await mutate();
        setIsLoading(false);
        setSuccessMessage("Post deleted successfully!");
        setSelectedItemId(null);
    };
        const handleEdit = (postId: string) => {
        console.log(`Editing post: ${postId}`);
        // TODO: Implement edit logic
    };

    const handleRetry = (postId: string) => {
        console.log(`Retrying post: ${postId}`);
        // TODO: Implement retry logic
    };

    const handleLoadMore = () => setVisibleCount((prev) => prev + ITEMS_PER_PAGE);

    const filteredPosts = posts.filter(post => 
        (!selectedPlatform || post.platform === selectedPlatform) &&
        (!selectedStatus || post.status === selectedStatus) &&
        (!searchTerm || post.caption.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const slicedPosts = filteredPosts.slice(0, visibleCount);
    const searchParams = useSearchParams();
    const postRefs = useRef<Record<string, HTMLDivElement | null>>({});

    useEffect(() => {
        const newPostId = searchParams.get("id");
        if (newPostId && newPostId !== postId) {
            setPostId(newPostId);
        }
    }, [searchParams, postId]);

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-64 text-red-500">
                <p>Failed to load posts.</p>
                <button onClick={() => mutate()} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div>
            <TopLoadingBar isLoading={isLoading} />
            <DeleteConfirmModal
                isOpen={!!selectedItemId}
                itemId={selectedItemId}
                onClose={() => setSelectedItemId(null)}
                onConfirm={handleDelete}
            />

            <NotificationModal
                isOpen={!!successMessage}
                message={successMessage || ""}
                type="success"
                onClose={() => setSuccessMessage(null)}
            />

            <div className="flex items-center space-x-4 py-4 border-b">
                <SearchBar setSearchTerm={setSearchTerm} placeholder="Search posts..." />
                <DateRangePicker onChange={(range) => console.log("Selected Range:", range)} />
                <Select value={selectedPlatform} onChange={setSelectedPlatform} options={PLATFORM_OPTIONS} placeholder="All Platforms"/>
                <Select value={selectedStatus} onChange={setSelectedStatus} options={POST_STATUS_OPTIONS} placeholder="All Status"/>
            </div>

            <div className="space-y-4 mt-2">
                {slicedPosts.map((post) => {
                    const actions: DropboxItem[] = [
                        post.status === "Failed" ? { label: "Retry", onClick: () => handleRetry(post.id) } : false,
                        post.status !== "Posted" ? { label: "Edit", onClick: () => handleEdit(post.id) } : false,
                        { label: "Delete", onClick: () => setSelectedItemId(post.id) }
                    ].filter(Boolean) as { label: string; onClick: () => void }[];

                    return (
                        <ListCard
                            key={post.id}
                            ref={(el) => { postRefs.current[post.id] = el; }}
                            item={{...post, type: "post"}}
                            actions={actions}
                        />
                    );
                })}
            </div>

            {visibleCount < filteredPosts.length && (
                <div className="flex justify-center mt-6">
                    <button
                        id="load-more-button"
                        onClick={handleLoadMore}
                        className="w-full px-6 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-300 
                                rounded-lg shadow-sm hover:bg-gray-100 transition"
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
}