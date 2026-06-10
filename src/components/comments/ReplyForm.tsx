"use client";

import React, { useState } from "react";

interface ReplyFormProps {
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
  placeholder?: string;
  submitLabel?: string;
  autoFocus?: boolean;
}

export default function ReplyForm({
  onSubmit,
  onCancel,
  placeholder = "Write a reply...",
  submitLabel = "Reply",
  autoFocus = true
}: ReplyFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxLength = 250;
  const charsLeft = maxLength - content.length;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxLength) {
      setContent(text);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(content);
      setContent("");
    } catch (err: any) {
      setError(err.message || "Failed to post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.50rem", marginTop: "0.75rem", width: "100%" }}>
      {error && (
        <div style={{ color: "var(--color-red-other-student)", fontSize: "0.8rem", marginBottom: "0.25rem" }}>
          {error}
        </div>
      )}
      
      <div className="comment-textarea-container">
        <textarea
          className="comment-textarea"
          value={content}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={maxLength}
          autoFocus={autoFocus}
          disabled={isSubmitting}
          style={{ minHeight: "80px" }}
        />
        <div className={`comment-counter ${charsLeft <= 20 ? "warning" : ""}`}>
          {content.length} / {maxLength}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", alignItems: "center" }}>
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
            style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || !content.trim()}
          style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}
        >
          {isSubmitting ? (
            <div className="spinner" style={{ width: "14px", height: "14px", borderWidth: "2px" }}></div>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
