"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";
import ParameterCard from "./ParameterCard";
import SaveButton from "./SaveButton";
import { useRatings } from "@/hooks/useRatings";
import { DBUser } from "@/types/user";
import { DBCollege } from "@/types/college";

interface DashboardShellProps {
  profile: DBUser;
  college: DBCollege | null;
}

export default function DashboardShell({ profile, college }: DashboardShellProps) {
  // Use the useRatings custom hook to manage database-backed ratings & comments state
  const {
    dbParameters,
    ratings,
    comments,
    averages,
    overallRating,
    loading,
    saving,
    error,
    handleRatingChange,
    handleCommentChange,
    saveRatings,
  } = useRatings(college?.id);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveClick = async () => {
    setSaveSuccess(false);
    const success = await saveRatings();
    if (success) {
      setSaveSuccess(true);
      const timer = setTimeout(() => setSaveSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  };

  // Bridge averages keyed by DB ID to Sidebar averages keyed by parameter name
  const sidebarAverages: Record<string, string> = {};
  dbParameters.forEach((param) => {
    const score = averages[param.id];
    sidebarAverages[param.name] = score === undefined || score === "Unrated"
      ? "Unrated"
      : score.toFixed(1);
  });

  // Sidebar expects list of parameters
  const sidebarParamsList = dbParameters.map((p) => ({ name: p.name }));

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Header />
        <div className="loading-view">
          <div className="spinner"></div>
          <p style={{ color: "var(--text-secondary)", fontWeight: 500 }}>Loading ratings data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Header />
      
      <div className="dashboard-container">
        {sidebarParamsList.length > 0 && (
          <Sidebar parameters={sidebarParamsList} averages={sidebarAverages} />
        )}
        
        <main className="dashboard-content" style={{ flex: 1 }}>
          {error && (
            <div style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "#f87171",
              padding: "1rem",
              borderRadius: "var(--radius-md)",
              marginBottom: "2rem",
              fontSize: "0.95rem"
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="college-header-card">
            <div className="college-header-glow"></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h1 className="college-name">{college?.name || "Your College"}</h1>
                <p className="college-desc" style={{ marginBottom: "0.5rem" }}>
                  Logged in as student: <strong style={{ color: "var(--primary)" }}>@{profile.username}</strong>
                </p>
                <p className="college-desc">
                  {college?.description || "No description available for this college."}
                </p>
              </div>
              <div className="parameter-score-display" style={{ padding: "0.75rem 1.25rem", fontSize: "1.05rem" }}>
                <span className="score-label" style={{ fontWeight: 600 }}>Overall Vibe:</span>
                <span className="score-value" style={{ fontSize: "1.2rem", color: "var(--accent)" }}>
                  {overallRating === "Unrated" ? "Unrated" : `${(overallRating as number).toFixed(1)} ★`}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {dbParameters.map((param) => {
              const toId = (name: string) => name.toLowerCase().replace(/\s+/g, "-");
              return (
                <ParameterCard
                  key={param.id}
                  id={toId(param.name)}
                  name={param.name}
                  description={param.description || ""}
                  subParameters={param.subParameters}
                  ratings={ratings}
                  onRatingChange={handleRatingChange}
                  comment={comments[param.id] || ""}
                  onCommentChange={(val) => handleCommentChange(param.id, val)}
                />
              );
            })}
          </div>

          <div className="dashboard-actions-panel" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "1.5rem" }}>
            {saveSuccess && (
              <span style={{ color: "var(--color-green-student)", fontWeight: 600, fontSize: "0.95rem" }}>
                ✓ Ratings saved successfully!
              </span>
            )}
            <SaveButton onClick={handleSaveClick} loading={saving} disabled={loading} />
          </div>
        </main>
      </div>
    </div>
  );
}

