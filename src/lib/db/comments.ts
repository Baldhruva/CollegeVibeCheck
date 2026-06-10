/**
 * Responsibility: Database query helpers for the 'comments' table.
 * Purpose: Handles comment creation, retrieval, and recursive tree nesting.
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { DBComment, CommentWithUser, CommentTreeNode, CommentUser } from "@/types/comment";

/**
 * Helper to map a raw database comment (with joined user) to CommentWithUser.
 */
function mapRawComment(rawData: any): CommentWithUser {
  const userProfile: CommentUser = rawData.user
    ? {
        id: rawData.user.id,
        username: rawData.user.username,
        role: rawData.user.role,
        college_id: rawData.user.college_id
      }
    : {
        id: rawData.user_id,
        username: "Unknown User",
        role: "viewer",
        college_id: null
      };

  return {
    id: rawData.id,
    parent_comment_id: rawData.parent_comment_id,
    user_id: rawData.user_id,
    college_id: rawData.college_id,
    parameter_id: rawData.parameter_id,
    content: rawData.content,
    created_at: rawData.created_at,
    user: userProfile
  };
}

/**
 * Fetches all comments for a specific college and parameter as a flat list.
 * Comments are ordered chronologically (created_at ascending).
 */
export async function getCommentsByCollegeAndParameter(
  supabase: SupabaseClient,
  collegeId: string,
  parameterId: string
): Promise<CommentWithUser[]> {
  const { data, error } = await supabase
    .from("comments")
    .select(`
      id,
      parent_comment_id,
      user_id,
      college_id,
      parameter_id,
      content,
      created_at,
      user:users (
        id,
        username,
        role,
        college_id
      )
    `)
    .eq("college_id", collegeId)
    .eq("parameter_id", parameterId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch comments: ${error.message}`);
  }

  const rawComments = data as any[];
  return rawComments.map(mapRawComment);
}

/**
 * Creates a top-level comment (parent_comment_id = null).
 * Returns the created comment joined with commenter profile.
 */
export async function createComment(
  supabase: SupabaseClient,
  commentData: {
    user_id: string;
    college_id: string;
    parameter_id: string;
    content: string;
  }
): Promise<CommentWithUser> {
  const { data, error } = await supabase
    .from("comments")
    .insert([
      {
        ...commentData,
        parent_comment_id: null
      }
    ])
    .select(`
      id,
      parent_comment_id,
      user_id,
      college_id,
      parameter_id,
      content,
      created_at,
      user:users (
        id,
        username,
        role,
        college_id
      )
    `)
    .single();

  if (error) {
    throw new Error(`Failed to create comment: ${error.message}`);
  }

  return mapRawComment(data);
}

/**
 * Creates a reply comment (parent_comment_id is specified).
 * Returns the created comment joined with commenter profile.
 */
export async function createReply(
  supabase: SupabaseClient,
  replyData: {
    user_id: string;
    college_id: string;
    parameter_id: string;
    content: string;
    parent_comment_id: string;
  }
): Promise<CommentWithUser> {
  const { data, error } = await supabase
    .from("comments")
    .insert([replyData])
    .select(`
      id,
      parent_comment_id,
      user_id,
      college_id,
      parameter_id,
      content,
      created_at,
      user:users (
        id,
        username,
        role,
        college_id
      )
    `)
    .single();

  if (error) {
    throw new Error(`Failed to create reply: ${error.message}`);
  }

  return mapRawComment(data);
}

/**
 * Convert flat DB records into a nested tree.
 * Memory-based tree building utility running in O(N) time.
 */
export function buildCommentTree(comments: CommentWithUser[]): CommentTreeNode[] {
  const nodeMap: Record<string, CommentTreeNode> = {};
  const rootNodes: CommentTreeNode[] = [];

  // 1. Initialize all nodes
  comments.forEach((c) => {
    nodeMap[c.id] = {
      ...c,
      replies: []
    };
  });

  // 2. Build relationships
  comments.forEach((c) => {
    const node = nodeMap[c.id];
    if (c.parent_comment_id === null) {
      const isStudentEnrolled = c.user.role === "student" && c.user.college_id === c.college_id;
      if (isStudentEnrolled) {
        rootNodes.push(node);
      }
    } else {
      const parentNode = nodeMap[c.parent_comment_id];
      if (parentNode) {
        parentNode.replies.push(node);
      } else {
        // If parent not found, treat as root only if it belongs to an enrolled student
        const isStudentEnrolled = c.user.role === "student" && c.user.college_id === c.college_id;
        if (isStudentEnrolled) {
          rootNodes.push(node);
        }
      }
    }
  });

  return rootNodes;
}

/**
 * Gets the total count of comments for a specific college and parameter.
 * Can take an optional list of comments to calculate in-memory, or queries DB.
 */
export async function getCommentCount(
  supabase: SupabaseClient,
  collegeId: string,
  parameterId: string,
  loadedComments?: CommentWithUser[]
): Promise<number> {
  if (loadedComments) {
    return loadedComments.length;
  }

  const { count, error } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("college_id", collegeId)
    .eq("parameter_id", parameterId);

  if (error) {
    throw new Error(`Failed to get comment count: ${error.message}`);
  }

  return count || 0;
}

/**
 * Deletes a comment by its ID.
 * Cascade deletes all child replies because of schema constraints.
 */
export async function deleteComment(
  supabase: SupabaseClient,
  commentId: string
): Promise<void> {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) {
    throw new Error(`Failed to delete comment: ${error.message}`);
  }
}

/**
 * Fetches all comments for a specific college and parameter,
 * and organizes them into a hierarchical tree (YouTube-like nested format).
 */
export async function getCommentsTree(
  supabase: SupabaseClient,
  collegeId: string,
  parameterId: string
): Promise<CommentTreeNode[]> {
  const flatComments = await getCommentsByCollegeAndParameter(supabase, collegeId, parameterId);
  return buildCommentTree(flatComments);
}

/**
 * Fetches all top-level comments written by a specific user for a specific college.
 */
export async function getUserCommentsForCollege(
  supabase: SupabaseClient,
  userId: string,
  collegeId: string
): Promise<DBComment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("user_id", userId)
    .eq("college_id", collegeId)
    .is("parent_comment_id", null);

  if (error) {
    throw new Error(`Failed to fetch user comments for college: ${error.message}`);
  }

  return data || [];
}

/**
 * Creates, updates, or deletes a student's top-level parameter comment.
 * If content is empty/whitespace:
 * - If there are replies to this comment, updates content to "[Comment deleted by user]"
 * - If there are no replies, deletes the comment row entirely.
 * If content is not empty:
 * - If comment exists, updates content.
 * - If comment does not exist, inserts new comment.
 */
export async function upsertParameterComment(
  supabase: SupabaseClient,
  userId: string,
  collegeId: string,
  parameterId: string,
  content: string
): Promise<void> {
  const trimmed = content.trim();

  // Find existing top-level comment
  const { data: existing, error: fetchError } = await supabase
    .from("comments")
    .select("id, content")
    .eq("user_id", userId)
    .eq("college_id", collegeId)
    .eq("parameter_id", parameterId)
    .is("parent_comment_id", null)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`Failed to check existing comment: ${fetchError.message}`);
  }

  if (trimmed === "") {
    // Student cleared the comment box
    if (existing) {
      // Check if this comment has any replies
      const { count, error: countError } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("parent_comment_id", existing.id);

      if (countError) {
        throw new Error(`Failed to check comment replies: ${countError.message}`);
      }

      if (count && count > 0) {
        // Preserves the replies: update comment content to placeholder
        const { error: updateError } = await supabase
          .from("comments")
          .update({ content: "[Comment deleted by user]" })
          .eq("id", existing.id);

        if (updateError) {
          throw new Error(`Failed to clear comment with replies: ${updateError.message}`);
        }
      } else {
        // Safe to delete: no replies exist
        const { error: deleteError } = await supabase
          .from("comments")
          .delete()
          .eq("id", existing.id);

        if (deleteError) {
          throw new Error(`Failed to delete comment: ${deleteError.message}`);
        }
      }
    }
  } else {
    // Student provided new/updated comment content
    if (existing) {
      const { error: updateError } = await supabase
        .from("comments")
        .update({ content: trimmed })
        .eq("id", existing.id);

      if (updateError) {
        throw new Error(`Failed to update comment: ${updateError.message}`);
      }
    } else {
      const { error: insertError } = await supabase
        .from("comments")
        .insert([
          {
            user_id: userId,
            college_id: collegeId,
            parameter_id: parameterId,
            content: trimmed,
            parent_comment_id: null
          }
        ]);

      if (insertError) {
        throw new Error(`Failed to insert comment: ${insertError.message}`);
      }
    }
  }
}


