"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AppHeader from "./components/AppHeader";
import flashcardData from "./data/poseFlashcards.json";
import { getJoint, getPoseFigure, getStroke } from "./data/poseFigures.js";
import { buildCueSets, buildPoseList, getCategoryOptions } from "./lib/poseStudy";

const clampIndex = (value, length) => (value + length) % length;
const SWIPE_THRESHOLD = 45;

const QUIZ_OPTIONS = [
  { id: "sanskrit", label: "Sanskrit" },
  { id: "breath", label: "Breath" },
  { id: "cues", label: "Cues" },
];

function PoseSilhouette({ poseId }) {
  const figure = getPoseFigure(poseId);
  const stroke = getStroke();
  const joint = getJoint();
  const joints = useMemo(() => {
    const points = new Map();
    figure.limbs.forEach((limb) => {
      limb.forEach(([x, y]) => points.set(`${x},${y}`, { x, y }));
    });
    return Array.from(points.values());
  }, [figure.limbs]);

  return (
    <svg className="pose-silhouette" viewBox="0 0 240 240" aria-hidden="true">
      <defs>
        <linearGradient id="ink" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a102e" />
          <stop offset="1" stopColor="#5a1f4c" />
        </linearGradient>
      </defs>
      <circle cx={figure.head[0]} cy={figure.head[1]} r={figure.head[2]} fill="url(#ink)" />
      {figure.limbs.map((limb, limbIndex) => (
        <polyline
          key={`${poseId}-limb-${limbIndex}`}
          points={limb.map((point) => `${point[0]},${point[1]}`).join(" ")}
          fill="none"
          stroke={stroke.color}
          strokeWidth={stroke.width}
          strokeLinecap={stroke.cap}
          strokeLinejoin={stroke.join}
        />
      ))}
      {joints.map((point, index) => (
        <circle
          key={`${poseId}-joint-${index}`}
          cx={point.x}
          cy={point.y}
          r={joint.radius}
          fill={joint.color}
        />
      ))}
    </svg>
  );
}

function PoseImage({ src, fallbackSrc, alt, poseId }) {
  const [hasError, setHasError] = useState(false);
  const [resolvedSrc, setResolvedSrc] = useState(src);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    setResolvedSrc(src);
    setHasError(false);
    setUsedFallback(false);
  }, [src, fallbackSrc, poseId]);

  const handleError = () => {
    if (!usedFallback && fallbackSrc && fallbackSrc !== resolvedSrc) {
      setResolvedSrc(fallbackSrc);
      setUsedFallback(true);
      return;
    }
    setHasError(true);
  };

  return (
    <div className="photo-frame">
      {!hasError && (
        <img
          className="pose-photo"
          src={resolvedSrc}
          alt={alt}
          loading="lazy"
          onError={handleError}
        />
      )}
      {hasError && (
        <div className="pose-fallback" aria-hidden="true">
          <PoseSilhouette poseId={poseId} />
        </div>
      )}
      <div className="photo-glow" aria-hidden="true" />
    </div>
  );
}

