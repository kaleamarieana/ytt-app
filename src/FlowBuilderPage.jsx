"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [savedFlows, setSavedFlows] = useState([]);
  const [shareStatus, setShareStatus] = useState("");

  const flow = useMemo(
    () => generateFlowTemplate({ style, duration, level, seed }, poses),
    [style, duration, level, seed, poses]
  );

  const totalMinutes = flow.reduce((total, block) => total + block.minutes, 0);

  const buildFlowText = () =>
    [
      `My Sadhana Flow Plan (${style.toUpperCase()}, ${duration} min, ${level})`,
      ...flow.map(
        (block, index) =>
          `${index + 1}. ${block.name} (${block.minutes} min) - ${block.suggested
            .map((pose) => pose.english)
            .join(", ")}`
      ),
    ].join("\n");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("ytt-saved-flows");
    if (!saved) return;
    try {
      setSavedFlows(JSON.parse(saved));
    } catch {
      setSavedFlows([]);
    }
  }, []);

  const persistSavedFlows = (items) => {
    setSavedFlows(items);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("ytt-saved-flows", JSON.stringify(items));
    }
  };

  const exportFlow = async () => {
    const text = buildFlowText();

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }
  };

  const saveAsNote = () => {
    const text = buildFlowText();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `my-sadhana-flow-${style}-${duration}min.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const saveAsPdf = () => {
    const text = buildFlowText()
      .split("\n")
      .map((line) => `<p>${line.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`)
      .join("");

    const win = window.open("", "_blank", "width=900,height=1100");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>My Sadhana Flow</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 28px; color: #1f2d33; }
            h1 { margin: 0 0 14px; }
            p { margin: 0 0 8px; line-height: 1.45; }
          </style>
        </head>
        <body>
          <h1>My Sadhana Flow Plan</h1>
          ${text}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  const saveFlow = () => {
    const item = {
      id: `flow-${Date.now()}`,
      createdAt: new Date().toISOString(),
      style,
      level,
      duration,
      text: buildFlowText(),
    };
    const next = [item, ...savedFlows].slice(0, 8);
    persistSavedFlows(next);
    setShareStatus("Flow saved locally");
    setTimeout(() => setShareStatus(""), 1500);
  };

  const shareFlow = async () => {
    const text = buildFlowText();
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({
        title: "My Sadhana Flow Plan",
        text,
      });
      return;
    }
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      setShareStatus("Plan copied to share");
      setTimeout(() => setShareStatus(""), 1500);
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
              <button type="button" className="ghost" onClick={saveFlow}>
                Save Flow
              </button>
              <button type="button" className="ghost" onClick={saveAsNote}>
                Save as Note
              </button>
              <button type="button" className="ghost" onClick={saveAsPdf}>
                Save as PDF
              </button>
              <button type="button" className="ghost" onClick={shareFlow}>
                Share
              </button>
              {shareStatus ? <p className="flow-status">{shareStatus}</p> : null}
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

                {savedFlows.length ? (
                  <section className="saved-flows">
                    <p className="card-label">Saved Flows</p>
                    <ul>
                      {savedFlows.map((saved) => (
                        <li key={saved.id}>
                          {saved.style.toUpperCase()} • {saved.duration} min •{" "}
                          {new Date(saved.createdAt).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}
              </div>
            </article>
          </section>
        </div>
      </div>
    </div>
  );
}
