/**
 * Responsibility: TypeScript interfaces for Comment entities.
 * Purpose: Defines database row schema and nested tree interfaces for recursive comment threads.
 * What code will eventually live here: DBComment, CommentWithUser, and CommentTreeNode interfaces.
 */

import { UserRole } from "./user";

export interface DBComment {
  id: string; // uuid, primary key, default gen_random_uuid()
  parent_comment_id: string | null; // uuid, nullable, foreign key to comments(id) on delete cascade
  user_id: string; // uuid, not null, foreign key to users(id) on delete cascade
  college_id: string; // uuid, not null, foreign key to colleges(id) on delete cascade
  parameter_id: string; // uuid, not null, foreign key to parameters(id) on delete cascade
  content: string; // varchar(250), not null
  created_at: string; // timestamptz, default now()
}

export interface CommentUser {
  id: string;
  username: string;
  role: UserRole;
  college_id: string | null; // college the student belongs to (if any)
}

export interface CommentWithUser extends DBComment {
  user: CommentUser;
}

export interface CommentTreeNode extends CommentWithUser {
  replies: CommentTreeNode[]; // recursive nested replies
}