export default function App() {
  const fullPoseList = useMemo(() => buildPoseList(flashcardData), []);
  const categoryOptions = useMemo(() => getCategoryOptions(fullPoseList), [fullPoseList]);

  const [activeFilters, setActiveFilters] = useState([]);
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState("study");
  const [quizType, setQuizType] = useState("sanskrit");
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [cueSetIndex, setCueSetIndex] = useState(0);
  const [drag, setDrag] = useState({ x: 0, y: 0, isDragging: false });

  const start = useRef({ x: 0, y: 0 });
  const startedInScrollableArea = useRef(false);
  const gestureAxis = useRef(null);
  const dragRef = useRef({ x: 0, y: 0, isDragging: false });
  const swipeMeta = useRef({ startTime: 0, lastX: 0, lastTime: 0 });
  const isAnimatingSwipe = useRef(false);

  const triggerHaptic = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(12);
    }
  };

  const filteredPoses = useMemo(() => {
    if (!activeFilters.length) return fullPoseList;
    return fullPoseList.filter((pose) =>
      pose.categories.some((category) => activeFilters.includes(category))
    );
  }, [activeFilters, fullPoseList]);

  const hasPoses = filteredPoses.length > 0;
  const current = hasPoses ? filteredPoses[clampIndex(index, filteredPoses.length)] : null;
  const nextPose = hasPoses ? filteredPoses[clampIndex(index + 1, filteredPoses.length)] : null;

  useEffect(() => {
    setCueSetIndex(0);
  }, [current?.id, mode]);

  const cueSets = useMemo(() => (current ? buildCueSets(current) : []), [current]);
  const activeCueSet = cueSets.length ? cueSets[cueSetIndex % cueSets.length] : null;

  const dragStyle = useMemo(() => {
    const rotate = drag.x / 20;
    const scale = drag.isDragging ? 1.01 : 1;
    return {
      transform: `translate3d(${drag.x}px, ${drag.y}px, 0) rotate(${rotate}deg) scale(${scale})`,
      transition: drag.isDragging ? "none" : "transform 280ms ease",
    };
  }, [drag]);

  const shouldIgnoreDragStart = (target) => {
    if (!(target instanceof Element)) return false;
    return Boolean(target.closest("button, a, input, textarea, select, [role='button']"));
  };

  const resetDrag = () => {
    isAnimatingSwipe.current = false;
    const next = { x: 0, y: 0, isDragging: false };
    dragRef.current = next;
    setDrag(next);
    startedInScrollableArea.current = false;
    gestureAxis.current = null;
  };

  const beginDrag = (x, y) => {
    if (isAnimatingSwipe.current) return;
    start.current = { x, y };
    gestureAxis.current = null;
    const now = Date.now();
    swipeMeta.current = { startTime: now, lastX: x, lastTime: now };
    const next = { x: 0, y: 0, isDragging: true };
    dragRef.current = next;
    setDrag(next);
  };

  const updateDrag = (x, y, event) => {
    if (!dragRef.current.isDragging || startedInScrollableArea.current || isAnimatingSwipe.current) {
      return;
    }

    const dx = x - start.current.x;
    const dy = y - start.current.y;

    if (!gestureAxis.current && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      gestureAxis.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }

    if (gestureAxis.current === "y") return;

    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }

    const now = Date.now();
    swipeMeta.current.lastX = x;
    swipeMeta.current.lastTime = now;
    const next = { x: dx, y: dy * 0.2, isDragging: true };
    dragRef.current = next;
    setDrag(next);
  };

  const finalizeDrag = (endX, endY) => {
    const liveDrag = dragRef.current;
    if (!liveDrag.isDragging || isAnimatingSwipe.current) return;

    let dx = liveDrag.x;
    let dy = liveDrag.y;

    if (typeof endX === "number" && typeof endY === "number") {
      dx = endX - start.current.x;
      dy = endY - start.current.y;
    }

    if (!gestureAxis.current && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      gestureAxis.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }

    if (gestureAxis.current !== "x") {
      resetDrag();
      return;
    }

    const elapsed = Math.max(1, swipeMeta.current.lastTime - swipeMeta.current.startTime);
    const velocityX = (swipeMeta.current.lastX - start.current.x) / elapsed;
    const shouldSwipe = Math.abs(dx) >= SWIPE_THRESHOLD || Math.abs(velocityX) > 0.45;

    if (!shouldSwipe || filteredPoses.length === 0) {
      resetDrag();
      return;
    }

    const direction = dx < 0 ? 1 : -1;
    const offscreen = (typeof window !== "undefined" ? window.innerWidth : 420) * 1.15;
    isAnimatingSwipe.current = true;
    const next = { x: direction === 1 ? -offscreen : offscreen, y: 0, isDragging: false };
    dragRef.current = next;
    setDrag(next);

    setTimeout(() => {
      setIndex((value) => clampIndex(value + direction, filteredPoses.length));
      setQuizRevealed(false);
      triggerHaptic();
      resetDrag();
    }, 170);
  };

  const handlePointerDown = (event) => {
    if (event.pointerType === "touch") return;
    startedInScrollableArea.current = shouldIgnoreDragStart(event.target);
    if (startedInScrollableArea.current) return;
    if (event.currentTarget.setPointerCapture && event.pointerId !== undefined) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    beginDrag(event.clientX, event.clientY);
  };

  const handlePointerMove = (event) => {
    if (event.pointerType === "touch") return;
    updateDrag(event.clientX, event.clientY, event);
  };

  const handlePointerUp = (event) => {
    if (event?.pointerType === "touch") return;
    finalizeDrag(event?.clientX, event?.clientY);
  };

  const handleTouchStart = (event) => {
    startedInScrollableArea.current = shouldIgnoreDragStart(event.target);
    if (startedInScrollableArea.current) return;
    const touch = event.touches[0];
    if (!touch) return;
    beginDrag(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    updateDrag(touch.clientX, touch.clientY, event);
  };

  const handleTouchEnd = (event) => {
    const touch = event.changedTouches?.[0];
    if (touch) {
      finalizeDrag(touch.clientX, touch.clientY);
      return;
    }
    finalizeDrag();
  };

  const toggleFilter = (category) => {
    if (category === "All") {
      setActiveFilters([]);
      setIndex(0);
      setQuizRevealed(false);
      return;
    }
    setActiveFilters((prev) => {
      const exists = prev.includes(category);
      const next = exists ? prev.filter((item) => item !== category) : [...prev, category];
      setIndex(0);
      setQuizRevealed(false);
      return next;
    });
  };

  const quizAnswer = useMemo(() => {
    if (!current) return null;
    if (quizType === "sanskrit") return current.sanskrit;
    if (quizType === "breath") return current.breath;
    if (activeCueSet?.cues?.length) return activeCueSet.cues.join(" • ");
    return current.teachingCues.general.join(" ");
  }, [current, quizType, activeCueSet]);

  return (
    <div className="phone-shell">
      <div className="app">
        <AppHeader
          activePage="study"
          progressText={`${String(hasPoses ? index + 1 : 0).padStart(2, "0")}/${String(
            filteredPoses.length
          ).padStart(2, "0")}`}
        />

        <div className="content-layout">
          <aside className="control-panel">
            <section className="panel-block">
              <p className="panel-label">Session</p>
              <div className="filters">
                <button
                  className={`filter-chip mode-chip ${mode === "study" ? "active" : ""}`}
                  type="button"
                  onClick={() => {
                    setMode("study");
                    setQuizRevealed(false);
                  }}
                >
                  Study
                </button>
                <button
                  className={`filter-chip mode-chip ${mode === "quiz" ? "active" : ""}`}
                  type="button"
                  onClick={() => {
                    setMode("quiz");
                    setQuizRevealed(false);
                  }}
                >
                  Quiz
                </button>
              </div>
            </section>

            {mode === "quiz" && (
              <section className="panel-block">
                <p className="panel-label">Quiz Focus</p>
                <div className="quiz-switches">
                  {QUIZ_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      className={`filter-chip ${quizType === option.id ? "active" : ""}`}
                      type="button"
                      onClick={() => {
                        setQuizType(option.id);
                        setQuizRevealed(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </section>
            )}

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
            <section className="deck">
              {!hasPoses ? (
                <div className="empty-state">
                  <p>No poses match those filters.</p>
                  <button type="button" onClick={() => toggleFilter("All")}>
                    Clear filters
                  </button>
                </div>
              ) : (
                <>
                  <article className="card back-card peek-card" aria-hidden="true">
                    <div className="card-body">
                      <p className="card-label">Coming Up</p>
                      <h2>{nextPose.english}</h2>
                      <p className="sanskrit">{nextPose.sanskrit}</p>
                    </div>
                  </article>
                  <article className="card back-card" aria-hidden="true">
                    <div className="card-body">
                      <p className="card-label">Up Next</p>
                      <h2>{nextPose.english}</h2>
                      <p className="sanskrit">{nextPose.sanskrit}</p>
                    </div>
                  </article>

                  <article
                    className="card active-card"
                    style={dragStyle}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchEnd}
                  >
                    <div className="card-media">
                      <div className="edge-taps">
                        <button
                          className="side-nav prev"
                          type="button"
                          aria-label="Previous pose"
                          onClick={() => {
                            setIndex((value) => clampIndex(value - 1, filteredPoses.length));
                            setQuizRevealed(false);
                            triggerHaptic();
                          }}
                        />
                        <button
                          className="side-nav next"
                          type="button"
                          aria-label="Next pose"
                          onClick={() => {
                            setIndex((value) => clampIndex(value + 1, filteredPoses.length));
                            setQuizRevealed(false);
                            triggerHaptic();
                          }}
                        />
                      </div>
                      <PoseImage
                        src={current.image}
                        fallbackSrc={current.imageFallback}
                        alt={current.english}
                        poseId={current.id}
                      />
                    </div>
                    <div className={`card-body ${mode === "study" ? "study-body" : ""}`}>
                      <div className="card-top">
                        <div>
                          <p className="card-label">{mode === "study" ? "Current Pose" : "Quiz Card"}</p>
                          <h2>{current.english}</h2>
                          {mode === "study" && <p className="sanskrit">{current.sanskrit}</p>}
                        </div>
                        <div className="chip">{mode === "study" ? "Study" : `${current.alignmentCues.length} cues`}</div>
                      </div>

                      <div className="meta-row">
                        {mode === "study" ? (
                          <div className="meta-pill">Breath: {current.breath}</div>
                        ) : (
                          <div className="meta-pill">Difficulty: {current.difficulty}</div>
                        )}
                        <div className="meta-tags">
                          {current.categories.map((category) => (
                            <span key={category}>{category}</span>
                          ))}
                        </div>
                      </div>

                      {mode === "study" ? (
                        <section className="cue-section">
                          <div className="cue-header">
                            <div>
                              <p className="card-label">Cue Lens</p>
                              <p className="cue-lens-title">{activeCueSet?.title || "Teaching Lens"}</p>
                            </div>
                            <button
                              type="button"
                              className="cue-refresh"
                              aria-label="Show next cue set"
                              title="Show next cue set"
                              onClick={() =>
                                setCueSetIndex((value) => (value + 1) % Math.max(1, cueSets.length))
                              }
                            >
                              <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M20 12a8 8 0 1 1-2.3-5.7" />
                                <path d="M20 4v6h-6" />
                              </svg>
                            </button>
                          </div>
                          <ul className="cues study-snapshot">
                            {(activeCueSet?.cues || []).map((cue) => (
                              <li key={cue} className="study-line">
                                {cue}
                              </li>
                            ))}
                          </ul>
                          <p className="cue-note">Tap refresh to rotate through 3 teacher cue lenses.</p>
                        </section>
                      ) : (
                        <div className="quiz-panel">
                          <p className="quiz-question">
                            {quizType === "sanskrit" && "What is the Sanskrit name for this pose?"}
                            {quizType === "breath" && "Is this pose inhale or exhale focused?"}
                            {quizType === "cues" && "Name one direct cue you would teach."}
                          </p>
                          {quizRevealed ? (
                            <p className="quiz-answer">{quizAnswer}</p>
                          ) : (
                            <button
                              type="button"
                              className="solid reveal-btn"
                              onClick={() => setQuizRevealed(true)}
                            >
                              Reveal Answer
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                </>
              )}
            </section>

            <footer className="controls">
              <button
                className="ghost"
                type="button"
                onClick={() => {
                  setIndex((value) => clampIndex(value - 1, filteredPoses.length));
                  setQuizRevealed(false);
                  triggerHaptic();
                }}
                disabled={filteredPoses.length === 0}
              >
                Previous
              </button>
              <div className="hint">Swipe or use arrows to study</div>
              <button
                className="solid"
                type="button"
                onClick={() => {
                  setIndex((value) => clampIndex(value + 1, filteredPoses.length));
                  setQuizRevealed(false);
                  triggerHaptic();
                }}
                disabled={filteredPoses.length === 0}
              >
                Next
              </button>
            </footer>
          </section>
        </div>
      </div>
    </div>
  );
}
