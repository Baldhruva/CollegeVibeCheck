"use client";

import React, { useState, useRef, useEffect } from "react";

interface CollegeSearchBarProps {
  query: string;
  onChange: (value: string) => void;
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
}

export default function CollegeSearchBar({
  query,
  onChange,
  suggestions,
  onSelectSuggestion,
}: CollegeSearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsOpen(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSelectSuggestion(suggestion);
    setIsOpen(false);
  };

  return (
    <div className="search-bar-container" ref={containerRef} style={{ position: "relative", width: "100%", maxWidth: "600px", margin: "0 auto 2rem auto" }}>
      <div className="search-input-wrapper" style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <input
          type="text"
          className="search-input"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Search Mumbai colleges (e.g. VJTI, SPIT, DJ Sanghavi...)"
        />
        {query && (
          <button
            onClick={() => { onChange(""); setIsOpen(false); }}
            style={{
              position: "absolute",
              right: "1.25rem",
              color: "var(--text-muted)",
              fontSize: "1.1rem",
              background: "none",
              border: "none",
              cursor: "pointer"
            }}
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="autocomplete-dropdown glass">
          {suggestions.map((suggestion, idx) => (
            <li key={idx}>
              <button
                onClick={() => handleSuggestionClick(suggestion)}
                className="autocomplete-item"
              >
                🔍 <strong style={{ color: "var(--accent)", marginLeft: "0.25rem" }}>{suggestion}</strong>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

