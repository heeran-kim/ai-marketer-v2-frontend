// src/utils/dateFormatter.ts
/**
 * Converts a Date object to a local format string for HTML datetime-local inputs.
 * This function uses the browser's local timezone and does not convert to UTC.
 *
 * @param date - The Date object to convert (defaults to current time)
 * @returns A local date string in the format "YYYY-MM-DDThh:mm"
 */
export const formatDateToLocalInput = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Converts an ISO string to a local time format.
 *
 * @param isoString - An ISO format date string (e.g., "2025-03-15T09:30:00Z")
 * @returns A local date string in the format "YYYY-MM-DDThh:mm" or empty string if input is invalid
 */
export const convertISOToLocalInput = (isoString: string): string => {
  if (!isoString) return "";

  try {
    const date = new Date(isoString);
    // Check if the date is valid
    if (isNaN(date.getTime())) return "";

    return formatDateToLocalInput(date);
  } catch (error) {
    console.error("Invalid date format:", error);
    return "";
  }
};
