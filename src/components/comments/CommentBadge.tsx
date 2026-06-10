"use client";

import React from "react";
import { UserRole } from "@/types/user";

interface CommentBadgeProps {
  role: UserRole;
  commenterCollegeId: string | null;
  currentCollegeId: string;
}

export default function CommentBadge({
  role,
  commenterCollegeId,
  currentCollegeId
}: CommentBadgeProps) {
  if (role === "viewer") {
    return (
      <span className="badge badge-viewer" style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem" }}>
        Viewer
      </span>
    );
  }

  if (role === "student") {
    const isLocal = commenterCollegeId === currentCollegeId;
    return (
      <span
        className={isLocal ? "badge badge-student" : "badge badge-other-student"}
        style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem" }}
      >
        {isLocal ? "Student (Here)" : "Student (Other)"}
      </span>
    );
  }

  return null;
}
