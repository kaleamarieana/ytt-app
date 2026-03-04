"use client";

import Link from "next/link";
import { useThemePreference } from "../hooks/useThemePreference";

const NAV_ITEMS = [
  { id: "study", label: "Study", href: "/" },
  { id: "adjustments", label: "Adjustments", href: "/adjustments" },
  { id: "flow", label: "Flow Builder", href: "/flow-builder" },
];

export default function AppHeader({ activePage, progressText }) {
  const { activeTheme, toggleTheme } = useThemePreference();

  return (
    <div className="header-stack">
      <header className="top-bar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 64 64">
              <path d="M32 8c5 7 5 13 0 20-5-7-5-13 0-20Z" />
              <path d="M15 23c8 1 13 4 17 11-8 0-14-3-17-11Z" />
              <path d="M49 23c-3 8-9 11-17 11 4-7 10-10 17-11Z" />
              <path d="M20 43c6-4 12-4 18 0-6 6-12 6-18 0Z" />
              <path d="M44 43c-6-4-12-4-18 0 6 6 12 6 18 0Z" />
            </svg>
          </div>
          <div className="brand-text">
            <p className="eyebrow">Yoga Teacher Training</p>
            <h1 className="logo-wordmark">
              <span className="logo-my">My</span>
              <span className="logo-lotus-inline" aria-hidden="true">
                <svg viewBox="0 0 32 32">
                  <path d="M16 5.5c2.4 3.2 2.5 6.1 0 9.3-2.4-3.2-2.3-6.1 0-9.3Z" />
                  <path d="M7.2 13.4c3.9.2 6.4 1.8 8.8 5-4-.1-6.6-1.8-8.8-5Z" />
                  <path d="M24.8 13.4c-2.2 3.2-4.8 4.9-8.8 5 2.4-3.2 4.9-4.8 8.8-5Z" />
                  <path d="M11 22.1c1.8-1.2 3.5-1.6 5-1.6s3.2.4 5 1.6c-1.7 2-3.4 2.9-5 2.9s-3.3-.9-5-2.9Z" />
                </svg>
              </span>
              <span className="logo-name">Sadhana</span>
            </h1>
          </div>
        </div>

        <div className="top-actions">
          {progressText ? <div className="progress">{progressText}</div> : null}
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={activeTheme === "night" ? "Switch to day mode" : "Switch to night mode"}
            title={activeTheme === "night" ? "Switch to day mode" : "Switch to night mode"}
          >
            {activeTheme === "night" ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="4.4" />
                <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.2 5.2l1.8 1.8M17 17l1.8 1.8M18.8 5.2L17 7M7 17l-1.8 1.8" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.4 14.9A8.4 8.4 0 1 1 9.1 3.6a7.1 7.1 0 1 0 11.3 11.3Z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <nav className="page-nav" aria-label="Primary">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`nav-chip ${activePage === item.id ? "active" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
