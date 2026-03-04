export const CATEGORY_ORDER = [
  "Standing",
  "Seated",
  "Balance",
  "Twist",
  "Inversion",
  "Backbend",
  "Forward Fold",
  "Arm Balance",
  "Hip Opener",
  "Core",
  "Restorative",
  "Warm-up",
];

const EXHALE_KEYWORDS = [
  "forward fold",
  "fold",
  "downward",
  "twist",
  "revolved",
  "chaturanga",
  "crow",
  "firefly",
  "peacock",
  "child",
  "cat",
  "garland",
];

const EXHALE_CATEGORIES = new Set(["Forward Fold", "Twist", "Arm Balance", "Core", "Restorative"]);

const sentenceCase = (text = "") => {
  const trimmed = String(text).trim().replace(/[.]+$/, "");
  if (!trimmed) return "";
  return trimmed[0].toUpperCase() + trimmed.slice(1);
};

export const inferBreathCue = (pose) => {
  const name = `${pose.englishName} ${pose.sanskritName}`.toLowerCase();
  if (EXHALE_KEYWORDS.some((keyword) => name.includes(keyword))) return "Exhale";
  if (EXHALE_CATEGORIES.has(pose.category)) return "Exhale";
  return "Inhale";
};

export const buildPoseList = (flashcardData) =>
  flashcardData.poses.map((pose) => ({
    ...pose,
    breath: inferBreathCue(pose),
    english: pose.englishName,
    sanskrit: pose.sanskritName,
    image: pose.image.url || `/images/poses/${pose.image.filename}`,
    categories: [pose.category],
  }));

export const getCategoryOptions = (poses) => {
  const unique = Array.from(new Set(poses.flatMap((pose) => pose.categories)));
  return unique.sort((a, b) => {
    const aIndex = CATEGORY_ORDER.indexOf(a);
    const bIndex = CATEGORY_ORDER.indexOf(b);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.localeCompare(b);
  });
};

export const buildCueSets = (pose) => {
  const alignment = (pose.alignmentCues || []).slice(0, 3).map(sentenceCase).filter(Boolean);

  const teaching = [
    ...(pose.teachingCues?.general || []),
    ...(pose.teachingCues?.beginner || []),
    ...(pose.teachingCues?.limitedMobility || []),
  ]
    .slice(0, 3)
    .map(sentenceCase)
    .filter(Boolean);

  const refinement = [
    ...(pose.commonMistakes || []).slice(0, 2).map((mistake) => `Avoid: ${sentenceCase(mistake)}`),
    pose.teachingCues?.limitedMobility?.[0]
      ? `Option: ${sentenceCase(pose.teachingCues.limitedMobility[0])}`
      : "Option: Shorten your stance and keep smooth breath",
  ];

  return [
    {
      id: "alignment",
      title: "Alignment Foundation",
      cues: alignment.length ? alignment : ["Stack joints and lengthen through the spine"],
    },
    {
      id: "teaching",
      title: "Teaching Language",
      cues: teaching.length ? teaching : ["Use direct, calm cues and keep breath steady"],
    },
    {
      id: "refinement",
      title: "Refinement + Safety",
      cues: refinement.map(sentenceCase).filter(Boolean),
    },
  ];
};

export const buildAssistSets = (pose) => {
  const baseAlignment = sentenceCase(pose.alignmentCues?.[0] || "Stack the main joints first");
  const secondAlignment = sentenceCase(pose.alignmentCues?.[1] || "Lengthen the spine and soften effort");
  const beginner = sentenceCase(
    pose.teachingCues?.beginner?.[0] || "Shorten range of motion and build stability first"
  );
  const mobility = sentenceCase(
    pose.teachingCues?.limitedMobility?.[0] || "Use props to reduce strain and improve control"
  );

  return [
    {
      id: "verbal",
      title: "Verbal Adjustment",
      type: "No-touch cueing",
      steps: [
        `Say clearly: "${baseAlignment}"`,
        `Then refine: "${secondAlignment}"`,
        "Ask for one breath cycle, then confirm if the shape feels stable",
      ],
      safety: "Best first choice in group classes.",
    },
    {
      id: "hands-on",
      title: "Hands-On Assist",
      type: "Consent-based touch",
      steps: [
        "Get clear verbal consent before touch",
        "Use broad, steady contact to guide direction, not force depth",
        "Release assist as soon as alignment improves and breath stays smooth",
      ],
      safety: "Skip touch if breath shortens, guarding appears, or student seems unsure.",
    },
    {
      id: "props",
      title: "Prop-Based Assist",
      type: "Independent support",
      steps: [
        beginner,
        mobility,
        "Re-check joints after placing props and adjust height for neutral spine",
      ],
      safety: "Props should reduce effort and increase steadiness, never force range.",
    },
  ];
};

