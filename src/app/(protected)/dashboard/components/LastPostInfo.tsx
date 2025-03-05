// app/(protected)/dashboard/components/LastPostInfo.tsx
import { FaLink } from "react-icons/fa";
import { PostsSummary } from "@/app/types/business";

interface LastPostInfoProps {
    postsSummary: PostsSummary;
}

export default function LastPostInfo({ postsSummary }: LastPostInfoProps){
    if (!postsSummary.lastActivity) return null;

    return (
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-300 flex items-center">
            Last Post: {new Date(postsSummary.lastActivity).toLocaleString()}
            {postsSummary.lastPostLink && (
                <a
                    href={postsSummary.lastPostLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    <FaLink className="inline-block text-xs" />
                </a>
            )}
        </p>
    )
}