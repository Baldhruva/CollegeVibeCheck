"use client";

import React, { useState } from "react";
import { CommentTreeNode } from "@/types/comment";
import { useAuth } from "@/hooks/useAuth";
import { canReply } from "@/lib/auth/permissions";
import { formatDate } from "@/lib/utils/formatters";
import CommentBadge from "./CommentBadge";
import CommentActions from "./CommentActions";
import ThreadToggle from "./ThreadToggle";
import ReplyForm from "./ReplyForm";
import CommentList from "./CommentList";
import AuthModal from "@/components/home/AuthModal";

interface CommentItemProps {
  comment: CommentTreeNode;
  collegeId: string;
  depth: number;
  onReplyCreated: (content: string, parentCommentId: string) => Promise<boolean>;
}

export default function CommentItem({
  comment,
  collegeId,
  depth,
  onReplyCreated
}: CommentItemProps) {
  const { user, role } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAuthNotice, setShowAuthNotice] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleReplyClick = () => {
    // If not authenticated, prompt to login
    if (!user || !canReply(role)) {
      setShowAuthNotice(true);
    } else {
      setIsReplying(true);
      setShowAuthNotice(false);
    }
  };

  const handleReplySubmit = async (content: string) => {
    const success = await onReplyCreated(content, comment.id);
    if (success) {
      setIsReplying(false);
      setIsExpanded(true); // Automatically expand to show the newly posted reply
    }
  };

  return (
    <div
      className={`comment-item-fade comment-nested-wrapper depth-${depth}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
        marginTop: "1rem",
        width: "100%"
      }}
    >
      {/* Comment Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
        <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
          {comment.user.username || "Anonymous Student"}
        </span>
        <CommentBadge
          role={comment.user.role}
          commenterCollegeId={comment.user.college_id}
          currentCollegeId={collegeId}
        />
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
          {formatDate(comment.created_at)}
        </span>
      </div>

      {/* Comment Content */}
      <div style={{ fontSize: "0.95rem", color: "var(--text-primary)", whiteSpace: "pre-line", marginTop: "0.25rem", wordBreak: "break-word" }}>
        {comment.content}
      </div>

      {/* Actions */}
      <CommentActions onReplyClick={handleReplyClick} isReplying={isReplying} />

      {/* Anonymous Auth Notice */}
      {showAuthNotice && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginTop: "0.5rem",
            padding: "0.5rem 0.75rem",
            background: "rgba(245, 158, 11, 0.05)",
            border: "1px solid rgba(245, 158, 11, 0.15)",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.85rem",
            width: "max-content",
            maxWidth: "100%"
          }}
        >
          <span style={{ color: "var(--text-secondary)" }}>
            <button
              onClick={() => setShowAuthModal(true)}
              style={{
                color: "var(--primary)",
                fontWeight: 600,
                textDecoration: "underline",
                display: "inline",
                padding: 0,
                background: "none",
                border: "none",
                cursor: "pointer"
              }}
            >
              Login / Signup
            </button> to reply
          </span>
          <button
            onClick={() => setShowAuthNotice(false)}
            style={{
              color: "var(--text-muted)",
              fontSize: "0.75rem",
              fontWeight: 600,
              background: "none",
              border: "none",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Reply Input Form */}
      {isReplying && (
        <div style={{ maxWidth: "600px", width: "100%" }}>
          <ReplyForm
            onSubmit={handleReplySubmit}
            onCancel={() => setIsReplying(false)}
            placeholder={`Reply to @${comment.user.username || "user"}...`}
            submitLabel="Post Reply"
          />
        </div>
      )}

      {/* Thread Toggle for replies */}
      {comment.replies.length > 0 && (
        <ThreadToggle
          isExpanded={isExpanded}
          replyCount={comment.replies.length}
          onToggle={() => setIsExpanded(!isExpanded)}
        />
      )}

      {/* Nested Replies */}
      {comment.replies.length > 0 && isExpanded && (
        <div style={{ width: "100%" }}>
          <CommentList
            comments={comment.replies}
            collegeId={collegeId}
            depth={depth + 1}
            onReplyCreated={onReplyCreated}
          />
        </div>
      )}

      {/* Google Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}
