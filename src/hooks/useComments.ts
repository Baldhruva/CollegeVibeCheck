"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  getCommentsByCollegeAndParameter,
  upsertParameterComment,
  createReply as dbCreateReply,
  buildCommentTree
} from "@/lib/db/comments";
import { CommentTreeNode, CommentWithUser } from "@/types/comment";

export function useComments(collegeId: string | undefined, parameterId: string | undefined) {
  const { user } = useAuth();
  const [commentsFlat, setCommentsFlat] = useState<CommentWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  const loadComments = useCallback(async () => {
    if (!collegeId || !parameterId) {
      setCommentsFlat([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const flatList = await getCommentsByCollegeAndParameter(supabase, collegeId, parameterId);
      setCommentsFlat(flatList);
    } catch (err: any) {
      console.error("Error loading comments:", err);
      setError(err.message || "Failed to load discussions.");
    } finally {
      setLoading(false);
    }
  }, [supabase, collegeId, parameterId]);

  // Load comments on mount and when college/parameter changes
  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // Derive comment tree in-memory
  const commentsTree = useMemo(() => {
    return buildCommentTree(commentsFlat);
  }, [commentsFlat]);

  // Derive comment count in-memory to avoid extra DB count queries
  const commentCount = useMemo(() => {
    return commentsFlat.length;
  }, [commentsFlat]);

  const addComment = async (content: string): Promise<boolean> => {
    if (!user) {
      setError("You must be logged in to comment.");
      return false;
    }
    if (!collegeId || !parameterId) {
      setError("College or parameter context missing.");
      return false;
    }

    try {
      setError(null);
      await upsertParameterComment(supabase, user.id, collegeId, parameterId, content.trim());
      // Refetch comments to update the view
      await loadComments();
      return true;
    } catch (err: any) {
      console.error("Error adding/updating comment:", err);
      setError(err.message || "Failed to post comment.");
      return false;
    }
  };

  const addReply = async (content: string, parentCommentId: string): Promise<boolean> => {
    if (!user) {
      setError("You must be logged in to reply.");
      return false;
    }
    if (!collegeId || !parameterId) {
      setError("College or parameter context missing.");
      return false;
    }

    try {
      setError(null);
      await dbCreateReply(supabase, {
        user_id: user.id,
        college_id: collegeId,
        parameter_id: parameterId,
        content: content.trim(),
        parent_comment_id: parentCommentId
      });
      // Refetch comments to update the view
      await loadComments();
      return true;
    } catch (err: any) {
      console.error("Error adding reply:", err);
      setError(err.message || "Failed to add reply.");
      return false;
    }
  };

  return {
    commentsTree,
    commentCount,
    loading,
    error,
    addComment,
    addReply,
    refresh: loadComments
  };
}
