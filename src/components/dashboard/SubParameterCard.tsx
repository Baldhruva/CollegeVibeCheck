"use client";

import React from "react";
import RatingStars from "./RatingStars";

interface SubParameterCardProps {
  id: string;
  name: string;
  rating: number;
  onChange: (rating: number) => void;
}

export default function SubParameterCard({ id, name, rating, onChange }: SubParameterCardProps) {
  return (
    <div className="sub-parameter-card" id={`subparam-${id}`}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
        <span className="sub-parameter-name">{name}</span>
        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: rating > 0 ? "var(--primary)" : "var(--text-muted)" }}>
          {rating > 0 ? `${rating} ★` : "Unrated"}
        </span>
      </div>
      <RatingStars rating={rating} onChange={onChange} />
    </div>
  );
}

