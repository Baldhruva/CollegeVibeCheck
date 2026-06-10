"use client";

import React from "react";

interface ThreadToggleProps {
  isExpanded: boolean;
  replyCount: number;
  onToggle: () => void;
}

export default function ThreadToggle({ isExpanded, replyCount, onToggle }: ThreadToggleProps) {
  if (replyCount === 0) return null;

  return (
    <button
      onClick={onToggle}
      style={{
        fontSize: "0.825rem",
        fontWeight: 600,
        color: "var(--primary)",
        background: "none",
        border: "none",
        marginTop: "0.5rem",
        display: "flex",
        alignItems: "center",
        gap: "0.35rem",
        transition: "all var(--transition-fast)",
        padding: "0.35rem 0.6rem",
        borderRadius: "var(--radius-sm)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--primary-hover)";
        e.currentTarget.style.background = "var(--primary-glow)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--primary)";
        e.currentTarget.style.background = "none";
      }}
    >
      <span>{isExpanded ? "▲" : "▼"}</span>
      <span>
        {isExpanded ? "Hide Replies" : `View Replies (${replyCount})`}
      </span>
    </button>
  );
}
