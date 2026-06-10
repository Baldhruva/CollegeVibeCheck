import { UserRole } from "@/types/user";

/**
 * Checks whether a user with a given role and college context can rate a college.
 * - Only students belonging to the target college can rate it.
 * - Viewers cannot rate.
 */
export function canRate(
  role: UserRole | null | undefined,
  userCollegeId: string | null | undefined,
  targetCollegeId: string
): boolean {
  if (role !== "student") return false;
  return !!userCollegeId && userCollegeId === targetCollegeId;
}

/**
 * Checks whether a user with a given role and college context can write a top-level comment.
 * - Only students belonging to the target college can create top-level comments on it.
 * - Viewers cannot comment.
 */
export function canComment(
  role: UserRole | null | undefined,
  userCollegeId: string | null | undefined,
  targetCollegeId: string
): boolean {
  if (role !== "student") return false;
  return !!userCollegeId && userCollegeId === targetCollegeId;
}

/**
 * Checks whether a user can reply to comments.
 * - Both students (from any college) and viewers can reply.
 * - Anonymous users cannot reply.
 */
export function canReply(role: UserRole | null | undefined): boolean {
  return role === "student" || role === "viewer";
}
