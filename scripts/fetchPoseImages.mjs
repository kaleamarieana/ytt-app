import fs from "node:fs/promises";
import path from "node:path";

const DATA_PATH = path.resolve(process.cwd(), "src/data/poseFlashcards.json");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const wikiSearchTitle = async (query) => {
  const url = new URL("https://en.wikipedia.org/w/api.php");
  url.searchParams.set("action", "opensearch");
  url.searchParams.set("search", query);
  url.searchParams.set("limit", "1");
  url.searchParams.set("namespace", "0");
  url.searchParams.set("format", "json");

  const response = await fetch(url, {
    headers: {
      "user-agent": "ytt-app-pose-image-fetcher/1.0",
      accept: "application/json",
    },
  });

  if (!response.ok) return null;
  const payload = await response.json();
  return payload?.[1]?.[0] || null;
};

const wikiSummary = async (title) => {
  const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const response = await fetch(summaryUrl, {
    headers: {
      "user-agent": "ytt-app-pose-image-fetcher/1.0",
      accept: "application/json",
    },
  });
  if (!response.ok) return null;
  return response.json();
};

const getPoseImage = async (pose) => {
  const queries = [
    `${pose.englishName} yoga pose`,
    `${pose.englishName} yoga`,
    `${pose.sanskritName} asana`,
    `${pose.sanskritName} yoga`,
  ];

  for (const query of queries) {
    const title = await wikiSearchTitle(query);
    if (!title) continue;
    const summary = await wikiSummary(title);
    const imageUrl =
      summary?.thumbnail?.source || summary?.originalimage?.source || null;
    if (!imageUrl) continue;
    return {
      url: imageUrl,
      sourcePage: summary?.content_urls?.desktop?.page || "",
      attribution: "Image source: Wikipedia/Wikimedia Commons",
    };
  }

  return null;
};

const main = async () => {
  const raw = await fs.readFile(DATA_PATH, "utf8");
  const data = JSON.parse(raw);
  const failed = [];

  for (const pose of data.poses) {
    const resolved = await getPoseImage(pose);
    if (resolved) {
      pose.image = {
        ...pose.image,
        ...resolved,
      };
      console.log(`OK  ${pose.id}`);
    } else {
      failed.push(pose.id);
      console.log(`MISS ${pose.id}`);
    }
    await sleep(150);
  }

  await fs.writeFile(DATA_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf8");

  if (failed.length) {
    console.log(`\nMissing images (${failed.length}): ${failed.join(", ")}`);
  } else {
    console.log("\nResolved images for all poses.");
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
