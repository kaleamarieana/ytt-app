"use client";

import { useMemo, useState } from "react";
import AppHeader from "./components/AppHeader";
import flashcardData from "./data/poseFlashcards.json";
import { buildPoseList, generateFlowTemplate } from "./lib/poseStudy";

const STYLE_OPTIONS = [
  { id: "vinyasa", label: "Vinyasa" },
  { id: "hatha", label: "Hatha" },
  { id: "yin", label: "Yin" },
  { id: "ashtanga", label: "Ashtanga" },
];

const LEVEL_OPTIONS = [
  { id: "beginner", label: "Beginner" },
  { id: "mixed", label: "Mixed" },
  { id: "advanced", label: "Advanced" },
];

export default function FlowBuilderPage() {
  const poses = useMemo(() => buildPoseList(flashcardData), []);

  const [style, setStyle] = useState("vinyasa");
  const [level, setLevel] = useState("mixed");
  const [duration, setDuration] = useState(60);
  const [seed, setSeed] = useState(0);
  const [copied, setCopied] = useState(false);

  const flow = useMemo(
    () => generateFlowTemplate({ style, duration, level, seed }, poses),
    [style, duration, level, seed, poses]
  );

  const totalMinutes = flow.reduce((total, block) => total + block.minutes, 0);

  const exportFlow = async () => {
    const text = [
      `My Sadhana Flow Plan (${style.toUpperCase()}, ${duration} min, ${level})`,
      ...flow.map(
        (block, index) =>
          `${index + 1}. ${block.name} (${block.minutes} min) - ${block.suggested
            .map((pose) => pose.english)
            .join(", ")}`
      ),
    ].join("\n");

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }
  };

  return (
    <div className="phone-shell">
      <div className="app">
        <AppHeader activePage="flow" progressText={`${totalMinutes} min planned`} />

        <div className="content-layout">
          <aside className="control-panel">
            <section className="panel-block">
              <p className="panel-label">Class Style</p>
              <div className="filters">
                {STYLE_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`filter-chip ${style === option.id ? "active" : ""}`}
                    onClick={() => setStyle(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="panel-block">
              <p className="panel-label">Student Level</p>
              <div className="filters">
                {LEVEL_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`filter-chip ${level === option.id ? "active" : ""}`}
                    onClick={() => setLevel(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="panel-block">
              <p className="panel-label">Duration</p>
              <div className="flow-duration-row">
                <input
                  type="range"
                  min="30"
                  max="120"
                  step="5"
                  value={duration}
                  onChange={(event) => setDuration(Number(event.target.value))}
                />
                <span>{duration} min</span>
              </div>
            </section>

            <section className="panel-block flow-actions">
              <button type="button" className="solid" onClick={() => setSeed((value) => value + 1)}>
                Regenerate Suggestions
              </button>
              <button type="button" className="ghost" onClick={exportFlow}>
                {copied ? "Copied" : "Copy Plan"}
              </button>
            </section>
          </aside>

          <section className="study-panel">
            <article className="card flow-card">
              <div className="card-body">
                <div className="card-top">
                  <div>
                    <p className="card-label">Smart Class Builder</p>
                    <h2>{style[0].toUpperCase() + style.slice(1)} Teacher Sequence</h2>
                    <p className="sanskrit">Balanced progression, timing, and pose suggestions.</p>
                  </div>
                  <div className="chip">{totalMinutes} min</div>
                </div>

                <div className="flow-grid">
                  {flow.map((block, index) => (
                    <section key={block.id} className="flow-block">
                      <div className="flow-block-head">
                        <p>{index + 1}. {block.name}</p>
                        <span>{block.minutes} min</span>
                      </div>
                      <p className="flow-intention">{block.intention}</p>
                      <div className="meta-tags">
                        {block.categories.map((category) => (
                          <span key={`${block.id}-${category}`}>{category}</span>
                        ))}
                      </div>
                      <ul className="flow-pose-list">
                        {block.suggested.map((pose) => (
                          <li key={`${block.id}-${pose.id}`}>{pose.english}</li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </div>
            </article>
          </section>
        </div>
      </div>
    </div>
  );
}
