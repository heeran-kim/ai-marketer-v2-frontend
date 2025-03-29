// app/(protected)/dashboard/components/BusinessStatus.tsx
import React from "react";
import { PostsSummary } from "@/types/business";

export default function BusinessStatus({
  postsSummary,
}: {
  postsSummary: PostsSummary;
}) {
  const { numFailedPosts, numScheduledPosts, numPublishedPosts } = postsSummary;

  let statusMessage;
  let statusColor;

  if (numFailedPosts > 0) {
    statusMessage = `${numFailedPosts} post${
      numFailedPosts > 1 ? "s" : ""
    } failed. Please try again.`;
    statusColor = "text-red-600 dark:text-red-400 bg-red-500";
  } else if (numScheduledPosts > 0) {
    statusMessage = `${numScheduledPosts} post${
      numScheduledPosts > 1 ? "s" : ""
    } scheduled.`;
    statusColor = "text-yellow-600 dark:text-yellow-400 bg-yellow-500";
  } else {
    statusMessage = `${numPublishedPosts} post${
      numPublishedPosts > 1 ? "s" : ""
    } uploaded successfully.`;
    statusColor = "text-green-600 dark:text-green-400 bg-green-500";
  }

  return (
    <p className="mt-2 text-xs flex items-center">
      <span className={`w-2 h-2 rounded-full mr-1 ${statusColor}`}></span>
      <span>{statusMessage}</span>
    </p>
  );
}
