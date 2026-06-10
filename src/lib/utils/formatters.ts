/**
 * Responsibility: Formatters for dates, rating averages, and user badge colors.
 * Purpose: Provides UI formatting helper functions.
 * What code will eventually live here: Date, rating, and badge formatting logic.
 */

import { UserRole } from "@/types/user";

/**
 * Formats a rating value to 1 decimal place (e.g., 4.2).
 * If the value is 0 or NaN, returns "N/A" or "0.0".
 */
export function formatRating(rating: number | null | undefined): string {
  if (rating === null || rating === undefined || Number.isNaN(rating) || rating === 0) {
    return "N/A";
  }
  return rating.toFixed(1);
}

/**
 * Formats a date string into a friendly relative format (e.g., "3h ago", "2d ago")
 * or a standard date format if older than 7 days.
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  
  if (Number.isNaN(date.getTime())) {
    return "unknown date";
  }

  const secondsPast = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsPast < 60) {
    return "just now";
  }
  if (secondsPast < 3600) {
    const minutes = Math.floor(secondsPast / 60);
    return `${minutes}m ago`;
  }
  if (secondsPast < 86400) {
    const hours = Math.floor(secondsPast / 3600);
    return `${hours}h ago`;
  }
  if (secondsPast < 604800) {
    const days = Math.floor(secondsPast / 86400);
    return `${days}d ago`;
  }

  // Fallback to absolute date formatting: e.g., "Jun 9, 2026"
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

/**
 * User Color Logic for badge coloring.
 * - Green: Student belongs to the college currently being viewed.
 * - Red: Student belongs to another college.
 * - Yellow: Viewer.
 * 
 * @param commenterRole The role of the user who made the comment ('student' | 'viewer')
 * @param commenterCollegeId The college_id of the user who made the comment
 * @param currentCollegeId The ID of the college currently being viewed
 */
export function getUserBadgeColor(
  commenterRole: UserRole,
  commenterCollegeId: string | null,
  currentCollegeId: string
): "green" | "red" | "yellow" {
  if (commenterRole === "viewer") {
    return "yellow";
  }

  if (commenterRole === "student") {
    return commenterCollegeId === currentCollegeId ? "green" : "red";
  }

  return "yellow"; // Default fallback
}
