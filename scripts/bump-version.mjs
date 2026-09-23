#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
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
          readFileSync(join(ROOT, rel, "package.json"), "utf8"),
        );
        return !pkg.private;
      } catch {
        return false; // no package.json (e.g. dist-only or scratch dirs)
      }
    });

const read = (p) =>
  JSON.parse(readFileSync(join(ROOT, p, "package.json"), "utf8"));

const SEMVER_RE =
  /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;
const parseSemVer = (version) => {
  const match = SEMVER_RE.exec(version);
  if (!match) throw new Error(`Invalid version: ${version}`);
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4]?.split(".") ?? [],
  };
};
const comparePrerelease = (a, b) => {
  if (!a.length || !b.length) return a.length ? -1 : b.length ? 1 : 0;
  for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
    if (a[index] === undefined) return -1;
    if (b[index] === undefined) return 1;
    if (a[index] === b[index]) continue;
    const aNumeric = /^\d+$/.test(a[index]);
    const bNumeric = /^\d+$/.test(b[index]);
    if (aNumeric && bNumeric) return Number(a[index]) - Number(b[index]);
    if (aNumeric !== bNumeric) return aNumeric ? -1 : 1;
    return a[index].localeCompare(b[index]);
  }
  return 0;
};
const cmp = (a, b) => {
  const A = parseSemVer(a);
  const B = parseSemVer(b);
  return (
    A.major - B.major ||
    A.minor - B.minor ||
    A.patch - B.patch ||
    comparePrerelease(A.prerelease, B.prerelease)
  );
};

// Resolve the next lockstep version and (unless write:false) apply it to every
// package. Exported so the release orchestrator reuses the exact same logic.
export function bump(arg, { write = true } = {}) {
  const PKGS = discoverPackages();
  const current = PKGS.map((p) => ({ p, v: read(p).version }));
  const max = current
    .map((x) => x.v)
    .sort(cmp)
    .at(-1);

  let next;
  if (SEMVER_RE.test(arg)) {
    next = arg;
  } else {
    const { major: maj, minor: min, patch: pat } = parseSemVer(max);
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
      `(lockstep): max ${max} -> ${next}\n`,
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
  console.log(
    `\n${write ? "Done. All packages now at" : "[dry] target"} ${next}.`,
  );
  return next;
}

// Pull every lagging package up to the current highest version WITHOUT inventing
// a new version number. Used by `pnpm release` with no bump arg, so a failed
// build never strands a phantom version bump.
export function syncToCurrent({ write = true } = {}) {
  const PKGS = discoverPackages();
  const current = PKGS.map((p) => ({ p, v: read(p).version }));
  const max = current
    .map((x) => x.v)
    .sort(cmp)
    .at(-1);
  const laggards = current.filter((x) => cmp(x.v, max) < 0);

  if (!laggards.length) {
    console.log(`All packages already at ${max}. Nothing to sync.`);
    return max;
  }

  console.log(
    `${write ? "Syncing" : "[dry] would sync"} ${laggards.length} package(s) ` +
      `up to current ${max}\n`,
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
  console.log(
    `\n${write ? "Done. All packages now at" : "[dry] target"} ${max}.`,
  );
  return max;
}

// Allow running standalone:
// `node scripts/bump-version.mjs <major|minor|patch|x.y.z[-prerelease]>`
if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1])
) {
  const arg = process.argv[2];
  if (!arg) {
    console.error(
      "Usage: node scripts/bump-version.mjs <major|minor|patch|x.y.z[-prerelease]>",
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
