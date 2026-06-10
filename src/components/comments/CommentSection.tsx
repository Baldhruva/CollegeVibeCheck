"use client";

import React, { useState } from "react";
import { useComments } from "@/hooks/useComments";
import { useAuth } from "@/hooks/useAuth";
import { canComment } from "@/lib/auth/permissions";
import CommentList from "./CommentList";
import ReplyForm from "./ReplyForm";
import AuthModal from "@/components/home/AuthModal";

interface CommentSectionProps {
  collegeId: string;
  parameterId: string;
  parameterName: string;
}

export default function CommentSection({
  collegeId,
  parameterId,
  parameterName
}: CommentSectionProps) {
  const { user, profile, role } = useAuth();
  const {
    commentsTree,
    commentCount,
    loading,
    error,
    addComment,
    addReply
  } = useComments(collegeId, parameterId);

  const [showAuthModal, setShowAuthModal] = useState(false);

  // Check if current user is allowed to write a top-level comment
  const allowedToComment = canComment(role, profile?.college_id, collegeId);

  const handlePostComment = async (content: string) => {
    await addComment(content);
  };

  return (
    <div style={{ marginTop: "1.5rem", borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem", width: "100%" }}>
      {/* Count Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>
          Discussions ({commentCount})
        </h4>
      </div>

      {error && (
        <div style={{ color: "var(--color-red-other-student)", background: "rgba(244, 63, 94, 0.05)", border: "1px solid rgba(244, 63, 94, 0.1)", borderRadius: "var(--radius-sm)", padding: "0.75rem", fontSize: "0.85rem", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {/* Top Level Comment Creation Box */}
      <div style={{ marginBottom: "1.5rem" }}>
        {loading ? (
          <div className="spinner" style={{ width: "20px", height: "20px" }}></div>
        ) : !user ? (
          <div
            style={{
              padding: "1rem",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              fontSize: "0.9rem",
              textAlign: "center"
            }}
          >
            <span style={{ color: "var(--text-secondary)" }}>
              Want to start a discussion?{" "}
              <button
                onClick={() => setShowAuthModal(true)}
                style={{
                  color: "var(--primary)",
                  fontWeight: 600,
                  textDecoration: "underline",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0
                }}
              >
                Login / Signup
              </button>
            </span>
          </div>
        ) : allowedToComment ? (
          <ReplyForm
            onSubmit={handlePostComment}
            placeholder={`Share your thoughts on ${parameterName.toLowerCase()}...`}
            submitLabel="Post Comment"
            autoFocus={false}
          />
        ) : (
          <div
            style={{
              padding: "1rem",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
              lineHeight: "1.4"
            }}
          >
            {role === "student" ? (
              <span>
                🔒 Only students enrolled at this college can start new threads for it. You can still reply to existing comments below!
              </span>
            ) : (
              <span>
                🔒 General Viewers cannot create new discussion threads. You can still reply to existing comments below!
              </span>
            )}
          </div>
        )}
      </div>

      {/* Comments List */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "1rem 0" }}>
          <div className="spinner" style={{ width: "30px", height: "30px" }}></div>
        </div>
      ) : commentsTree.length > 0 ? (
        <CommentList
          comments={commentsTree}
          collegeId={collegeId}
          onReplyCreated={addReply}
        />
      ) : (
        <div style={{ padding: "1.5rem 0", textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
          No discussions yet on {parameterName.toLowerCase()}. Be the first to share!
        </div>
      )}

      {/* Auth Modal Popup */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}
