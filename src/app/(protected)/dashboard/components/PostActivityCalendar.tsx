import React from "react";
import { PostActivityData } from "@/types/business";
import { PLATFORM_CHART_COLORS } from "@/components/styles";
import { toLocalDateObject, toLocalTime } from "@/utils/date";
import { format } from "date-fns-tz";

interface PostActivityCalendarProps {
  postActivity: PostActivityData;
}

export const PostActivityCalendar = ({
  postActivity,
}: PostActivityCalendarProps) => {
  const { platformsByDatetime, lastPostDate } = postActivity;

  const groupAndCountPostsByLocalDate = (
    posts: Record<string, string[]>
  ): {
    platformsByDate: Record<string, string[]>;
    postCountByDate: Record<string, number>;
  } => {
    const platformSetByDate: Record<string, Set<string>> = {};
    const postCountByDate: Record<string, number> = {};

    Object.entries(posts).forEach(([dateStr, platforms]) => {
      const localDate = toLocalTime(dateStr, "yyyy-MM-dd");

      if (!platformSetByDate[localDate]) {
        platformSetByDate[localDate] = new Set();
        postCountByDate[localDate] = 0;
      }

      postCountByDate[localDate] += platforms.length;
      platforms.forEach((platform) =>
        platformSetByDate[localDate].add(platform)
      );
    });

    const platformsByDate: Record<string, string[]> = {};
    for (const [date, platformSet] of Object.entries(platformSetByDate)) {
      platformsByDate[date] = Array.from(platformSet);
    }

    return { platformsByDate, postCountByDate };
  };

  const { platformsByDate, postCountByDate } =
    groupAndCountPostsByLocalDate(platformsByDatetime);

  // Get current month days
  const today = toLocalDateObject(new Date());
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Calculate days since last post
  const daysSinceLastPost = lastPostDate
    ? Math.floor(
        (today.getTime() -
          toLocalDateObject(new Date(lastPostDate)).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  // Generate activity message and status
  let activityMessage;
  type ActivityStatus = keyof typeof statusColors;
  let activityStatus: ActivityStatus;

  if (daysSinceLastPost === null) {
    activityMessage = "No posting activity yet";
    activityStatus = "inactive";
  } else if (daysSinceLastPost === 0) {
    activityMessage = "Posted today! 🎉";
    activityStatus = "active";
  } else if (daysSinceLastPost === 1) {
    activityMessage = "Last post: Yesterday";
    activityStatus = "active";
  } else if (daysSinceLastPost <= 3) {
    activityMessage = `Last post: ${daysSinceLastPost} days ago`;
    activityStatus = "active";
  } else if (daysSinceLastPost <= 7) {
    activityMessage = `Last post: ${daysSinceLastPost} days ago`;
    activityStatus = "moderate";
  } else {
    activityMessage = `Last post: ${daysSinceLastPost} days ago`;
    activityStatus = "inactive";
  }

  const statusColors = {
    active: "text-green-600",
    moderate: "text-yellow-600",
    inactive: "text-red-600",
  };

  // Get today's posts
  const todayString = format(today, "yyyy-MM-dd");
  const numPostsToday = postCountByDate[todayString] || 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-3">Posting Activity</h3>

      <div className="flex flex-col md:flex-row">
        {/* Calendar section */}
        <div className="w-full md:w-1/2 mb-4 md:mb-0">
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
              <div
                key={`header-${i}`}
                className="text-xs font-semibold text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Empty cells for days before the 1st */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8"></div>
            ))}

            {/* Calendar days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(year, month, day);
              const dateString = toLocalTime(date, "yyyy-MM-dd");
              const platforms = platformsByDate[dateString] || [];
              const isToday =
                today.getDate() === day &&
                today.getMonth() === month &&
                today.getFullYear() === year;

              return (
                <div
                  key={`day-${i}`}
                  className={`h-8 flex flex-col items-center justify-center rounded-md 
                    text-xs relative ${isToday ? "bg-gray-100 font-bold" : ""}`}
                >
                  {day}

                  {/* Platform indicators */}
                  {platforms.length > 0 && (
                    <div className="flex mt-1 space-x-0.5">
                      {platforms.map((platform, index) => (
                        <div
                          key={`${dateString}-${platform}-${index}`}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor:
                              PLATFORM_CHART_COLORS[platform] ||
                              PLATFORM_CHART_COLORS.default,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-2 text-center text-sm">
            {numPostsToday > 0 ? (
              <span className="text-green-600">
                {numPostsToday} post{numPostsToday !== 1 ? "s" : ""} today
              </span>
            ) : (
              <span className="text-gray-500">No posts today</span>
            )}
          </div>
        </div>

        {/* Activity status section */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4 border-gray-200">
          <div
            className={`text-2xl font-bold mb-2 ${statusColors[activityStatus]}`}
          >
            {activityStatus === "active"
              ? "😎 Active"
              : activityStatus === "moderate"
              ? "🙂 Moderately Active"
              : "😴 Inactive"}
          </div>

          <div className={`text-xl ${statusColors[activityStatus]}`}>
            {activityMessage}
          </div>

          <div className="mt-4 text-sm text-gray-600 text-center">
            Try to post at least once every 3 days to maintain engagement.
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 border-t border-gray-200 pt-2">
        <div className="text-xs text-gray-600 flex flex-wrap gap-x-4 gap-y-2 justify-center">
          {Object.entries(PLATFORM_CHART_COLORS)
            .filter(([key]) => key !== "default")
            .map(([platform, color]) => (
              <div key={platform} className="flex items-center">
                <div
                  className="w-2 h-2 rounded-full mr-1"
                  style={{ backgroundColor: color }}
                />
                <span>
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
