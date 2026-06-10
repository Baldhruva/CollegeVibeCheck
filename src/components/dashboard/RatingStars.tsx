"use client";

import React, { useState } from "react";

interface RatingStarsProps {
  rating: number; // 0 to 5
  onChange: (rating: number) => void;
}

export default function RatingStars({ rating, onChange }: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const activeRating = hoverRating !== null ? hoverRating : rating;

  const getStarColor = (starValue: number) => {
    if (starValue <= activeRating) {
      switch (activeRating) {
        case 1:
          return "#ef4444"; // red
        case 2:
          return "#f97316"; // orange
        case 3:
          return "#eab308"; // yellow
        case 4:
          return "#84cc16"; // light green
        case 5:
          return "#22c55e"; // dark green
        default:
          return "var(--star-empty)";
      }
    }
    return "var(--star-empty)";
  };

  return (
    <div className="stars-container" onMouseLeave={() => setHoverRating(null)}>
      {[1, 2, 3, 4, 5].map((starValue) => {
        const isHovered = hoverRating !== null && starValue <= hoverRating;
        const isFilled = hoverRating === null && starValue <= rating;
        
        let starClass = "star-button";
        if (isHovered) {
          starClass += " hovered";
        } else if (isFilled) {
          starClass += " filled";
        }

        const color = getStarColor(starValue);

        return (
          <button
            key={starValue}
            type="button"
            className={starClass}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            style={{ color, transition: "color var(--transition-fast), transform var(--transition-fast)" }}
            aria-label={`Rate ${starValue} stars`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

