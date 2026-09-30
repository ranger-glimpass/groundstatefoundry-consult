// Validates content/summaries/*.json against content/research/*.md.
// Usage: node scripts/check-summaries.mjs [slug ...]
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const RES = path.join(root, "content", "research");
const SUM = path.join(root, "content", "summaries");
const KEYS = ["tldr", "what", "why", "how", "takeaway"];
const LIMITS = { tldr: [8, 35], what: [25, 80], why: [25, 80], how: [25, 90], takeaway: [8, 40] };
const BANNED = /\b(unlock|leverage|seamless|cutting-edge|revolutioni[sz]e|elevate|empower|delve|robust|game-changer)\b/i;

const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;
const slugs = process.argv.slice(2).length
  ? process.argv.slice(2)
  : fs.readdirSync(RES).filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -3));

let bad = 0;
for (const slug of slugs) {
  const errs = [];
  const file = path.join(SUM, `${slug}.json`);
  if (!fs.existsSync(path.join(RES, `${slug}.md`))) errs.push("no matching research article");
  if (!fs.existsSync(file)) errs.push("missing summary file");
  else {
    let d;
    try { d = JSON.parse(fs.readFileSync(file, "utf8")); } catch (e) { errs.push("invalid JSON: " + e.message); }
    if (d) {
      const extra = Object.keys(d).filter((k) => !KEYS.includes(k));
      if (extra.length) errs.push("unexpected keys: " + extra.join(", "));
      for (const k of KEYS) {
        if (typeof d[k] !== "string" || !d[k].trim()) { errs.push(`${k}: missing or not a string`); continue; }
        const n = words(d[k]);
        const [lo, hi] = LIMITS[k];
        if (n < lo || n > hi) errs.push(`${k}: ${n} words (want ${lo}-${hi})`);
        if (/[—–]/.test(d[k])) errs.push(`${k}: contains an em or en dash`);
        if (BANNED.test(d[k])) errs.push(`${k}: banned word "${d[k].match(BANNED)[0]}"`);
      }
    }
  }
  if (errs.length) { bad++; console.log(`FAIL ${slug}\n  - ${errs.join("\n  - ")}`); }
  else console.log(`ok   ${slug}`);
}
console.log(bad ? `\n${bad} of ${slugs.length} failed` : `\nall ${slugs.length} passed`);
process.exit(bad ? 1 : 0);
