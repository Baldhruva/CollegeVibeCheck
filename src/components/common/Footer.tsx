import React from "react";

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="container footer-content">
        <div className="footer-brand">
          College<span style={{ color: "var(--primary)" }}>VibeCheck</span>
        </div>
        <div className="footer-info">
          <span>Created by Balben</span>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Contact: support@collegevibecheck.com
          </span>
        </div>
      </div>
    </footer>
  );
}
