#!/usr/bin/env node
// Run after pnpm release:build. Exercise packed artifacts outside the workspace.
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
const fixture = mkdtempSync(join(tmpdir(), "ssgoi-react-adapters-"));
const adapters = [
  { name: "nextjs", router: "next", version: "16.1.0" },
  { name: "react-router", router: "react-router", version: "7.10.1" },
  {
    name: "tanstack-router",
    router: "@tanstack/react-router",
    version: "1.93.0",
  },
];
const local = createRequire(join(root, "packages/react/package.json"));
const vite = createRequire(local.resolve("vite/package.json"));
const { build } = vite("esbuild");

function run(command, args, cwd) {
  try {
    return execFileSync(command, args, {
      cwd,
      encoding: "utf8",
      stdio: "pipe",
    });
  } catch (error) {
    process.stderr.write(error.stdout ?? "");
    process.stderr.write(error.stderr ?? "");
    throw error;
  }
}
function json(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

try {
  const archives = {};
  for (const name of [
    "core",
    "react",
    ...adapters.map((adapter) => adapter.name),
  ]) {
    const cwd = join(root, "packages", name);
    run("pnpm", ["pack", "--pack-destination", fixture], cwd);
    const pkg = json(join(cwd, "package.json"));
    archives[name] = join(fixture, `ssgoi-${name}-${pkg.version}.tgz`);
  }
  for (const { name, router, version } of adapters) {
    const cwd = join(fixture, name);
    mkdirSync(cwd);
    // Only the router facade is a direct SSGOI dependency. Overrides supply the
    // unpublished local platform/core tarballs, without installing them directly.
    writeFileSync(
      join(cwd, "package.json"),
      JSON.stringify({
        private: true,
        type: "module",
        dependencies: {
          [`@ssgoi/${name}`]: `file:${archives[name]}`,
          [router]: version,
          react: "19.2.3",
          "react-dom": "19.2.3",
          "@types/react": "^19",
          "@types/react-dom": "^19",
        },
        overrides: {
          "@ssgoi/react": `file:${archives.react}`,
          "@ssgoi/core": `file:${archives.core}`,
        },
      }),
    );
    run("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund"], cwd);
    const consumer = createRequire(join(cwd, "package.json"));
    const adapter = consumer(`@ssgoi/${name}`);
    const platform = consumer("@ssgoi/react");
    const manifest = json(
      join(cwd, "node_modules", "@ssgoi", name, "package.json"),
    );
    assert.equal(
      manifest.dependencies["@ssgoi/react"],
      json(join(root, "packages/react/package.json")).version,
    );
    assert(manifest.peerDependencies[router]);
    assert(!manifest.peerDependenciesMeta?.[router]?.optional);
    for (const key of Object.keys(platform)) {
      assert.equal(
        adapter[key],
        platform[key],
        `${name} changed the identity of ${key}`,
      );
    }
    assert.equal(typeof adapter.SsgoiRouteBoundary, "function");
    for (const other of adapters.filter(
      (candidate) => candidate.router !== router,
    )) {
      assert.throws(() => consumer.resolve(other.router), {
        code: "MODULE_NOT_FOUND",
      });
    }
    for (const subpath of [
      "view-transitions",
      "unplugin",
      "unplugin/webpack",
      "unplugin/vite",
      "unplugin/rollup",
      "unplugin/esbuild",
    ]) {
      const forwarded = consumer(`@ssgoi/${name}/${subpath}`);
      const original = consumer(`@ssgoi/react/${subpath}`);
      for (const key of Object.keys(original))
        assert.equal(forwarded[key], original[key]);
    }
    writeFileSync(
      join(cwd, "consumer.tsx"),
      `
import { Ssgoi, SsgoiRouteBoundary, type SsgoiConfig } from "@ssgoi/${name}";
import { drill } from "@ssgoi/${name}/view-transitions";
import type { SsgoiConfig as ConfigFromTypes } from "@ssgoi/${name}/types";
const config: SsgoiConfig & ConfigFromTypes = { transitions: [{ on: "/**", transition: drill() }] };
export const app = <Ssgoi config={config}><SsgoiRouteBoundary routeKey="shell">Page</SsgoiRouteBoundary></Ssgoi>;
`,
    );
    run(
      "node",
      [
        local.resolve("typescript/bin/tsc"),
        "--noEmit",
        "--strict",
        "--jsx",
        "react-jsx",
        "--target",
        "es2022",
        "--module",
        "esnext",
        "--moduleResolution",
        "bundler",
        "--allowSyntheticDefaultImports",
        "consumer.tsx",
      ],
      cwd,
    );
    const bundled = await build({
      absWorkingDir: cwd,
      entryPoints: ["consumer.tsx"],
      bundle: true,
      write: false,
      format: "esm",
      platform: "browser",
      metafile: true,
    });
    for (const input of Object.keys(bundled.metafile.inputs)) {
      assert(
        !input.includes("node_modules/@babel/"),
        `${name} leaked Babel into its runtime`,
      );
      assert(
        !input.includes("node_modules/unplugin/"),
        `${name} leaked build tooling into its runtime`,
      );
    }
    console.log(
      `${name}: single SSGOI install, required router peer, public API identity, forwarded subpaths, strict types, and browser bundle passed.`,
    );
  }
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
