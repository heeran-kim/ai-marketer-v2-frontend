// src/utils/date.ts
import { toZonedTime, format } from "date-fns-tz";

const TIMEZONE = "Australia/Brisbane";

/**
 * Converts ISO string or Date to a formatted local time string (Brisbane timezone).
 */
export const toLocalTime = (
  input: string | Date,
  fmt: string = "dd-MMM-yyyy hh:mm a"
): string => {
  const date = typeof input === "string" ? new Date(input) : input;
  const brisbaneTime = toZonedTime(date, TIMEZONE);
  return format(brisbaneTime, fmt, { timeZone: TIMEZONE });
};

/**
 * Converts ISO string or Date to a Date object in Brisbane timezone.
 */
export const toLocalDateObject = (input: string | Date): Date => {
  const date = typeof input === "string" ? new Date(input) : input;
  return toZonedTime(date, TIMEZONE);
};

/**
 * Convert local datetime to UTC for saving
 *
 * This function takes a local datetime string input and converts it to UTC (ISO format).
 * When creating a new Date object in JavaScript, it automatically interprets the string
 * as being in the local timezone and converts it to UTC internally.
 *
 * @param {string} localString - A datetime string in local timezone (e.g. "2025-04-09T18:30")
 * @returns {string} The datetime in UTC as an ISO string (e.g. "2025-04-09T08:30:00.000Z" for Brisbane UTC+10)
 */
export const toUtcFromLocalInput = (localString: string) => {
  const local = new Date(localString);
  return local.toISOString();
};

/**
 * Format date ranges intelligently based on whether dates are in the same year
 */
export function formatDateRange(startDate: string, endDate: string): string {
  if (!endDate) {
    return `${toLocalTime(startDate, "dd MMM yyyy")} – No end date`;
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  const sameYear = start.getFullYear() === end.getFullYear();

  // If they're in the same year, format start without year and end with year.
  // If not, format both with year.
  const startFormat = sameYear ? "dd MMM" : "dd MMM yyyy";
  const endFormat = "dd MMM yyyy";

  return `${toLocalTime(startDate, startFormat)} – ${toLocalTime(
    endDate,
    endFormat
  )}`;
}

/**
 * Format date ranges for local input dates
 */
export function formatLocalDateRange(
  startDate: string,
  endDate: string
): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const sameYear = start.getFullYear() === end.getFullYear();

  // If they're in the same year, format start without year and end with year.
  // If not, format both with year.
  const startFormat = sameYear ? "dd MMM" : "dd MMM yyyy";
  const endFormat = "dd MMM yyyy";

  return `${format(start, startFormat)} – ${format(end, endFormat)}`;
}
