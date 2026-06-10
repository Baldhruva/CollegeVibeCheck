import { UserRole } from "@/types/user";

export function isStudent(role: string | null | undefined): role is "student" {
  return role === "student";
}

export function isViewer(role: string | null | undefined): role is "viewer" {
  return role === "viewer";
}
