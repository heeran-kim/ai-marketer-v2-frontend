"use client";

import React, { forwardRef, useState, useEffect, useRef } from "react";
import { getPlatformIcon } from "@/utils/icon";
import { convertISOToLocalInput } from "@/utils/dateFormatter";
import { format } from "date-fns";
import { getStatusClass } from "@/components/styles";
import ActionDropdown from "@/components/common/ActionDropdown";
import { FaRegCalendarAlt, FaTag } from "react-icons/fa";
import Image from "next/image";
import { DropboxItem } from "@/types";
import { Post, PostReview } from "@/types/post";
import { Promotion } from "@/types/promotion";

interface ListCardProps {
  item: Post | Promotion | PostReview;
  actions?: DropboxItem[];
}

const formatShortURL = (url: string, maxLength = 18) => {
  const cleanURL = url.replace(/^(https?:\/\/)?(www\.)?/, "");
  return cleanURL.length > maxLength
    ? cleanURL.slice(0, maxLength) + "..."
    : cleanURL;
};

const ListCard = forwardRef<HTMLDivElement, ListCardProps>(
  ({ item, actions }, ref) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isMobileLayout, setIsMobileLayout] = useState(false);

    const [imagePreviewUrl, setImagePreviewUrl] =
      useState<string>("/media/no-post.jpg");
    const [scheduleType, setScheduleType] = useState<"instant" | "scheduled">(
      "instant"
    );
    const [date, setDate] = useState<string>("");
    const [socialLinks, setSocialLinks] = useState<
      { link: string; platformKey: string }[]
    >([]);
    const [description, setDescription] = useState<string>("");
    const [status, setStatus] = useState<string>("");

    useEffect(() => {
      if ((item as Post).type === "post") {
        const post = item as Post;
        setImagePreviewUrl(post.image);

        let date = "";
        if (post.status === "Published" && post.postedAt) date = post.postedAt;
        else if (post.status === "Scheduled" && post.scheduledAt)
          date = post.scheduledAt;
        else if (post.status === "Failed" && post.createdAt)
          date = post.createdAt;
        setDate(format(new Date(date), "yyyy-MM-dd hh:mm a"));

        setSocialLinks([
          {
            link: post.link ?? "Link not available yet",
            platformKey: post.platform.key,
          },
        ]);
        setDescription(post.caption);
        setStatus(post.status);
      }

      if ((item as Promotion).type === "promotion") {
        const promo = item as Promotion;
        setImagePreviewUrl(
          (promo.posts ?? []).length > 0
            ? promo.posts[0].image
            : imagePreviewUrl
        );
        setDate(
          `${format(new Date(promo.startDate), "yyyy-MM-dd")} ~ ${format(
            new Date(promo.endDate),
            "yyyy-MM-dd"
          )}`
        );
        setSocialLinks(
          promo.posts?.map((post) => ({
            link: `/posts?id=${post.id}`,
            platformKey: post.platform.key ?? "unknown",
          })) ?? []
        );
        setDescription(promo.description);
        setStatus(promo.status);
      }

      if ((item as PostReview).type === "postReview") {
        const review = item as PostReview;
        setImagePreviewUrl(review.image);
        if (review.scheduleDate) {
          setScheduleType("scheduled");
          setDate(review.scheduleDate);
        } else {
          setDate(new Date().toISOString().slice(0, 16));
        }
        setSocialLinks([{ link: "", platformKey: review.platform }]);
        setDescription(review.caption);
      }
    }, [item, imagePreviewUrl]);

    useEffect(() => {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.contentRect.width;
          setIsMobileLayout(width < 500);
        }
      });

      if (cardRef.current) {
        observer.observe(cardRef.current);
      }

      return () => {
        if (cardRef.current) {
          observer.unobserve(cardRef.current);
        }
      };
    }, []);

    return (
      <div
        ref={(node) => {
          cardRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={`relative p-4 bg-white rounded-lg shadow-md border transition hover:shadow-lg flex 
                ${
                  isMobileLayout
                    ? "flex-col items-center"
                    : "flex-row items-start space-x-4"
                }`}
      >
        {actions && (
          <div className="absolute top-2 right-2">
            <ActionDropdown actions={actions} />
          </div>
        )}

        <div className="w-full sm:w-32 flex-shrink-0">
          <Image
            src={imagePreviewUrl}
            alt="Thumbnail"
            width={320}
            height={400}
            className="aspect-[4/5] border border-gray-200 dark:border-gray-700 rounded-lg object-cover mx-auto sm:mx-0"
          />
        </div>

        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mt-2 sm:mt-5">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              {item.type === "postReview" ? (
                <div className="flex flex-col w-full">
                  <select
                    value={scheduleType}
                    onChange={(e) => {
                      if (e.target.value === "instant")
                        (item as PostReview).onScheduleChange("");
                      setScheduleType(
                        e.target.value as "instant" | "scheduled"
                      );
                    }}
                    className="w-full text-xs p-1 border rounded-md focus:ring focus:ring-blue-300"
                  >
                    <option value="instant">Post Now</option>
                    <option value="scheduled">Schedule</option>
                  </select>

                  <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      setDate(convertISOToLocalInput(newDate));
                      if (item.type === "postReview") {
                        (item as PostReview).onScheduleChange(newDate);
                      }
                    }}
                    className={`w-full text-xs p-1 border rounded-md focus:ring focus:ring-blue-300 mt-2 max-w-full sm:max-w-xs sm:w-auto sm:mx-auto ${
                      scheduleType === "instant" ? "hidden" : ""
                    }`}
                  />
                </div>
              ) : (
                <div>
                  <FaRegCalendarAlt /> {date}
                </div>
              )}
            </div>
            {status && (
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-md ${getStatusClass(
                  status
                )}`}
              >
                {status}
              </span>
            )}
          </div>

          {item.selectedCategoryLabels?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {item.selectedCategoryLabels.map((category) => (
                <div
                  key={category}
                  className="inline-flex items-center gap-1.5 text-xs font-medium 
                                    px-2 py-1 rounded-md bg-gray-500 dark:bg-blue-600 
                                    text-white dark:text-gray-100 w-fit min-w-[60px] m-1"
                >
                  <FaTag className="text-sm" />
                  {category}
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap">
            {socialLinks?.map(({ link, platformKey: platform }, index) => (
              <div key={index} className="w-full sm:w-auto">
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
            <p
              className="mt-2 text-sm text-gray-700 dark:text-gray-300"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {description}
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            {item.type === "post" && (
              <>
                <div className="flex items-center space-x-1">
                  <span>👍 ❤️ </span>
                  <span>{(item as Post).reactions || 0}</span>
                </div>
                <span>{(item as Post).comments || 0} comments</span>
              </>
            )}
            {item.type === "promotion" && (
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
