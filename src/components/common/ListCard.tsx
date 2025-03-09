"use client";

import React, { forwardRef } from "react";
import { getPlatformIcon } from "@/utils/icon";
import { format } from "date-fns";
import { getStatusClass } from "@/components/styles";
import ActionDropdown from "@/components/common/ActionDropdown";
import { FaRegCalendarAlt, FaTag } from "react-icons/fa";
import Image from "next/image";
import { DropboxItem } from "@/app/types";
import { Post, PostReview } from "@/app/types/post";
import { Promotion } from "@/app/types/promotion";

interface ListCardProps {
    item: Post | Promotion | PostReview;
    actions?: DropboxItem[];
    type: "post" | "promotion" | "postReview";
}

const formatShortURL = (url: string, maxLength = 18) => {
    const cleanURL = url.replace(/^(https?:\/\/)?(www\.)?/, "");
    return cleanURL.length > maxLength ? cleanURL.slice(0, maxLength) + "..." : cleanURL;
};

const ListCard = forwardRef<HTMLDivElement, ListCardProps>(
    ({ item, actions, type }, ref) => {
        let image = "/media/no-post.jpg";
        let formattedDate;
        let socialLinks;
        let description;
        let status;
        if (type === "post") {
            image = (item as Post).image
            formattedDate = format(new Date((item as Post).scheduledAt), "yyyy-MM-dd hh:mm a")
            socialLinks = [{ link: (item as Post).link ?? "Link not available yet", platform: (item as Post).platform }]
            description = (item as Post).caption
            status = (item as Post).status
        } else if (type === "promotion") {
            image = ((item as Promotion).posts ?? []).length > 0 ? (item as Promotion).posts[0].image : image;
            formattedDate = `${format(new Date((item as Promotion).startDate), "yyyy-MM-dd")} ~ ${format(new Date((item as Promotion).endDate), "yyyy-MM-dd")}`;
            socialLinks = (item as Promotion).posts?.map((post) => ({
                                    link: `/posts?id=${post.id}`,
                                    platform: post.platform ?? "unknown"
                                })) ?? [];
            description = (item as Promotion).description
            status = (item as Promotion).status
        } else if (type === "postReview") {
            image = (item as PostReview).image
            socialLinks = [{ link: "", platform: (item as PostReview).platform }]
            description = (item as PostReview).caption
        }

        return (
            <div ref={ref} className="relative p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md border cursor-pointer transition hover:shadow-lg flex items-center space-x-4 h-auto">
                {actions && (
                    <div className="absolute top-2 right-2">
                        <ActionDropdown actions={actions} />
                    </div>
                )}

                <div className="w-32 flex-shrink-0">
                    <Image 
                        src={image}
                        alt="Thumbnail"
                        width={320}
                        height={400}
                        className="aspect-[4/5] border border-gray-200 dark:border-gray-700 rounded-lg object-cover"
                    />
                </div>

                <div className="flex-1">
                    <div className="flex items-center justify-between mt-5">
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            {type === "postReview" ? (<input
                                type="datetime-local"
                                className="w-full text-xs p-1 border rounded-md focus:ring focus:ring-blue-300"
                            />
                            ) : (
                                <>
                                    <FaRegCalendarAlt /> {formattedDate}
                                </>
                            )}
                        </div>
                        {status && (
                            <span className={`px-2 py-1 text-xs font-semibold rounded-md ${getStatusClass(status)}`}>
                                {status}
                            </span>
                        )}
                    </div>

                    {item.categories && item.categories.map((category) => (
                        <div key={category} className="inline-flex items-center gap-1.5 text-xs font-medium 
                                px-2 py-1 rounded-md bg-gray-500 dark:bg-blue-600 
                                text-white dark:text-gray-100 w-fit min-w-[60px] m-1">
                            <FaTag className="text-sm" />{category}
                        </div> 
                    ))}
                    
                    <div className="flex">
                        {socialLinks?.map(({ link, platform }, index) => (
                            <div key={index}>
                                <a
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-1 inline-flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                                >
                                    {getPlatformIcon(platform, "text-xs")}
                                    <span className="truncate max-w-[160px]">
                                        {formatShortURL(link)}
                                    </span>
                                </a>
                            </div>
                        ))}
                    </div>
                    <div className="mt-2 p-3 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300" style={{ whiteSpace: 'pre-wrap' }}>
                            {description}
                        </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        {type === "post" && (
                            <>
                                <div className="flex items-center space-x-1">
                                    <span>👍 ❤️ </span>
                                    <span>{(item as Post).reactions || 0}</span>
                                </div>
                                <span>{(item as Post).comments || 0} comments</span>
                            </>
                        )}
                        {type === "promotion" && (
                            <div className="flex items-center space-x-1">
                                <span>🛒 Sold:</span>
                                <span>{(item as Promotion).soldCount || 0}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
);

ListCard.displayName = "ListCard";

export default ListCard;