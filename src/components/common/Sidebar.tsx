"use client";

import React, { useEffect, useState } from "react";

interface SidebarProps {
  parameters: Array<{ name: string }>;
  averages: Record<string, string>;
}

export default function Sidebar({ parameters, averages }: SidebarProps) {
  const [activeId, setActiveId] = useState("");

  const toId = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // Focus observer near top-middle of screen
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    parameters.forEach((param) => {
      const id = toId(param.name);
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [parameters]);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // Set active ID immediately on click for instantaneous responsiveness
      setActiveId(id);
    }
  };

  return (
    <aside className="dashboard-sidebar">
      <h2 className="sidebar-title">Rating Sections</h2>
      <ul className="sidebar-menu">
        {parameters.map((param) => {
          const id = toId(param.name);
          const isActive = activeId === id;
          const score = averages[param.name] || "Unrated";
          
          return (
            <li key={param.name}>
              <a
                href={`#${id}`}
                onClick={(e) => handleScroll(e, id)}
                className={`sidebar-link ${isActive ? "active" : ""}`}
              >
                <span>{param.name}</span>
                <span className="sidebar-avg">
                  {score === "Unrated" ? "—" : score}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
