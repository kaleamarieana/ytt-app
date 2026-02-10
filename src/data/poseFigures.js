const stroke = {
  color: "url(#ink)",
  width: 9,
  cap: "round",
  join: "round",
};

const joint = {
  radius: 5.5,
  color: "url(#ink)",
};

const T = {
  standing: {
    head: [120, 44, 14],
    lines: [
      [120, 62, 120, 130],
      [120, 78, 80, 110],
      [120, 78, 160, 110],
      [120, 130, 100, 210],
      [120, 130, 140, 210],
    ],
  },
  chair: {
    head: [120, 52, 14],
    lines: [
      [120, 68, 120, 128],
      [120, 78, 86, 96],
      [120, 78, 154, 96],
      [120, 128, 92, 180],
      [120, 128, 150, 176],
      [92, 180, 140, 182],
    ],
  },
  forwardFold: {
    head: [150, 150, 14],
    lines: [
      [120, 70, 160, 140],
      [120, 70, 86, 90],
      [120, 70, 156, 92],
      [120, 70, 98, 170],
      [120, 70, 122, 176],
    ],
  },
  halfwayLift: {
    head: [168, 120, 12],
    lines: [
      [110, 90, 176, 110],
      [120, 86, 92, 112],
      [120, 86, 152, 94],
      [120, 86, 100, 180],
      [120, 86, 134, 178],
    ],
  },
  downDog: {
    head: [70, 150, 12],
    lines: [
      [80, 120, 160, 90],
      [80, 120, 54, 176],
      [160, 90, 200, 166],
      [160, 90, 190, 168],
    ],
  },
  plank: {
    head: [190, 106, 12],
    lines: [
      [60, 120, 186, 112],
      [68, 120, 40, 150],
      [60, 120, 38, 152],
      [180, 112, 210, 150],
      [170, 112, 206, 150],
    ],
  },
  chaturanga: {
    head: [190, 130, 12],
    lines: [
      [66, 140, 186, 130],
      [80, 140, 52, 162],
      [70, 140, 46, 162],
      [176, 130, 206, 156],
      [166, 130, 200, 154],
    ],
  },
  upDog: {
    head: [150, 78, 12],
    lines: [
      [70, 140, 156, 88],
      [92, 132, 70, 170],
      [120, 120, 200, 150],
      [150, 100, 190, 130],
    ],
  },
  cobra: {
    head: [150, 98, 12],
    lines: [
      [70, 150, 150, 108],
      [90, 142, 60, 170],
      [120, 132, 190, 162],
    ],
  },
  child: {
    head: [140, 150, 12],
    lines: [
      [92, 120, 140, 148],
      [92, 120, 60, 132],
      [92, 120, 160, 140],
      [92, 120, 110, 176],
      [92, 120, 140, 180],
    ],
  },
  cat: {
    head: [160, 124, 10],
    lines: [
      [60, 130, 160, 124],
      [70, 130, 50, 160],
      [90, 130, 70, 164],
      [140, 124, 176, 150],
      [128, 124, 166, 152],
    ],
  },
  cow: {
    head: [160, 106, 10],
    lines: [
      [60, 130, 160, 106],
      [70, 130, 50, 160],
      [90, 130, 70, 164],
      [140, 106, 176, 150],
      [128, 106, 166, 152],
    ],
  },
  lungeLow: {
    head: [130, 60, 12],
    lines: [
      [120, 76, 120, 126],
      [120, 86, 86, 110],
      [120, 86, 156, 110],
      [120, 126, 90, 166],
      [120, 126, 160, 210],
      [90, 166, 140, 166],
    ],
  },
  lungeHigh: {
    head: [130, 52, 12],
    lines: [
      [120, 68, 120, 126],
      [120, 76, 86, 94],
      [120, 76, 156, 94],
      [120, 126, 90, 160],
      [120, 126, 168, 206],
    ],
  },
  warrior2: {
    head: [120, 56, 12],
    lines: [
      [120, 70, 120, 118],
      [60, 86, 180, 86],
      [120, 118, 90, 162],
      [120, 118, 170, 150],
    ],
  },
  warrior1: {
    head: [120, 50, 12],
    lines: [
      [120, 66, 120, 118],
      [120, 70, 86, 42],
      [120, 70, 154, 42],
      [120, 118, 90, 162],
      [120, 118, 168, 176],
    ],
  },
  warrior3: {
    head: [180, 96, 12],
    lines: [
      [80, 120, 176, 100],
      [88, 116, 60, 90],
      [88, 116, 140, 86],
      [80, 120, 34, 116],
      [80, 120, 210, 140],
    ],
  },
  triangle: {
    head: [150, 70, 12],
    lines: [
      [120, 90, 150, 78],
      [90, 100, 170, 120],
      [120, 90, 90, 170],
      [120, 90, 170, 176],
    ],
  },
  sideAngle: {
    head: [150, 72, 12],
    lines: [
      [120, 96, 160, 80],
      [120, 96, 86, 130],
      [120, 96, 176, 116],
      [120, 96, 90, 170],
      [120, 96, 178, 170],
    ],
  },
  tree: {
    head: [120, 48, 12],
    lines: [
      [120, 62, 120, 126],
      [120, 68, 92, 96],
      [120, 68, 148, 96],
      [120, 126, 120, 210],
      [120, 140, 154, 156],
    ],
  },
  balance: {
    head: [140, 52, 12],
    lines: [
      [130, 66, 130, 120],
      [130, 70, 100, 90],
      [130, 70, 162, 90],
      [130, 120, 130, 208],
      [130, 128, 186, 142],
    ],
  },
  armBalance: {
    head: [150, 90, 12],
    lines: [
      [90, 120, 170, 110],
      [96, 118, 70, 150],
      [120, 116, 80, 150],
      [130, 112, 190, 140],
      [150, 110, 196, 140],
    ],
  },
  inversion: {
    head: [120, 190, 12],
    lines: [
      [120, 70, 120, 160],
      [90, 90, 150, 90],
      [120, 70, 96, 40],
      [120, 70, 144, 40],
    ],
  },
  plow: {
    head: [80, 170, 12],
    lines: [
      [120, 140, 90, 170],
      [120, 140, 150, 120],
      [120, 140, 140, 80],
      [120, 140, 160, 80],
    ],
  },
  bridge: {
    head: [60, 160, 12],
    lines: [
      [70, 150, 160, 120],
      [80, 150, 60, 186],
      [100, 144, 200, 170],
    ],
  },
  wheel: {
    head: [80, 140, 12],
    lines: [
      [70, 130, 170, 90],
      [70, 130, 40, 170],
      [170, 90, 200, 140],
      [90, 120, 130, 170],
    ],
  },
  seated: {
    head: [120, 64, 12],
    lines: [
      [120, 78, 120, 118],
      [120, 88, 92, 110],
      [120, 88, 148, 110],
      [120, 118, 86, 160],
      [120, 118, 154, 160],
    ],
  },
  seatedFold: {
    head: [150, 130, 12],
    lines: [
      [110, 92, 150, 124],
      [110, 92, 86, 116],
      [110, 92, 148, 108],
      [110, 92, 86, 170],
      [110, 92, 150, 176],
    ],
  },
  seatedTwist: {
    head: [130, 64, 12],
    lines: [
      [120, 78, 120, 118],
      [120, 92, 86, 92],
      [120, 92, 146, 116],
      [120, 118, 86, 160],
      [120, 118, 154, 160],
    ],
  },
  boat: {
    head: [160, 80, 12],
    lines: [
      [120, 100, 180, 80],
      [120, 100, 96, 76],
      [120, 100, 200, 100],
      [120, 100, 160, 160],
      [120, 100, 180, 160],
    ],
  },
  supine: {
    head: [70, 170, 12],
    lines: [
      [70, 170, 170, 170],
      [90, 170, 60, 190],
      [110, 170, 190, 190],
    ],
  },
  happyBaby: {
    head: [120, 170, 12],
    lines: [
      [120, 160, 120, 130],
      [120, 136, 96, 150],
      [120, 136, 144, 150],
      [120, 130, 90, 110],
      [120, 130, 150, 110],
    ],
  },
};

