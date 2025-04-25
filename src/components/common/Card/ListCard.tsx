"use client";

import React, { forwardRef, useState, useEffect, useRef } from "react";
import Image from "next/image";
import ActionDropdown from "@/components/common/Card/ActionDropdown";
import { DropboxItem } from "@/types";
import { getPlatformIcon } from "@/utils/icon";
import StatusIcon from "@/components/common/StatusIcon";
import CategoryChipList from "./CategoryChipList";
import { Post, PostReview } from "@/types/post";
import { toLocalTime } from "@/utils/date";
import { usePostEditorContext } from "@/context/PostEditorContext";
import { PLATFORM_SCHEDULE_OPTIONS, ScheduleType } from "@/constants/posts";

interface ListCardProps {
  item: Post | PostReview;
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
    const {
      updatePlatformScheduleType,
      updatePlatformScheduleDate,
      platformSchedule,
    } = usePostEditorContext();
    const isInitialized = useRef<boolean>(false); // useRef to track whether initial setup logic in useEffect has run
    const cardRef = useRef<HTMLDivElement>(null);
    const [isMobileLayout, setIsMobileLayout] = useState(false);

    const [imagePreviewUrl, setImagePreviewUrl] =
      useState<string>("/media/no-post.jpg");
    const [date, setDate] = useState<string>("");
    const [socialLink, setSocialLink] = useState<{
      link: string;
      platformKey: string;
    } | null>(null);
    const [description, setDescription] = useState<string>("");
    const [status, setStatus] = useState<string>("");

    useEffect(() => {
      if (item.type !== "post") return;

      const post = item as Post;
      setImagePreviewUrl(post.image);

      let tempDate = "";
      if (post.status === "Published" && post.postedAt)
        tempDate = post.postedAt;
      else if (post.status === "Scheduled" && post.scheduledAt)
        tempDate = post.scheduledAt;
      else if (post.status === "Failed" && post.createdAt)
        tempDate = post.createdAt;
      setDate(toLocalTime(tempDate));

      setSocialLink({
        link: post.link ?? "Link not available yet",
        platformKey: post.platform.key,
      });
      setDescription(post.caption);
      setStatus(post.status);
    }, [item]);

    useEffect(() => {
      if (isInitialized.current) return;
      if (item.type !== "postReview") return;

      const review = item as PostReview;
      const scheduleDate =
        platformSchedule[review.platform]?.scheduleDate ?? null;
      setImagePreviewUrl(review.image);
      if (scheduleDate) {
        setDate(toLocalTime(scheduleDate, "yyyy-MM-dd'T'HH:mm"));
      } else {
        setDate(toLocalTime(new Date(), "yyyy-MM-dd'T'HH:mm"));
      }
      setSocialLink({ link: "", platformKey: review.platform });
      setDescription(review.caption);

      isInitialized.current = true;
    }, [item, platformSchedule]);

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

    const handleScheduleTypeChange = (
      e: React.ChangeEvent<HTMLSelectElement>
    ) => {
      const type = e.target.value as ScheduleType;
      const review = item as PostReview;

      updatePlatformScheduleType(review.platform, type);

      if (type === "instant" || type === "dontPost") {
        updatePlatformScheduleDate(review.platform, "");
      }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newDate = e.target.value;
      setDate(newDate);
      updatePlatformScheduleDate((item as PostReview).platform, newDate);
    };

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
        className={`relative bg-white rounded-lg shadow-md border
                ${isMobileLayout ? "flex flex-col m-4" : "flex flex-row h-72"}`}
      >
        {actions && (
          <div className="absolute top-2 right-2 z-10">
            <ActionDropdown actions={actions} />
          </div>
        )}

        <div
          className={`relative overflow-hidden ${
            isMobileLayout ? "w-full h-60" : "w-60 h-auto self-stretch"
          }`}
        >
          <Image
            src={imagePreviewUrl}
            alt="Thumbnail"
            width={200}
            height={200}
            className={`w-[200px] ${
              (item as Post).aspectRatio === "1/1"
                ? "h-[200px] aspect-[1/1]"
                : (item as Post).aspectRatio === "4/5"
                ? "h-auto aspect-[4/5]"
                : "h-auto aspect-[1/1]" // fallback
            } mx-auto object-cover `}// Added aspect ratio for better image handling. But need to update it to get saved aspect ratio from db. Should we?
            priority // Added priority to optimize LCP
          />
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="flex gap-2 items-center text-sm">
            {status && <StatusIcon status={status} />}
            {item.type === "postReview" && (
              <>
                <select
                  value={
                    platformSchedule[(item as PostReview).platform].scheduleType
                  }
                  onChange={handleScheduleTypeChange}
                  className="text-xs p-1 border rounded-md focus:ring"
                >
                  {PLATFORM_SCHEDULE_OPTIONS.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {platformSchedule[(item as PostReview).platform]
                  .scheduleType === "scheduled" && (
                  <input
                    type="datetime-local"
                    value={date}
                    onChange={handleDateChange}
                    className="w-full text-xs p-1 border rounded-md focus:ring focus:ring-blue-300"
                    min={toLocalTime(new Date(), "yyyy-MM-dd'T'HH:mm")}
                  />
                )}
              </>
            )}
            {item.type === "post" && (
              <span className="font-medium">{date}</span>
            )}
          </div>

          {item.selectedCategoryLabels?.length > 0 && (
            <div className="mt-1">
              <CategoryChipList
                labels={item.selectedCategoryLabels.map((cat) => cat)}
              />
            </div>
          )}

          {item.type === "post" && socialLink && (
            <>
              <div className="flex flex-wrap">
                <div className="w-full sm:w-auto">
                  <a
                    href={socialLink.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  >
                    {getPlatformIcon(socialLink.platformKey, "text-xs")}
                    <span className="truncate max-w-[160px]">
                      {formatShortURL(socialLink.link)}
                    </span>
                  </a>
                </div>
              </div>
              <div className="h-32 mt-2 p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-y-auto">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {description}
                </p>
              </div>
            </>
          )}

          {item.type === "postReview" && socialLink && (
            <div className="relative h-32 mt-2 p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-y-auto">
              <span className="float-left mr-4">
                {getPlatformIcon(socialLink.platformKey)}
              </span>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {description}
              </p>
            </div>
          )}

          <div className="mt-1 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            {item.type === "post" && (
              <>
                <div className="flex items-center space-x-1">
                  <span>👍❤️ </span>
                  <span>{(item as Post).reactions || 0}</span>
                </div>
                <span>💬 {(item as Post).comments || 0}</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ListCard.displayName = "ListCard";

export default ListCard;