const STYLE_BLOCKS = {
  vinyasa: [
    { name: "Arrival + Intention", ratio: 0.1, categories: ["Restorative", "Warm-up"] },
    { name: "Warm-Up", ratio: 0.15, categories: ["Warm-up", "Core"] },
    { name: "Sun Salutations (A/B)", ratio: 0.2, categories: ["Standing", "Backbend"] },
    { name: "Standing Sequence", ratio: 0.24, categories: ["Standing", "Balance"] },
    { name: "Peak + Integrate", ratio: 0.16, categories: ["Balance", "Hip Opener", "Twist"] },
    { name: "Cool Down", ratio: 0.1, categories: ["Forward Fold", "Twist", "Seated"] },
    { name: "Savasana", ratio: 0.05, categories: ["Restorative"] },
  ],
  hatha: [
    { name: "Centering + Breath", ratio: 0.12, categories: ["Restorative", "Seated"] },
    { name: "Joint Warm-Up", ratio: 0.14, categories: ["Warm-up"] },
    { name: "Standing Foundation", ratio: 0.24, categories: ["Standing"] },
    { name: "Balance + Strength", ratio: 0.18, categories: ["Balance", "Core"] },
    { name: "Floor Practice", ratio: 0.2, categories: ["Seated", "Hip Opener", "Forward Fold"] },
    { name: "Pranayama + Savasana", ratio: 0.12, categories: ["Restorative"] },
  ],
  yin: [
    { name: "Arrival + Grounding", ratio: 0.12, categories: ["Restorative", "Seated"] },
    { name: "Yin Hold Series 1", ratio: 0.22, categories: ["Hip Opener", "Forward Fold"] },
    { name: "Counterpose + Rebound", ratio: 0.1, categories: ["Restorative", "Warm-up"] },
    { name: "Yin Hold Series 2", ratio: 0.26, categories: ["Twist", "Forward Fold", "Seated"] },
    { name: "Closing Integration", ratio: 0.12, categories: ["Restorative"] },
    { name: "Meditative Savasana", ratio: 0.18, categories: ["Restorative"] },
  ],
  ashtanga: [
    { name: "Opening + Breath Prep", ratio: 0.1, categories: ["Warm-up", "Restorative"] },
    { name: "Sun A + Sun B", ratio: 0.22, categories: ["Standing", "Backbend"] },
    { name: "Standing Series", ratio: 0.26, categories: ["Standing", "Balance"] },
    { name: "Seated / Core Work", ratio: 0.2, categories: ["Seated", "Core", "Forward Fold"] },
    { name: "Finishing Sequence", ratio: 0.12, categories: ["Inversion", "Restorative"] },
    { name: "Savasana", ratio: 0.1, categories: ["Restorative"] },
  ],
};

const clampDuration = (duration) => Math.max(30, Math.min(120, Number(duration) || 60));

const choosePoses = (poses, categories, count, seedOffset = 0) => {
  const matches = poses.filter((pose) => categories.includes(pose.category));
  if (!matches.length) return [];
  const picks = [];
  for (let i = 0; i < count; i += 1) {
    const idx = (seedOffset + i * 7) % matches.length;
    picks.push(matches[idx]);
  }
  return picks;
};

export const generateFlowTemplate = ({ style, duration, level, seed = 0 }, poses) => {
  const activeStyle = STYLE_BLOCKS[style] ? style : "vinyasa";
  const totalMinutes = clampDuration(duration);
  const blocks = STYLE_BLOCKS[activeStyle];

  return blocks.map((block, index) => {
    const minutes = Math.max(3, Math.round(totalMinutes * block.ratio));
    const suggested = choosePoses(poses, block.categories, 3, seed + index * 3);
    return {
      id: `${activeStyle}-${index}`,
      name: block.name,
      minutes,
      categories: block.categories,
      intention:
        level === "beginner"
          ? "Keep transitions simple and repeat key cues"
          : level === "advanced"
            ? "Layer challenge with optional variations"
            : "Balance accessibility with progressive intensity",
      suggested,
    };
  });
};
