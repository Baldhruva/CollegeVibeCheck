"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

interface HeroProps {
  onGetStartedClick: () => void;
}

export default function Hero({ onGetStartedClick }: HeroProps) {
  const { user, role } = useAuth();

  return (
    <section className="hero-section">
      <div className="hero-glow-1"></div>
      <div className="hero-glow-2"></div>
      <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h1 className="hero-title gradient-text">CollegeVibeCheck</h1>
        <p className="hero-subtitle">
          Know your college, before college. Find authentic student reviews, real campus ratings, and genuine discussions.
        </p>
        <div className="hero-ctas">
          {user ? (
            role === "student" ? (
              <Link href="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            ) : (
              <span className="user-badge" style={{ padding: "0.8rem 1.5rem" }}>
                Logged in as Viewer
              </span>
            )
          ) : (
            <button onClick={onGetStartedClick} className="btn btn-primary">
              Get Started
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
