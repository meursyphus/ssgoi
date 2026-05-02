#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PKGS = [
  "packages/core",
  "packages/react",
  "packages/svelte",
  "packages/vue",
  "packages/solid",
  "packages/angular",
];

const arg = process.argv[2];
if (!arg) {
  console.error("Usage: node scripts/bump-version.mjs <major|minor|patch|x.y.z>");
  process.exit(1);
}

const read = (p) => JSON.parse(readFileSync(join(ROOT, p, "package.json"), "utf8"));
const cmp = (a, b) => {
  const A = a.split(".").map(Number);
  const B = b.split(".").map(Number);
  return A[0] - B[0] || A[1] - B[1] || A[2] - B[2];
};

const current = PKGS.map((p) => ({ p, v: read(p).version }));
const max = current.map((x) => x.v).sort(cmp).at(-1);

let next;
if (/^\d+\.\d+\.\d+$/.test(arg)) {
  next = arg;
} else {
  const [maj, min, pat] = max.split(".").map(Number);
  if (arg === "major") next = `${maj + 1}.0.0`;
  else if (arg === "minor") next = `${maj}.${min + 1}.0`;
  else if (arg === "patch") next = `${maj}.${min}.${pat + 1}`;
  else {
    console.error(`Invalid bump type: ${arg}`);
    process.exit(1);
  }
}

if (cmp(next, max) <= 0) {
  console.error(`Refusing to bump down: max is ${max}, target is ${next}`);
  process.exit(1);
}

console.log(`Bumping ${PKGS.length} packages: max ${max} -> ${next}\n`);
for (const { p, v } of current) {
  const file = join(ROOT, p, "package.json");
  const raw = readFileSync(file, "utf8");
  const trailing = raw.endsWith("\n") ? "\n" : "";
  const j = JSON.parse(raw);
  j.version = next;
  writeFileSync(file, JSON.stringify(j, null, 2) + trailing);
  console.log(`  ${p}: ${v} -> ${next}`);
}
console.log(`\nDone. All packages now at ${next}.`);
