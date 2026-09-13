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
      framework: ["@builder.io/qwik@1.20.0"],
      router: "@builder.io/qwik-city",
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
    // Qwik 1.20.0 ships an invalid ambient `{ JSX };` statement in core.d.ts.
    // Keep application checks strict, matching its template's skipLibCheck setting.
    const dependencyTypeOptions = name === "qwik" ? ["--skipLibCheck"] : [];
    run(
      "node",
      [
        local.resolve("typescript/bin/tsc"),
        ...dependencyTypeOptions,
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
      `${name}: packed root installs, type-checks${name === "qwik" ? " (upstream declaration checks skipped)" : ""}, and bundles without ${router}.`,
    );
  }
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
