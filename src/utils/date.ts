// src/utils/date.ts
import { toZonedTime, format } from "date-fns-tz";
import { addMinutes } from "date-fns";

const TIMEZONE = "Australia/Brisbane";
const BRISBANE_OFFSET_MINUTES = 600;

/**
 * Converts ISO string or Date to a formatted local time string (Brisbane timezone).
 */
export const toLocalTime = (
  input: string | Date,
  fmt: string = "yyyy-MM-dd hh:mm a"
): string => {
  const date = typeof input === "string" ? new Date(input) : input;
  const brisbaneTime = toZonedTime(date, TIMEZONE);
  return format(brisbaneTime, fmt, { timeZone: TIMEZONE });
};

/**
 * Convert local datetime to UTC for saving
 */
export const toUtcFromLocalInput = (localString: string) => {
  const local = new Date(localString);
  const utcDate = addMinutes(local, -BRISBANE_OFFSET_MINUTES);
  return utcDate.toISOString();
};
