"use client";

import React from "react";

interface CommentActionsProps {
  onReplyClick: () => void;
  isReplying: boolean;
}

export default function CommentActions({ onReplyClick, isReplying }: CommentActionsProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.5rem" }}>
      <button
        onClick={onReplyClick}
        style={{
          fontSize: "0.8rem",
          fontWeight: 600,
          color: isReplying ? "var(--primary)" : "var(--text-secondary)",
          background: "none",
          border: "none",
          padding: "0.25rem 0.5rem",
          borderRadius: "var(--radius-sm)",
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          transition: "all var(--transition-fast)",
        }}
        onMouseEnter={(e) => {
          if (!isReplying) e.currentTarget.style.color = "var(--text-primary)";
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
        }}
        onMouseLeave={(e) => {
          if (!isReplying) e.currentTarget.style.color = "var(--text-secondary)";
          e.currentTarget.style.background = "none";
        }}
      >
        <span>💬</span> {isReplying ? "Replying..." : "Reply"}
      </button>
    </div>
  );
}
