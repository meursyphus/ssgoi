#!/usr/bin/env node
// Run after building core and the three adapters. Validate actual npm archives
// in a consumer outside the workspace, where hoisted peers cannot mask errors.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixture = mkdtempSync(join(tmpdir(), "ssgoi-framework-adapters-"));
function run(command, args, cwd = fixture) {
  try {
    return execFileSync(command, args, {
      cwd,
      encoding: "utf8",
      env: { ...process.env, npm_config_ignore_scripts: "true" },
      stdio: "pipe",
    });
  } catch (error) {
    process.stderr.write(error.stdout ?? "");
    process.stderr.write(error.stderr ?? "");
    throw error;
  }
}
try {
  const archives = [];
  const imports = [];
  const requires = [];
  const coreVersion = JSON.parse(
    readFileSync(join(root, "packages/core/package.json"), "utf8"),
  ).version;
  for (const name of ["core", "preact", "lit", "alpine"]) {
    const cwd = join(root, "packages", name);
    const pkg = JSON.parse(readFileSync(join(cwd, "package.json"), "utf8"));
    assert.equal(pkg.version, coreVersion, `${name} must release in lockstep`);
    run("pnpm", ["pack", "--pack-destination", fixture], cwd);
    const archive = join(fixture, `ssgoi-${name}-${pkg.version}.tgz`);
    archives.push(archive);
    const files = new Set(run("tar", ["-tzf", archive]).trim().split("\n"));
    for (const [entry, conditions] of Object.entries(pkg.exports)) {
      const specifier = pkg.name + (entry === "." ? "" : entry.slice(1));
      for (const target of Object.values(conditions)) {
        assert(
          files.has(`package/${target.slice(2)}`),
          `${specifier}: missing ${target}`,
        );
      }
      imports.push(specifier);
      if (conditions.require) requires.push(specifier);
    }
    if (name !== "core") {
      assert(
        !pkg.dependencies?.react && !pkg.peerDependencies?.react,
        `${name} requires React`,
      );
      assert(
        [...files].every((file) => !/\.(test|spec)\./.test(file)),
        `${name} ships tests`,
      );
    }
  }
  writeFileSync(
    join(fixture, "package.json"),
    JSON.stringify({ private: true, type: "module" }),
  );
  run("npm", [
    "install",
    "--ignore-scripts",
    "--no-audit",
    "--no-fund",
    ...archives,
    "preact@10",
    "lit@3",
    "alpinejs@3",
  ]);
  writeFileSync(
    join(fixture, "imports.mjs"),
    `
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
assert.equal(typeof document, "undefined");
for (const entry of ${JSON.stringify(imports)}) await import(entry);
for (const entry of ${JSON.stringify(requires)}) require(entry);
for (const absent of ["react", "react-dom", "next", "vue", "solid-js", "svelte"]) {
  assert.throws(() => require.resolve(absent), { code: "MODULE_NOT_FOUND" });
}
`,
  );
  run(process.execPath, ["imports.mjs"]);
  writeFileSync(
    join(fixture, "consumer.tsx"),
    `
import { Ssgoi, SsgoiRouteBoundary, useSsgoiTransition, WebAnimation } from "@ssgoi/preact";
import { fade } from "@ssgoi/preact/view-transitions";
import type { SsgoiConfig } from "@ssgoi/preact/types";
import { LitElement, html } from "lit";
import { ref } from "lit/directives/ref.js";
import { SsgoiController, animate } from "@ssgoi/lit";
import { fade as litFade } from "@ssgoi/lit/view-transitions";
import Alpine from "alpinejs";
import ssgoi from "@ssgoi/alpine";
import { fade as alpineFade } from "@ssgoi/alpine/view-transitions";
const config: SsgoiConfig = { transitions: [{ on: "/**", transition: fade() }] };
export function Page() {
  const state = useSsgoiTransition();
  return <output>{state.status}</output>;
}
export const app = <Ssgoi config={config}><SsgoiRouteBoundary id="/home" as="main"><Page /></SsgoiRouteBoundary></Ssgoi>;
export class LitApp extends LitElement {
  ssgoi = new SsgoiController(this, { transitions: [{ on: "/**", transition: litFade() }] });
  createRenderRoot() { return this; }
  render() { return html\`<main \$\{ref(this.ssgoi.ref)\}><article data-ssgoi-transition="/home">Home</article></main>\`; }
}
Alpine.plugin(ssgoi);
export const alpineConfig = { transitions: [{ on: "/**", transition: alpineFade() }] };
void animate;
void WebAnimation;
`,
  );
  // Use the workspace compiler executable while resolving all consumer imports
  // strictly from the isolated fixture's node_modules.
  const tsc = join(root, "packages/preact/node_modules/typescript/bin/tsc");
  run(process.execPath, [
    tsc,
    "--noEmit",
    "--strict",
    "--target",
    "ES2022",
    "--module",
    "ESNext",
    "--moduleResolution",
    "Bundler",
    "--lib",
    "ES2022,DOM,DOM.Iterable",
    "--jsx",
    "react-jsx",
    "--jsxImportSource",
    "preact",
    "consumer.tsx",
  ]);
  console.log(
    "Preact, Lit, and Alpine packed exports, SSR-safe imports, consumer types, lockstep versions, and framework isolation passed.",
  );
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
