// Generates copilot/meta.json from docs/r/index.json (name/title/titleHe/description only).
import { readFileSync, writeFileSync } from "node:fs";
const idx = JSON.parse(readFileSync(new URL("../docs/r/index.json", import.meta.url), "utf8"));
const meta = idx.items.map(({ name, title, titleHe, description }) => ({ name, title, titleHe, description }));
writeFileSync(new URL("./meta.json", import.meta.url), JSON.stringify(meta));
console.log("meta.json:", meta.length, "components");
