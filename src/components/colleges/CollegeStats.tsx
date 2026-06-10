"use client";

import React from "react";
import { CollegeWithStats } from "@/types/college";
import CommentSection from "@/components/comments/CommentSection";
import { PARAMETERS_CONFIG } from "@/lib/constants/parameters";

interface CollegeStatsProps {
  college: CollegeWithStats;
}

export default function CollegeStats({ college }: CollegeStatsProps) {
  // Format rating helper
  const renderRating = (score: number) => {
    return score > 0 ? score.toFixed(2) : "Unrated";
  };

  const getStarColor = (score: number) => {
    if (score === 0) return "var(--star-empty)";
    const rounded = Math.round(score);
    switch (rounded) {
      case 1: return "#ef4444"; // red
      case 2: return "#f97316"; // orange
      case 3: return "#eab308"; // yellow
      case 4: return "#84cc16"; // light green
      case 5: return "#22c55e"; // dark green
      default: return "var(--accent)";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      {/* College Info Header */}
      <div className="college-header-card">
        <div className="college-header-glow"></div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.5rem" }}>
          <div style={{ flex: 1, minWidth: "280px" }}>
            <h1 className="college-name">{college.name}</h1>
            <p className="college-desc" style={{ marginTop: "1rem" }}>
              {college.description || "No description available for this college."}
            </p>
          </div>
          
          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-lg)",
              padding: "1.5rem 2rem",
              textAlign: "center",
              minWidth: "180px"
            }}
          >
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
              Overall Vibe
            </div>
            <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--accent)", fontFamily: "var(--font-display)", lineHeight: 1 }}>
              {college.overallRating > 0 ? `${college.overallRating.toFixed(1)} ★` : "—"}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
              Based on {college.ratingCount} student {college.ratingCount === 1 ? "rating" : "ratings"}
            </div>
          </div>
        </div>
      </div>

      {/* Parameter Breakdown Stack */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <h2 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Parameter Breakdown</h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {college.parameterStats.map((stat) => {
            const hasRating = stat.averageRating > 0;
            const barWidth = hasRating ? `${(stat.averageRating / 5) * 100}%` : "0%";
            const color = getStarColor(stat.averageRating);
            const config = PARAMETERS_CONFIG.find(p => p.name === stat.parameterName);

            return (
              <div
                key={stat.parameterId}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-lg)",
                  padding: "2rem"
                }}
              >
                {/* Parameter Information Block */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
                  <div style={{ flex: 1, minWidth: "250px" }}>
                    <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--text-primary)" }}>{stat.parameterName}</h3>
                    {config?.description && (
                      <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "0.25rem", lineHeight: "1.4" }}>
                        {config.description}
                      </p>
                    )}
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      color: hasRating ? color : "var(--text-muted)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid var(--border-color)",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "var(--radius-md)"
                    }}
                  >
                    {hasRating ? `${stat.averageRating.toFixed(1)} ★` : "Unrated"}
                  </div>
                </div>
                
                {/* Custom Progress Bar */}
                <div style={{ width: "100%", height: "10px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "5px", overflow: "hidden", marginBottom: "1rem" }}>
                  <div
                    style={{
                      width: barWidth,
                      height: "100%",
                      background: color,
                      borderRadius: "5px",
                      transition: "width 0.5s ease"
                    }}
                  ></div>
                </div>

                {/* Sub-parameters Config tags list */}
                {config && config.subParameters.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
                    {config.subParameters.map((sub, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          color: "var(--text-secondary)",
                          background: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid var(--border-color)",
                          padding: "0.25rem 0.6rem",
                          borderRadius: "var(--radius-sm)"
                        }}
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                )}

                {/* Comments Section */}
                <CommentSection
                  collegeId={college.id}
                  parameterId={stat.parameterId}
                  parameterName={stat.parameterName}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

