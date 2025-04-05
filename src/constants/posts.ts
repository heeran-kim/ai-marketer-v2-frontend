export const POST_STATUS_OPTIONS = [
  { key: "Scheduled", label: "Scheduled" },
  { key: "Published", label: "Published" },
  { key: "Failed", label: "Failed" },
] as const;

export const PLATFORM_SCHEDULE_OPTIONS = [
  { key: "instant", label: "Post Now" },
  { key: "scheduled", label: "Schedule" },
  { key: "dontPost", label: "Don't Post" },
] as const;

export type ScheduleType = (typeof PLATFORM_SCHEDULE_OPTIONS)[number]["key"];
