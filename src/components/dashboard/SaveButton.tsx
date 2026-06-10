"use client";

import React from "react";

interface SaveButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function SaveButton({ onClick, disabled, loading }: SaveButtonProps) {
  return (
    <div className="save-btn-wrapper">
      <button
        onClick={onClick}
        className="btn btn-primary"
        disabled={disabled || loading}
        style={{ minWidth: "150px" }}
      >
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }}></div>
            <span>Saving...</span>
          </div>
        ) : (
          "Save Ratings"
        )}
      </button>
    </div>
  );
}

