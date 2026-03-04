import { readFile, writeFile } from "node:fs/promises";

const source = new URL("../src/data/imagePrompts.json", import.meta.url);
const output = new URL("../docs/image-prompts-batch.txt", import.meta.url);

const promptsRaw = await readFile(source, "utf8");
const prompts = JSON.parse(promptsRaw);

const lines = prompts.flatMap((item, index) => {
  const header = `# ${String(index + 1).padStart(2, "0")} - ${item.id} (${item.filename})`;
  return [header, item.prompt, ""];
});

await writeFile(output, lines.join("\n"), "utf8");
console.log(`Exported ${prompts.length} prompts to docs/image-prompts-batch.txt`);
