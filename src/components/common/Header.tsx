"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/home/AuthModal";

interface HeaderProps {
  onLoginClick?: () => void;
}

export default function Header({ onLoginClick }: HeaderProps) {
  const { user, profile, role, signOut, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname() || "";
  const [showAuthModalInternal, setShowAuthModalInternal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isHomeActive = pathname === "/";
  const isCollegesActive = pathname.startsWith("/colleges");
  const isDashboardActive = pathname === "/dashboard";

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Failed to sign out:", err);
    }
  };

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      setShowAuthModalInternal(true);
    }
  };

  return (
    <header className="header-wrapper glass">
      <div className="header-left">
        <Link href="/" className="header-logo" onClick={() => setIsMenuOpen(false)}>
          <span>College</span>
          <span className="logo-vibe">VibeCheck</span>
        </Link>

        <nav className="header-nav">
          <Link
            href="/"
            className={`header-nav-link ${isHomeActive ? "active" : ""}`}
          >
            Home
          </Link>
          <Link
            href="/colleges"
            className={`header-nav-link ${isCollegesActive ? "active" : ""}`}
          >
            Colleges
          </Link>
          {role === "student" && (
            <Link
              href="/dashboard"
              className={`header-nav-link ${isDashboardActive ? "active" : ""}`}
            >
              Dashboard
            </Link>
          )}
        </nav>
      </div>

      <nav className="header-actions">
        {loading ? (
          <div className="spinner" style={{ width: "20px", height: "20px" }}></div>
        ) : user ? (
          <>
            <div className="user-badge">
              <div className="user-avatar">
                {profile?.username ? profile.username[0].toUpperCase() : user.email?.[0].toUpperCase() || "U"}
              </div>
              <span className="user-badge-name">
                {profile?.username || user.email?.split("@")[0]}
              </span>
              {role && (
                <span className={`badge badge-${role}`}>
                  {role}
                </span>
              )}
            </div>
            <button onClick={handleLogout} className="btn btn-secondary header-logout-btn">
              Logout
            </button>
          </>
        ) : (
          <button onClick={handleLoginClick} className="btn btn-primary header-login-btn">
            Login / Signup
          </button>
        )}
      </nav>

      {/* Mobile Hamburger Menu Toggle */}
      <button
        className="header-menu-toggle"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={isMenuOpen}
      >
        {isMenuOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        )}
      </button>

      {/* Mobile Drawer Overlay */}
      {isMenuOpen && (
        <div className="mobile-nav-drawer glass">
          <nav className="mobile-nav-links">
            <Link
              href="/"
              className={`mobile-nav-link ${isHomeActive ? "active" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/colleges"
              className={`mobile-nav-link ${isCollegesActive ? "active" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Colleges
            </Link>
            {role === "student" && (
              <Link
                href="/dashboard"
                className={`mobile-nav-link ${isDashboardActive ? "active" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
          </nav>

          <div className="mobile-nav-footer">
            {loading ? (
              <div className="spinner" style={{ width: "20px", height: "20px", margin: "0 auto" }}></div>
            ) : user ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
                <div className="user-badge" style={{ justifyContent: "center", width: "100%" }}>
                  <div className="user-avatar">
                    {profile?.username ? profile.username[0].toUpperCase() : user.email?.[0].toUpperCase() || "U"}
                  </div>
                  <span className="user-badge-name">
                    {profile?.username || user.email?.split("@")[0]}
                  </span>
                  {role && (
                    <span className={`badge badge-${role}`}>
                      {role}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="btn btn-secondary"
                  style={{ width: "100%", padding: "0.75rem" }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => { handleLoginClick(); setIsMenuOpen(false); }}
                className="btn btn-primary"
                style={{ width: "100%", padding: "0.75rem" }}
              >
                Login / Signup
              </button>
            )}
          </div>
        </div>
      )}

      {showAuthModalInternal && (
        <AuthModal onClose={() => setShowAuthModalInternal(false)} />
      )}
    </header>
  );
}

