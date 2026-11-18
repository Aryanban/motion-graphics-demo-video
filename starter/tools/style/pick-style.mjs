#!/usr/bin/env node
// pick-style.mjs - deal three styles from the library that fit a brief.
//
//   npm run style:pick -- "90 s hackathon explainer for a bus journey planner, real app screens"
//   npm run style:pick -- "<brief>" --material screens|footage|data|none
//   npm run style:pick -- --use editorial-paper      # record the choice in docs/video/style-log.json
//   npm run style:pick -- --list
//
// Scores are a starting point, not the decision. The agent still checks the pick against the
// brief, the brand and the design skills (frontend-design anti-patterns) before locking it.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const { styles } = JSON.parse(readFileSync(resolve(here, "../../src/styles/styles.json"), "utf8"));
const LOG = resolve(process.cwd(), "docs/video/style-log.json");

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args.splice(i, 2)[1] : undefined;
};
const readLog = () => (existsSync(LOG) ? JSON.parse(readFileSync(LOG, "utf8")) : []);

if (args.includes("--list")) {
  for (const s of styles) console.log(`${s.id.padEnd(18)} ${s.name.padEnd(18)} ${s.feel}`);
  process.exit(0);
}

const use = flag("--use");
if (use) {
  if (!styles.some((s) => s.id === use)) {
    console.error(`Unknown style "${use}". Run with --list.`);
    process.exit(2);
  }
  const log = readLog();
  log.unshift({ style: use, at: new Date().toISOString() });
  mkdirSync(dirname(LOG), { recursive: true });
  writeFileSync(LOG, JSON.stringify(log.slice(0, 20), null, 2) + "\n");
  console.log(`Recorded ${use} in ${LOG}`);
  process.exit(0);
}

const material = flag("--material");
const brief = args.join(" ").toLowerCase();
if (!brief) {
  console.error('Give a brief: npm run style:pick -- "what the video is, who watches, what it shows"');
  process.exit(2);
}

const has = (term) => new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i").test(brief);
const recent = readLog().slice(0, 2).map((e) => e.style);

const scored = styles.map((s) => {
  const why = [];
  let score = 0;
  for (const t of s.signals) if (has(t)) { score += 2; why.push(t); }
  for (const t of s.bestFor) if (has(t) && !why.includes(t)) { score += 1; why.push(t); }
  for (const t of s.avoid) if (has(t)) { score -= 3; why.push(`avoid: ${t}`); }
  if (material === "footage" && s.id === "photo-story") { score += 3; why.push("has footage"); }
  if (material !== "footage" && s.id === "photo-story") { score -= 2; why.push("needs footage"); }
  if (material === "screens" && ["editorial-paper", "keynote-black", "sticker-pop", "terminal"].includes(s.id)) { score += 1; why.push("frames real screens"); }
  if (material === "data" && ["data-desk", "editorial-paper", "swiss-poster"].includes(s.id)) { score += 1; why.push("carries numbers"); }
  if (recent.includes(s.id)) { score -= 1.5; why.push("used recently"); }
  return { s, score, why };
});

scored.sort((a, b) => b.score - a.score || styles.indexOf(a.s) - styles.indexOf(b.s));
const top = scored.slice(0, 3);

console.log(`\nThree styles for: "${args.join(" ")}"\n`);
top.forEach(({ s, score, why }, i) => {
  console.log(`${i + 1}. ${s.name} (${s.id})  score ${score}`);
  console.log(`   ${s.feel}`);
  console.log(`   matched: ${why.join(", ") || "nothing specific; a neutral fit"}`);
  console.log(`   type: ${s.fonts.display} / ${s.fonts.mono}   bg ${s.colors.bg}  ink ${s.colors.ink}  marker ${s.colors.marker}`);
  console.log(`   reference: ${s.reference}\n`);
});
console.log("Before locking one:");
console.log("- Load the frontend-design skill and check the pick against its anti-pattern list.");
console.log("- Lay the brand's own tokens over it as a skin (colours, fonts); keep the style's structure and motion.");
console.log("- Render Style-<id> stills and look at them next to the reference.");
console.log("- Record it: npm run style:pick -- --use <id>\n");
