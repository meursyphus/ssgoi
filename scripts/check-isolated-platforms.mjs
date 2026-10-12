#!/usr/bin/env node
// Qwik and Angular use separate fixtures so their build-tool peers do not constrain one another.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixture = mkdtempSync(join(tmpdir(), "ssgoi-platform-isolation-"));
const local = createRequire(join(root, "packages/react/package.json"));
const vite = createRequire(local.resolve("vite/package.json"));
const { build } = vite("esbuild");
function run(command, args, cwd) {
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
  const archives = {};
  for (const name of ["core", "qwik", "angular"]) {
    const cwd = join(root, "packages", name);
    const pkg = JSON.parse(readFileSync(join(cwd, "package.json")));
    run("pnpm", ["pack", "--pack-destination", fixture], cwd);
    archives[name] = join(fixture, `ssgoi-${name}-${pkg.version}.tgz`);
  }
  const variants = [
    {
      name: "qwik",
      framework: ["@qwik.dev/core@2.0.0-rc.2"],
      router: "@qwik.dev/router",
    },
    {
      name: "angular",
      framework: ["@angular/core@20.3.9", "@angular/common@20.3.9"],
      router: "@angular/router",
    },
  ];
  for (const { name, framework, router } of variants) {
    const cwd = join(fixture, name);
    mkdirSync(cwd);
    writeFileSync(
      join(cwd, "package.json"),
      JSON.stringify({ private: true, type: "module" }),
    );
    run(
      "npm",
      [
        "install",
        "--ignore-scripts",
        "--no-audit",
        "--no-fund",
        archives.core,
        archives[name],
        ...framework,
        "@types/node@22",
      ],
      cwd,
    );
    const consumer = createRequire(join(cwd, "package.json"));
    assert.throws(() => consumer.resolve(router), { code: "MODULE_NOT_FOUND" });
    writeFileSync(
      join(cwd, "consumer.ts"),
      `import { Ssgoi } from "@ssgoi/${name}";\nexport const Provider = Ssgoi;\n`,
    );
    run(
      "node",
      [
        local.resolve("typescript/bin/tsc"),
        "--noEmit",
        "--strict",
        "--target",
        "es2022",
        "--module",
        "esnext",
        "--moduleResolution",
        "bundler",
        "consumer.ts",
      ],
      cwd,
    );
    const result = await build({
      absWorkingDir: cwd,
      entryPoints: ["consumer.ts"],
      bundle: true,
      write: false,
      format: "esm",
      platform: "browser",
      metafile: true,
    });
    assert(
      Object.keys(result.metafile.inputs).every(
        (path) => !path.includes(`node_modules/${router}/`),
      ),
    );
    console.log(
      `${name}: packed root installs, type-checks, and bundles without ${router}.`,
    );
    if (name === "qwik") {
      run(
        "npm",
        [
          "install",
          "--ignore-scripts",
          "--no-audit",
          "--no-fund",
          "@qwik.dev/router@2.0.0-rc.2",
        ],
        cwd,
      );
      for (const legacy of ["@builder.io/qwik", "@builder.io/qwik-city"]) {
        assert.throws(() => consumer.resolve(legacy), {
          code: "MODULE_NOT_FOUND",
        });
      }
      writeFileSync(
        join(cwd, "router-consumer.ts"),
        `
import type { Signal } from "@qwik.dev/core";
import { useSsgoiRouteBoundary, type RouteBoundaryState } from "@ssgoi/qwik/qwik-router";
import { useSsgoiRouteBoundary as legacyAlias } from "@ssgoi/qwik/qwik-city";
export const boundary: () => Signal<RouteBoundaryState> = useSsgoiRouteBoundary;
export const persistent: () => Signal<RouteBoundaryState> = () => legacyAlias("shell");
`,
      );
      run(
        "node",
        [
          local.resolve("typescript/bin/tsc"),
          "--noEmit",
          "--strict",
          "--target",
          "es2022",
          "--module",
          "esnext",
          "--moduleResolution",
          "bundler",
          "--types",
          "node",
          "router-consumer.ts",
        ],
        cwd,
      );
      run(
        "node",
        [
          "--input-type=module",
          "-e",
          `
import assert from "node:assert/strict";
import { useSsgoiRouteBoundary } from "@ssgoi/qwik/qwik-router";
import { useSsgoiRouteBoundary as legacyAlias } from "@ssgoi/qwik/qwik-city";
assert.equal(typeof useSsgoiRouteBoundary, "function");
assert.equal(useSsgoiRouteBoundary, legacyAlias);
// Qwik can keep Node handles alive; the import-only assertions are complete.
process.exit(0);
`,
        ],
        cwd,
      );
      console.log(
        "qwik: packed Qwik Router export and deprecated alias type-check and import with Qwik 2 RC, without Qwik 1.",
      );
    }
  }
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
