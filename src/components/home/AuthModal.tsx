"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const { signInWithGoogle } = useAuth();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelection = async (role: "student" | "viewer") => {
    setLoadingRole(role);
    setError(null);
    try {
      await signInWithGoogle(role);
    } catch (err) {
      console.error("Sign in failed:", err);
      const errorMessage = err instanceof Error ? err.message : "OAuth redirection failed. Please try again.";
      setError(errorMessage);
      setLoadingRole(null);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        <div className="modal-header">
          <h2 className="modal-title">Sign In / Register</h2>
          <p className="modal-description">Select your role to continue with Google</p>
        </div>

        {error && (
          <div style={{ color: "var(--color-red-other-student)", background: "rgba(244, 63, 94, 0.05)", border: "1px solid rgba(244, 63, 94, 0.1)", borderRadius: "var(--radius-sm)", padding: "0.75rem", fontSize: "0.85rem", marginBottom: "1.25rem", textAlign: "center" }}>
            {error}
          </div>
        )}

        <div className="role-cards-container">
          <button
            className="role-card"
            onClick={() => handleRoleSelection("student")}
            disabled={loadingRole !== null}
          >
            <div className="role-card-icon">
              {loadingRole === "student" ? (
                <div className="spinner" style={{ width: "24px", height: "24px" }}></div>
              ) : (
                "🎓"
              )}
            </div>
            <div className="role-card-content">
              <h3>Student</h3>
              <p>Rate your own college, write reviews, and reply to community questions.</p>
            </div>
          </button>

          <button
            className="role-card"
            onClick={() => handleRoleSelection("viewer")}
            disabled={loadingRole !== null}
          >
            <div className="role-card-icon">
              {loadingRole === "viewer" ? (
                <div className="spinner" style={{ width: "24px", height: "24px" }}></div>
              ) : (
                "🔍"
              )}
            </div>
            <div className="role-card-content">
              <h3>General Viewer</h3>
              <p>Browse Mumbai colleges, view detailed parameters, and participate in discussion threads.</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
