#!/usr/bin/env node
// One-shot lockstep release for @ssgoi/*.
//
//   pnpm release              # SYNC: pull laggards up to the current top version
//                             #       (no new version invented), build, publish
//   pnpm release patch        # bump 6.6.3 -> 6.6.4 everywhere, build, publish
//   pnpm release minor        # 6.7.0
//   pnpm release major        # 7.0.0
//   pnpm release 7.0.0        # explicit version
//
//   --dry          rehearse everything; never writes versions, never publishes
//   --no-publish   write versions + build, but stop before publishing
//
// If the BUILD fails, any version changes are rolled back so a failed run never
// leaves a phantom bump on disk with nothing published.
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { bump, syncToCurrent, discoverPackages } from "./bump-version.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const argv = process.argv.slice(2);
const dry = argv.includes("--dry");
const noPublish = argv.includes("--no-publish");
const arg = argv.find((a) => !a.startsWith("--")); // undefined => sync mode

const run = (cmd, args) => {
  console.log(`\n$ ${cmd} ${args.join(" ")}`);
  return spawnSync(cmd, args, { cwd: ROOT, stdio: "inherit" }).status === 0;
};

// Snapshot every package.json up front so a failed build can be rolled back.
const files = discoverPackages().map((p) => join(ROOT, p, "package.json"));
const snapshot = files.map((f) => ({ f, raw: readFileSync(f, "utf8") }));
const rollback = () => snapshot.forEach((s) => writeFileSync(s.f, s.raw));

// 1) Resolve + apply versions. No arg = sync to current top; arg = lockstep bump.
const version = arg
  ? bump(arg, { write: !dry })
  : syncToCurrent({ write: !dry });

// 2) Build. pnpm -r runs in dependency order (core before the adapters).
if (!run("pnpm", ["-r", "--filter", "./packages/*", "run", "build"])) {
  if (!dry) {
    console.error("\n✗ Build failed — rolling back version changes. Nothing published.");
    rollback();
  } else {
    console.error("\n✗ Build failed (dry run — nothing was written).");
  }
  process.exit(1);
}

if (noPublish) {
  console.log(`\n✓ Build OK at ${version}. --no-publish set, skipping publish.`);
  process.exit(0);
}

// 3) Publish. workspace:^ is rewritten to ^<version> on publish.
const pubArgs = ["-r", "--filter", "./packages/*", "publish", "--access", "public", "--no-git-checks"];
if (dry) pubArgs.push("--dry-run");
if (!run("pnpm", pubArgs)) {
  // Do NOT roll back here: a publish may have partially succeeded on npm, and
  // reverting local versions would desync git from what's already published.
  console.error("\n✗ Publish failed. Versions left as-is — fix and re-run; npm rejects duplicate versions.");
  process.exit(1);
}

console.log(`\n✓ Released @ssgoi/* at ${version}${dry ? " (dry run — nothing published)" : ""}`);
