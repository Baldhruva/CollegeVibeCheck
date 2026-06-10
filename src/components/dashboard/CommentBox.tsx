"use client";

import React from "react";

interface CommentBoxProps {
  parameterName: string;
  value: string;
  onChange: (value: string) => void;
}

export default function CommentBox({ parameterName, value, onChange }: CommentBoxProps) {
  const maxLength = 250;
  const charsLeft = maxLength - value.length;
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxLength) {
      onChange(text);
    }
  };

  return (
    <div className="comment-box-wrapper">
      <label className="comment-box-label" htmlFor={`comment-${parameterName}`}>
        Your thoughts on {parameterName} (Optional)
      </label>
      <div className="comment-textarea-container">
        <textarea
          id={`comment-${parameterName}`}
          className="comment-textarea"
          value={value}
          onChange={handleTextChange}
          placeholder={`What do you think about the ${parameterName.toLowerCase()} at your college?`}
          maxLength={maxLength}
        />
        <div className={`comment-counter ${charsLeft <= 20 ? "warning" : ""}`}>
          {value.length} / {maxLength}
        </div>
      </div>
    </div>
  );
}
