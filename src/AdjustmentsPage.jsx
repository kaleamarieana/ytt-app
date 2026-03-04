"use client";

import { useMemo, useState } from "react";
import AppHeader from "./components/AppHeader";
import flashcardData from "./data/poseFlashcards.json";
import { buildAssistSets, buildPoseList, getCategoryOptions } from "./lib/poseStudy";

const clampIndex = (value, length) => (value + length) % length;

export default function AdjustmentsPage() {
  const fullPoseList = useMemo(() => buildPoseList(flashcardData), []);
  const categoryOptions = useMemo(() => getCategoryOptions(fullPoseList), [fullPoseList]);

  const [activeFilters, setActiveFilters] = useState([]);
  const [index, setIndex] = useState(0);

  const filteredPoses = useMemo(() => {
    if (!activeFilters.length) return fullPoseList;
    return fullPoseList.filter((pose) =>
      pose.categories.some((category) => activeFilters.includes(category))
    );
  }, [activeFilters, fullPoseList]);

  const hasPoses = filteredPoses.length > 0;
  const current = hasPoses ? filteredPoses[clampIndex(index, filteredPoses.length)] : null;

  const assists = useMemo(() => (current ? buildAssistSets(current) : []), [current]);

  const toggleFilter = (category) => {
    if (category === "All") {
      setActiveFilters([]);
      setIndex(0);
      return;
    }
    setActiveFilters((prev) => {
      const exists = prev.includes(category);
      const next = exists ? prev.filter((item) => item !== category) : [...prev, category];
      setIndex(0);
      return next;
    });
  };

  return (
    <div className="phone-shell">
      <div className="app">
        <AppHeader
          activePage="adjustments"
          progressText={`${String(hasPoses ? index + 1 : 0).padStart(2, "0")}/${String(
            filteredPoses.length
          ).padStart(2, "0")}`}
        />

        <div className="content-layout">
          <aside className="control-panel">
            <section className="panel-block">
              <p className="panel-label">Assist Lens</p>
              <p className="panel-help">
                Three practical adjustment options per pose: verbal, hands-on (consent-based), and props.
              </p>
            </section>

            <section className="panel-block">
              <p className="panel-label">Categories</p>
              <div className="filters">
                <button
                  className={`filter-chip ${activeFilters.length === 0 ? "active" : ""}`}
                  type="button"
                  onClick={() => toggleFilter("All")}
                >
                  All
                </button>
                {categoryOptions.map((category) => (
                  <button
                    key={category}
                    className={`filter-chip ${activeFilters.includes(category) ? "active" : ""}`}
                    type="button"
                    onClick={() => toggleFilter(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </section>
          </aside>

          <section className="study-panel">
            {!hasPoses ? (
              <div className="empty-state">
                <p>No poses match those filters.</p>
                <button type="button" onClick={() => toggleFilter("All")}>
                  Clear filters
                </button>
              </div>
            ) : (
              <article className="card adjustments-card">
                <div className="card-media">
                  <img className="pose-photo" src={current.image} alt={current.english} loading="lazy" />
                </div>

                <div className="card-body">
                  <div className="card-top">
                    <div>
                      <p className="card-label">Teacher Assist Lab</p>
                      <h2>{current.english}</h2>
                      <p className="sanskrit">{current.sanskrit}</p>
                    </div>
                    <div className="chip">{current.difficulty}</div>
                  </div>

                  <div className="assist-grid">
                    {assists.map((assist) => (
                      <section key={assist.id} className="assist-card">
                        <p className="assist-kicker">{assist.type}</p>
                        <h3>{assist.title}</h3>
                        <ul>
                          {assist.steps.map((step) => (
                            <li key={step}>{step}</li>
                          ))}
                        </ul>
                        <p className="assist-safety">{assist.safety}</p>
                      </section>
                    ))}
                  </div>
                </div>
              </article>
            )}

            <footer className="controls">
              <button
                className="ghost"
                type="button"
                onClick={() => setIndex((value) => clampIndex(value - 1, filteredPoses.length))}
                disabled={filteredPoses.length === 0}
              >
                Previous Pose
              </button>
              <div className="hint">Detailed assists per pose, built for teacher training.</div>
              <button
                className="solid"
                type="button"
                onClick={() => setIndex((value) => clampIndex(value + 1, filteredPoses.length))}
                disabled={filteredPoses.length === 0}
              >
                Next Pose
              </button>
            </footer>
          </section>
        </div>
      </div>
    </div>
  );
}