const POSE_FIGURES = {
  mountain: T.standing,
  chair: T.chair,
  "forward-fold": T.forwardFold,
  "halfway-lift": T.halfwayLift,
  "downward-dog": T.downDog,
  plank: T.plank,
  chaturanga: T.chaturanga,
  "upward-dog": T.upDog,
  cobra: T.cobra,
  child: T.child,
  cat: T.cat,
  cow: T.cow,
  "low-lunge": T.lungeLow,
  "high-lunge": T.lungeHigh,
  "warrior-1": T.warrior1,
  "warrior-2": T.warrior2,
  "warrior-3": T.warrior3,
  triangle: T.triangle,
  "revolved-triangle": T.triangle,
  "side-angle": T.sideAngle,
  "revolved-side-angle": T.sideAngle,
  pyramid: T.forwardFold,
  "wide-leg-fold": T.forwardFold,
  garland: T.chair,
  goddess: T.chair,
  tree: T.tree,
  eagle: T.balance,
  "half-moon": T.balance,
  dancer: T.balance,
  "standing-hand-to-big-toe": T.balance,
  "standing-split": T.forwardFold,
  "side-lunge": T.lungeLow,
  gate: T.lungeLow,
  "chair-twist": T.chair,
  "revolved-half-moon": T.balance,
  crow: T.armBalance,
  "side-crow": T.armBalance,
  "eight-angle": T.armBalance,
  firefly: T.armBalance,
  peacock: T.armBalance,
  scale: T.armBalance,
  "forearm-stand": T.inversion,
  handstand: T.inversion,
  headstand: T.inversion,
  shoulderstand: T.inversion,
  plow: T.plow,
  "ear-pressure": T.plow,
  "legs-up-wall": T.inversion,
  bridge: T.bridge,
  wheel: T.wheel,
  camel: T.upDog,
  bow: T.bridge,
  locust: T.cobra,
  crocodile: T.supine,
  sphinx: T.cobra,
  fish: T.bridge,
  pigeon: T.lungeLow,
  lizard: T.lungeLow,
  frog: T.seated,
  rabbit: T.child,
  "easy-seated": T.seated,
  lotus: T.seated,
  "half-lotus": T.seated,
  accomplished: T.seated,
  thunderbolt: T.seated,
  staff: T.seated,
  "seated-forward-fold": T.seatedFold,
  "head-to-knee": T.seatedFold,
  "wide-angle": T.seatedFold,
  "bound-angle": T.seated,
  "cow-face": T.seated,
  "fire-log": T.seated,
  "seated-twist": T.seatedTwist,
  marichi: T.seatedTwist,
  boat: T.boat,
  "reverse-plank": T.bridge,
  "reclined-hand-to-big-toe": T.supine,
  "supine-bound-angle": T.supine,
  "happy-baby": T.happyBaby,
  "wind-relieving": T.supine,
  "supine-twist": T.supine,
  corpse: T.supine,
  "reclined-hero": T.supine,
  heron: T.seated,
};

const bendForIndex = (index) => {
  if (index === 0) return 0;
  if (index === 1 || index === 2) return 8;
  if (index === 3 || index === 4) return 10;
  return 6;
};

const bendSignForIndex = (index) => {
  if (index === 1 || index === 3) return -1;
  if (index === 2 || index === 4) return 1;
  return 1;
};

const withBend = (line, index) => {
  const [x1, y1, x2, y2] = line;
  const bend = bendForIndex(index);
  if (bend === 0) return [[x1, y1], [x2, y2]];
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const mx = (x1 + x2) / 2 + nx * bend * bendSignForIndex(index);
  const my = (y1 + y2) / 2 + ny * bend * bendSignForIndex(index);
  return [[x1, y1], [mx, my], [x2, y2]];
};

const toSkeleton = (figure) => ({
  head: figure.head,
  limbs: figure.lines.map((line, index) => withBend(line, index)),
});

const POSE_SKELETONS = Object.fromEntries(
  Object.entries(POSE_FIGURES).map(([poseId, figure]) => [poseId, toSkeleton(figure)])
);

export const getPoseFigure = (poseId) => POSE_SKELETONS[poseId] || toSkeleton(T.standing);

export const getStroke = () => stroke;

export const getJoint = () => joint;
