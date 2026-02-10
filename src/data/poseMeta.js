const CATEGORY_ORDER = [
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
];

const categoryMap = new Map();
const assignCategory = (ids, category) => {
  ids.forEach((id) => {
    if (!categoryMap.has(id)) {
      categoryMap.set(id, new Set());
    }
    categoryMap.get(id).add(category);
  });
};

assignCategory(
  [
    "mountain",
    "chair",
    "forward-fold",
    "halfway-lift",
    "low-lunge",
    "high-lunge",
    "warrior-1",
    "warrior-2",
    "warrior-3",
    "triangle",
    "revolved-triangle",
    "side-angle",
    "revolved-side-angle",
    "pyramid",
    "wide-leg-fold",
    "garland",
    "goddess",
    "tree",
    "eagle",
    "half-moon",
    "dancer",
    "standing-hand-to-big-toe",
    "standing-split",
    "side-lunge",
    "gate",
    "chair-twist",
    "revolved-half-moon",
  ],
  "Standing"
);

assignCategory(
  [
    "easy-seated",
    "lotus",
    "half-lotus",
    "accomplished",
    "thunderbolt",
    "staff",
    "seated-forward-fold",
    "head-to-knee",
    "wide-angle",
    "bound-angle",
    "cow-face",
    "fire-log",
    "seated-twist",
    "marichi",
    "boat",
    "heron",
  ],
  "Seated"
);

assignCategory(
  [
    "bridge",
    "wheel",
    "fish",
    "reclined-hand-to-big-toe",
    "supine-bound-angle",
    "happy-baby",
    "wind-relieving",
    "supine-twist",
    "corpse",
    "reclined-hero",
    "legs-up-wall",
    "shoulderstand",
    "plow",
    "ear-pressure",
  ],
  "Supine"
);

assignCategory(
  [
    "cobra",
    "locust",
    "crocodile",
    "sphinx",
    "bow",
    "upward-dog",
    "pigeon",
  ],
  "Prone"
);

assignCategory(
  [
    "forearm-stand",
    "handstand",
    "headstand",
    "shoulderstand",
    "plow",
    "ear-pressure",
    "legs-up-wall",
  ],
  "Inversion"
);

assignCategory(
  [
    "revolved-triangle",
    "revolved-side-angle",
    "chair-twist",
    "revolved-half-moon",
    "seated-twist",
    "marichi",
    "supine-twist",
    "side-crow",
  ],
  "Twist"
);

assignCategory(
  [
    "upward-dog",
    "cobra",
    "bridge",
    "wheel",
    "camel",
    "bow",
    "locust",
    "sphinx",
    "fish",
    "dancer",
    "reverse-plank",
  ],
  "Backbend"
);

assignCategory(
  [
    "forward-fold",
    "pyramid",
    "wide-leg-fold",
    "standing-split",
    "seated-forward-fold",
    "head-to-knee",
    "wide-angle",
    "child",
    "rabbit",
  ],
  "Forward Fold"
);

assignCategory(
  [
    "tree",
    "eagle",
    "half-moon",
    "dancer",
    "standing-hand-to-big-toe",
    "standing-split",
    "warrior-3",
  ],
  "Balance"
);

assignCategory(
  [
    "crow",
    "side-crow",
    "eight-angle",
    "firefly",
    "peacock",
    "scale",
  ],
  "Arm Balance"
);

assignCategory(
  [
    "low-lunge",
    "lizard",
    "pigeon",
    "frog",
    "garland",
    "goddess",
    "bound-angle",
    "fire-log",
    "cow-face",
    "happy-baby",
  ],
  "Hip Opener"
);

assignCategory(["plank", "chaturanga", "boat"], "Core");

assignCategory(
  ["child", "legs-up-wall", "corpse", "crocodile", "supine-bound-angle", "reclined-hero"],
  "Restorative"
);

assignCategory(["cat", "cow"], "Warm-up");

const BREATH_OVERRIDES = new Map([
  ["cat", "Exhale"],
  ["cow", "Inhale"],
  ["halfway-lift", "Inhale"],
  ["forward-fold", "Exhale"],
  ["chair", "Inhale"],
  ["plank", "Inhale"],
  ["chaturanga", "Exhale"],
  ["upward-dog", "Inhale"],
  ["downward-dog", "Exhale"],
  ["cobra", "Inhale"],
  ["mountain", "Inhale"],
  ["corpse", "Exhale"],
]);

const inferBreath = (poseId, categories) => {
  if (BREATH_OVERRIDES.has(poseId)) return BREATH_OVERRIDES.get(poseId);
  if (categories.includes("Backbend")) return "Inhale";
  if (categories.includes("Forward Fold")) return "Exhale";
  if (categories.includes("Twist")) return "Exhale";
  if (categories.includes("Arm Balance")) return "Exhale";
  if (categories.includes("Core")) return "Exhale";
  if (categories.includes("Inversion")) return "Inhale";
  if (categories.includes("Restorative")) return "Exhale";
  if (categories.includes("Supine")) return "Exhale";
  return "Inhale";
};

export const withPoseMeta = (poseList) =>
  poseList.map((pose) => {
    const categories = Array.from(categoryMap.get(pose.id) || ["Standing"]);
    const ordered = CATEGORY_ORDER.filter((category) => categories.includes(category));
    const finalCategories = ordered.length ? ordered : categories;
    return {
      ...pose,
      categories: finalCategories,
      breath: inferBreath(pose.id, finalCategories),
    };
  });

export const CATEGORY_OPTIONS = CATEGORY_ORDER;
