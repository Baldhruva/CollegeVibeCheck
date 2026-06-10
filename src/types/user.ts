/**
 * Responsibility: TypeScript interfaces for User entities.
 * Purpose: Defines database row schemas and role enums for users.
 * What code will eventually live here: UserRole type and DBUser interface representing the 'users' table.
 */

export type UserRole = "student" | "viewer";

export interface DBUser {
  id: string; // uuid, primary key, references auth.users(id)
  username: string; // varchar(30), unique, not null
  role: UserRole; // varchar(20), not null, check role in ('student', 'viewer')
  college_id: string | null; // uuid, nullable, foreign key to colleges(id)
  created_at: string; // timestamptz, default now()
}
