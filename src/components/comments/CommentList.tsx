"use client";

import React from "react";
import { CommentTreeNode } from "@/types/comment";
import CommentItem from "./CommentItem";

interface CommentListProps {
  comments: CommentTreeNode[];
  collegeId: string;
  depth?: number;
  onReplyCreated: (content: string, parentCommentId: string) => Promise<boolean>;
}

export default function CommentList({
  comments,
  collegeId,
  depth = 0,
  onReplyCreated
}: CommentListProps) {
  if (comments.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          collegeId={collegeId}
          depth={depth}
          onReplyCreated={onReplyCreated}
        />
      ))}
    </div>
  );
}
