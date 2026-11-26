import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const source = resolve("docs/about.json");
const target = resolve("src/data/about.json");

mkdirSync(dirname(target), { recursive: true });
copyFileSync(source, target);

console.log("Synced docs/about.json -> src/data/about.json");
