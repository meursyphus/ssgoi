#!/usr/bin/env node
// Run after pnpm release:build. Every published export target must exist in the tarball.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixture = mkdtempSync(join(tmpdir(), "ssgoi-router-exports-"));
const packages = [
  "core",
  "react",
  "svelte",
  "vue",
  "solid",
  "qwik",
  "angular",
  "react-native",
];
function run(command, args, cwd = fixture) {
  try {
    return execFileSync(command, args, {
      cwd,
      env: { ...process.env, npm_config_ignore_scripts: "true" },
      encoding: "utf8",
      stdio: "pipe",
    });
  } catch (error) {
    process.stderr.write(error.stdout ?? "");
    process.stderr.write(error.stderr ?? "");
    throw error;
  }
}
try {
  for (const name of packages) {
    const cwd = join(root, "packages", name);
    const pkg = JSON.parse(readFileSync(join(cwd, "package.json"), "utf8"));
    run("pnpm", ["pack", "--pack-destination", fixture], cwd);
    const archive = join(fixture, `ssgoi-${name}-${pkg.version}.tgz`);
    const files = new Set(run("tar", ["-tzf", archive]).trim().split("\n"));
    for (const [entry, conditions] of Object.entries(pkg.exports ?? {})) {
      for (const target of Object.values(
        typeof conditions === "string" ? { default: conditions } : conditions,
      )) {
        if (typeof target === "string" && target.startsWith("./")) {
          assert(
            files.has(`package/${target.slice(2)}`),
            `${pkg.name}${entry}: missing packed file ${target}`,
          );
        }
      }
    }
  }
  console.log("All public entry targets exist in packed files.");
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
