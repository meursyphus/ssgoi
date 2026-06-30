#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PKG_DIR = join(ROOT, "packages");

// Auto-discover every publishable package under packages/* so a newly added
// framework adapter can never be silently left out of the lockstep bump again
// (this is exactly what stranded @ssgoi/qwik at an old version).
export const discoverPackages = () =>
  readdirSync(PKG_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => join("packages", d.name))
    .filter((rel) => {
      try {
        const pkg = JSON.parse(
          readFileSync(join(ROOT, rel, "package.json"), "utf8")
        );
        return !pkg.private;
      } catch {
        return false; // no package.json (e.g. dist-only or scratch dirs)
      }
    });

const read = (p) =>
  JSON.parse(readFileSync(join(ROOT, p, "package.json"), "utf8"));
const cmp = (a, b) => {
  const A = a.split(".").map(Number);
  const B = b.split(".").map(Number);
  return A[0] - B[0] || A[1] - B[1] || A[2] - B[2];
};

// Resolve the next lockstep version and (unless write:false) apply it to every
// package. Exported so the release orchestrator reuses the exact same logic.
export function bump(arg, { write = true } = {}) {
  const PKGS = discoverPackages();
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
    else throw new Error(`Invalid bump type: ${arg}`);
  }

  if (cmp(next, max) <= 0) {
    throw new Error(`Refusing to bump down: max is ${max}, target is ${next}`);
  }

  console.log(
    `${write ? "Bumping" : "[dry] would bump"} ${PKGS.length} packages ` +
      `(lockstep): max ${max} -> ${next}\n`
  );
  for (const { p, v } of current) {
    if (write) {
      const file = join(ROOT, p, "package.json");
      const raw = readFileSync(file, "utf8");
      const trailing = raw.endsWith("\n") ? "\n" : "";
      const j = JSON.parse(raw);
      j.version = next;
      writeFileSync(file, JSON.stringify(j, null, 2) + trailing);
    }
    console.log(`  ${p}: ${v} -> ${next}`);
  }
  console.log(`\n${write ? "Done. All packages now at" : "[dry] target"} ${next}.`);
  return next;
}

// Pull every lagging package up to the current highest version WITHOUT inventing
// a new version number. Used by `pnpm release` with no bump arg, so a failed
// build never strands a phantom version bump.
export function syncToCurrent({ write = true } = {}) {
  const PKGS = discoverPackages();
  const current = PKGS.map((p) => ({ p, v: read(p).version }));
  const max = current.map((x) => x.v).sort(cmp).at(-1);
  const laggards = current.filter((x) => cmp(x.v, max) < 0);

  if (!laggards.length) {
    console.log(`All packages already at ${max}. Nothing to sync.`);
    return max;
  }

  console.log(
    `${write ? "Syncing" : "[dry] would sync"} ${laggards.length} package(s) ` +
      `up to current ${max}\n`
  );
  for (const { p, v } of current) {
    if (cmp(v, max) >= 0) continue;
    if (write) {
      const file = join(ROOT, p, "package.json");
      const raw = readFileSync(file, "utf8");
      const trailing = raw.endsWith("\n") ? "\n" : "";
      const j = JSON.parse(raw);
      j.version = max;
      writeFileSync(file, JSON.stringify(j, null, 2) + trailing);
    }
    console.log(`  ${p}: ${v} -> ${max}`);
  }
  console.log(`\n${write ? "Done. All packages now at" : "[dry] target"} ${max}.`);
  return max;
}

// Allow running standalone: `node scripts/bump-version.mjs <major|minor|patch|x.y.z>`
if (import.meta.url === `file://${process.argv[1]}`) {
  const arg = process.argv[2];
  if (!arg) {
    console.error(
      "Usage: node scripts/bump-version.mjs <major|minor|patch|x.y.z>"
    );
    process.exit(1);
  }
  try {
    bump(arg);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
