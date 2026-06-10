"use client";

import React from "react";
import Link from "next/link";
import { CollegeWithStats } from "@/types/college";

interface CollegeCardProps {
  college: CollegeWithStats;
}

export default function CollegeCard({ college }: CollegeCardProps) {
  // Format rating helper
  const renderRating = (score: number) => {
    return score > 0 ? `${score.toFixed(1)} ★` : "Unrated";
  };

  return (
    <div className="college-card">

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1.35rem", fontWeight: 700, margin: 0 }}>{college.name}</h3>
          <span
            className="badge"
            style={{
              background: college.overallRating > 0 ? "var(--accent-glow)" : "rgba(255, 255, 255, 0.05)",
              color: college.overallRating > 0 ? "var(--accent)" : "var(--text-muted)",
              border: college.overallRating > 0 ? "1px solid rgba(6, 182, 212, 0.2)" : "1px solid var(--border-color)",
              padding: "0.3rem 0.75rem",
              fontWeight: 700,
              fontSize: "0.85rem",
              whiteSpace: "nowrap"
            }}
          >
            {renderRating(college.overallRating)}
          </span>
        </div>

        <p
          style={{
            fontSize: "0.925rem",
            color: "var(--text-secondary)",
            lineHeight: 1.5,
            marginBottom: "1.5rem",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            height: "4.5em"
          }}
        >
          {college.description || "No description available for this college."}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem 1.25rem",
            borderTop: "1px solid var(--border-color)",
            paddingTop: "1.25rem",
            marginBottom: "1.5rem"
          }}
        >
          {college.parameterStats.slice(0, 8).map((stat) => (
            <div
              key={stat.parameterId}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.825rem"
              }}
            >
              <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>{stat.parameterName}</span>
              <span
                style={{
                  fontWeight: 600,
                  color: stat.averageRating > 0 ? "var(--text-primary)" : "var(--text-muted)"
                }}
              >
                {stat.averageRating > 0 ? `${stat.averageRating.toFixed(1)}` : "—"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Link
        href={`/colleges/${college.id}`}
        className="btn btn-secondary"
        style={{ width: "100%", textAlign: "center", padding: "0.6rem 0", fontSize: "0.9rem" }}
      >
        View Vibe Details →
      </Link>
    </div>
  );
}
