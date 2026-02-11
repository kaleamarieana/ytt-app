import fs from "node:fs/promises";
import path from "node:path";

const DATA_PATH = path.resolve(process.cwd(), "src/data/poseFlashcards.json");
const POSES_URL = "https://www.pocketyoga.com/poses.json";

const normalize = (value) =>
  (value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const makeMainImageUrl = (pocketPose) => {
  const baseName = pocketPose.name.replace(/\s+/g, "");
  let base = `https://pocketyoga.com/assets/images/full/${baseName}`;
  if (
    pocketPose.preferred_side &&
    (pocketPose.two_sided === true || pocketPose.sideways === true)
  ) {
    base += `_${pocketPose.preferred_side.charAt(0).toUpperCase()}`;
  }
  return `${base}.png`;
};

const allPocketSearchTerms = (pocketPose) => {
  const terms = new Set();
  const push = (v) => {
    const n = normalize(v);
    if (n) terms.add(n);
  };

  push(pocketPose.display_name);
  push(pocketPose.name);
  for (const alt of pocketPose.aka || []) push(alt);
  for (const sn of pocketPose.sanskrit_names || []) {
    push(sn.simplified);
    push(sn.latin);
  }

  return terms;
};

const allLocalSearchTerms = (localPose) => {
  const terms = new Set();
  const push = (v) => {
    const n = normalize(v);
    if (n) terms.add(n);
  };

  push(localPose.englishName);
  push(localPose.sanskritName);
  push(localPose.id.replace(/-/g, " "));
  return terms;
};

const scoreMatch = (localPose, pocketPose) => {
  const localTerms = allLocalSearchTerms(localPose);
  const pocketTerms = allPocketSearchTerms(pocketPose);
  let score = 0;

  for (const term of localTerms) {
    if (pocketTerms.has(term)) score += 5;
  }

  const localSanskrit = normalize(localPose.sanskritName);
  for (const sn of pocketPose.sanskrit_names || []) {
    if (normalize(sn.simplified) === localSanskrit) score += 12;
    if (normalize(sn.latin) === localSanskrit) score += 10;
  }

  if (normalize(pocketPose.display_name) === normalize(localPose.englishName)) score += 8;
  if (normalize(pocketPose.name) === normalize(localPose.englishName)) score += 8;

  return score;
};

const findBestPocketPose = (localPose, pocketPoses) => {
  let best = null;
  let bestScore = -1;

  for (const pocketPose of pocketPoses) {
    const score = scoreMatch(localPose, pocketPose);
    if (score > bestScore) {
      bestScore = score;
      best = pocketPose;
    }
  }

  if (!best || bestScore < 8) return null;
  return { best, score: bestScore };
};

const main = async () => {
  const [rawLocal, rawPocket] = await Promise.all([
    fs.readFile(DATA_PATH, "utf8"),
    fetch(POSES_URL, { headers: { accept: "application/json" } }).then((res) => {
      if (!res.ok) {
        throw new Error(`Pocket Yoga fetch failed: ${res.status}`);
      }
      return res.text();
    }),
  ]);

  const localData = JSON.parse(rawLocal);
  const pocketPoses = JSON.parse(rawPocket);

  let matched = 0;
  const misses = [];

  for (const localPose of localData.poses) {
    const found = findBestPocketPose(localPose, pocketPoses);
    if (!found) {
      misses.push(localPose.id);
      continue;
    }

    const baseName = found.best.name.replace(/\s+/g, "");
    localPose.image = {
      ...localPose.image,
      url: makeMainImageUrl(found.best),
      sourcePage: `https://www.pocketyoga.com/pose/${baseName}`,
      attribution: "Image source: Pocket Yoga",
    };
    matched += 1;
  }

  await fs.writeFile(DATA_PATH, `${JSON.stringify(localData, null, 2)}\n`, "utf8");

  console.log(`Matched: ${matched}/${localData.poses.length}`);
  if (misses.length) {
    console.log(`Missing (${misses.length}): ${misses.join(", ")}`);
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
