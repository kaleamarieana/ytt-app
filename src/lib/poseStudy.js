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
  const category = pose.category;
  const baseAlignment = sentenceCase(pose.alignmentCues?.[0] || "Stack the main joints first");
  const secondAlignment = sentenceCase(
    pose.alignmentCues?.[1] || "Lengthen the spine and soften effort"
  );
  const beginner = sentenceCase(
    pose.teachingCues?.beginner?.[0] || "Shorten range of motion and build stability first"
  );
  const mobility = sentenceCase(
    pose.teachingCues?.limitedMobility?.[0] || "Use props to reduce strain and improve control"
  );

  const handsOnByCategory = {
    Standing: [
      "Stand beside student; one hand to outer hip, one hand to lower ribs",
      "Guide hips back while lengthening the side waist forward",
      "Reduce pressure immediately if breath shortens or knees lock",
    ],
    Balance: [
      "Spot from side body, not from wrists or shoulders",
      "Lightly support pelvis and upper back to stabilize center line",
      "Release touch in stages so student can own the balance",
    ],
    "Forward Fold": [
      "Support pelvis from top of sacrum, avoid pressing on low back",
      "Invite length first, then gentle depth on exhale only",
      "Stop assist if hamstrings grip or neck tightens",
    ],
    Twist: [
      "Anchor one hand at outer hip, second at upper back",
      "Cue spine to lengthen before rotation; rotate from thoracic spine",
      "Keep assist subtle; never force knee or lumbar rotation",
    ],
    Backbend: [
      "Support upper thoracic area and outer hips, not lumbar compression",
      "Guide chest broadening and tailbone length before depth",
      "Exit slowly and cue neutral spine before next transition",
    ],
    Seated: [
      "Stabilize pelvis first to create a neutral spine base",
      "Offer gentle directional pressure through shoulder girdle only",
      "Use minimal force; prioritize breath rhythm over range",
    ],
    "Arm Balance": [
      "Spot at pelvis and sternum line, not pulling limbs",
      "Guide weight shift forward in small increments",
      "Use blankets/bolsters under face side for confidence and safety",
    ],
    Inversion: [
      "Assist at upper back and hips, never yank legs",
      "Keep neck free and neutral; avoid compressive force",
      "Abort assist immediately if breath spikes or gaze panics",
    ],
    "Hip Opener": [
      "Support femur direction at hip crease, not knee joint pressure",
      "Stabilize opposite pelvis so stretch stays localized",
      "Back off at first sign of pinching in front hip or knee",
    ],
    Core: [
      "Cue neutral pelvis and deep core before adding challenge",
      "Use contact at lower ribs to support anti-flare control",
      "Assist only enough to organize shape, then release",
    ],
    Restorative: [
      "Use props and blankets first, touch second",
      "Adjust support points at knees, head, and sacrum for comfort",
      "Hands-on should calm nervous system, never intensify stretch",
    ],
    "Warm-up": [
      "Use broad directional cueing with low intensity touch",
      "Support rhythm and coordination, not range pushing",
      "Transition slowly and check comfort each repetition",
    ],
  };

  const verbalByCategory = {
    Standing: "Coach base to crown: feet root, ribs stack, crown lengthens.",
    Balance: "Give one anchor point and one drishti cue only.",
    "Forward Fold": "Cue length first, fold second, with knees soft as needed.",
    Twist: "Lengthen spine on inhale, rotate gently on exhale.",
    Backbend: "Protect low back by lifting sternum and lengthening tailbone.",
    Seated: "Ground sit bones evenly and grow up before changing shape.",
    "Arm Balance": "Shift weight gradually and keep gaze slightly forward.",
    Inversion: "Set shoulder stability first, then lift with controlled breath.",
    "Hip Opener": "Keep sensation in hip tissue, not knee joint.",
    Core: "Exhale to organize core and stabilize pelvis.",
    Restorative: "Use less effort, slower breath, and more support.",
    "Warm-up": "Move progressively from simple to layered actions.",
  };

  const drillByCategory = {
    Standing: "Wall hover drill: back body to wall, refine ribs-over-hips.",
    Balance: "Toe tap drill: tap lifted toes to floor between holds.",
    "Forward Fold": "Block ladder: hands on high/mid/low blocks to find safe depth.",
    Twist: "Strap assist: hold strap between hands to keep chest broad.",
    Backbend: "Sphinx-to-cobra wave to build thoracic extension safely.",
    Seated: "Blanket under sit bones to improve neutral pelvic tilt.",
    "Arm Balance": "Crow prep with block under forehead to build confidence.",
    Inversion: "Dolphin holds at wall for shoulder patterning before inversion.",
    "Hip Opener": "Supported lunge with blocks under hands and rear knee pad.",
    Core: "3-breath plank ladder with knee-down option each round.",
    Restorative: "Bolster + blanket stack for passive 2-3 minute holds.",
    "Warm-up": "Joint circles plus cat-cow tempo for breath-led mobility.",
  };

  return [
    {
      id: "verbal",
      title: "Verbal Coaching Strategy",
      type: "Observation-driven language",
      steps: [
        `Start with one priority cue: "${baseAlignment}"`,
        `Refine with one secondary cue: "${secondAlignment}"`,
        sentenceCase(
          verbalByCategory[category] ||
            "Use one setup cue, one action cue, then check if breath stays steady"
        ),
      ],
      safety: "Keep it concise: one body part, one action, one breath check.",
    },
    {
      id: "hands-on",
      title: "Hands-On Adjustment",
      type: "Consent-based touch",
      steps: ["Ask consent and explain where touch will happen", ...(handsOnByCategory[category] || [
        "Use broad, steady contact to guide direction, not force depth",
        "Support pelvis and upper back before increasing leverage",
        "Release assist as soon as breath and alignment improve",
      ])],
      safety: "Skip touch if breath shortens, guarding appears, or student seems unsure.",
    },
    {
      id: "props",
      title: "Prop / Self-Assist Option",
      type: "Independent refinement",
      steps: [beginner, mobility, sentenceCase(drillByCategory[category] || "Use props to support shape while maintaining smooth breath")],
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
