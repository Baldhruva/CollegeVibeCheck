import React from "react";
import SubParameterCard from "./SubParameterCard";
import CommentBox from "./CommentBox";
import { DBSubParameter } from "@/types/parameter";

interface ParameterCardProps {
  id: string;
  name: string;
  description: string;
  subParameters: DBSubParameter[];
  ratings: Record<string, number>;
  onRatingChange: (subParamId: string, rating: number) => void;
  comment: string;
  onCommentChange: (comment: string) => void;
}

export default function ParameterCard({
  id,
  name,
  description,
  subParameters,
  ratings,
  onRatingChange,
  comment,
  onCommentChange,
}: ParameterCardProps) {
  
  // Calculate average rating based only on rated sub-parameters (> 0)
  const ratedValues = subParameters.map(sp => ratings[sp.id] || 0).filter(val => val > 0);
  const averageRating = ratedValues.length > 0
    ? (ratedValues.reduce((sum, val) => sum + val, 0) / ratedValues.length).toFixed(1)
    : "Unrated";

  return (
    <section id={id} className="parameter-section-wrapper">
      <div className="parameter-card">
        <div className="parameter-header">
          <div className="parameter-title-group">
            <h3>{name}</h3>
            <p className="parameter-desc">{description}</p>
          </div>
          <div className="parameter-score-display">
            <span className="score-label">Score:</span>
            <span className="score-value">{averageRating === "Unrated" ? "Unrated" : `${averageRating} ★`}</span>
          </div>
        </div>

        <div className="sub-parameters-grid">
          {subParameters.map((subParam) => (
            <SubParameterCard
              key={subParam.id}
              id={subParam.id}
              name={subParam.name}
              rating={ratings[subParam.id] || 0}
              onChange={(newRating) => onRatingChange(subParam.id, newRating)}
            />
          ))}
        </div>

        <CommentBox
          parameterName={name}
          value={comment}
          onChange={onCommentChange}
        />
      </div>
    </section>
  );
}

