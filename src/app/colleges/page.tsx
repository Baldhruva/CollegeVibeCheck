"use client";

import React, { useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import CollegeSearchBar from "@/components/colleges/CollegeSearchBar";
import CollegeCard from "@/components/colleges/CollegeCard";
import { useCollegeSearch } from "@/hooks/useCollegeSearch";
import AuthModal from "@/components/home/AuthModal";

export default function CollegesPage() {
  const { query, setQuery, results, suggestions, loading, error } = useCollegeSearch();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header onLoginClick={() => setShowAuthModal(true)} />

      <main style={{ flex: 1, padding: "3rem 1.5rem" }} className="container">
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 className="gradient-text" style={{ fontSize: "3rem", marginBottom: "1rem" }}>
            Mumbai Colleges Directory
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.15rem", maxWidth: "600px", margin: "0 auto" }}>
            Discover and search authentic vibe ratings across Academics, Social Life, Fests, and more.
          </p>
        </div>

        {/* Search & Autocomplete Bar */}
        <CollegeSearchBar
          query={query}
          onChange={setQuery}
          suggestions={suggestions}
          onSelectSuggestion={handleSelectSuggestion}
        />

        {/* Loading / Error States */}
        {loading ? (
          <div className="loading-view" style={{ minHeight: "40vh" }}>
            <div className="spinner"></div>
            <p style={{ color: "var(--text-secondary)", fontWeight: 500, marginTop: "1rem" }}>Loading colleges...</p>
          </div>
        ) : error ? (
          <div style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            color: "#f87171",
            padding: "1.5rem",
            borderRadius: "var(--radius-md)",
            textAlign: "center",
            maxWidth: "600px",
            margin: "2rem auto"
          }}>
            <strong>Error loading colleges:</strong> {error}
          </div>
        ) : (
          <>
            {/* Colleges Grid */}
            {results.length > 0 ? (
              <div className="colleges-grid">
                {results.map((college) => (
                  <CollegeCard key={college.id} college={college} />
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "4rem 2rem",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-lg)",
                  maxWidth: "600px",
                  margin: "2rem auto"
                }}
              >
                <span style={{ fontSize: "3rem" }}>🔍</span>
                <h3 style={{ fontSize: "1.25rem", marginTop: "1rem", color: "var(--text-primary)" }}>No colleges found</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "0.5rem" }}>
                  We couldn't find any college matching &quot;{query}&quot;. Try typing another name.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}

