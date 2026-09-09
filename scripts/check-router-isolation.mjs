#!/usr/bin/env node
// Verify the published artifacts in a real consumer outside the pnpm workspace.
// Run after pnpm release:build. No optional router may be installed or resolved
// by a root import, including when TypeScript checks every declaration.
import assert from "node:assert/strict";
import {
  mkdtempSync,
  readFileSync,
  writeFileSync,
  existsSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixture = mkdtempSync(join(tmpdir(), "ssgoi-router-isolation-"));
const packages = ["core", "react", "svelte", "vue", "solid"];
const routers = [
  "next",
  "react-router",
  "@tanstack/react-router",
  "@sveltejs/kit",
  "vue-router",
  "@solidjs/router",
  "nuxt",
];
function run(command, args, cwd = fixture) {
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
try {
  const tarballs = packages.map((pkg) => {
    run(
      "pnpm",
      ["pack", "--pack-destination", fixture],
      join(root, "packages", pkg),
    );
    const { name, version } = JSON.parse(
      readFileSync(join(root, "packages", pkg, "package.json"), "utf8"),
    );
    return join(fixture, `${name.slice(1).replace("/", "-")}-${version}.tgz`);
  });
  writeFileSync(
    join(fixture, "package.json"),
    JSON.stringify({ private: true, type: "module" }),
  );
  // React 18 and Svelte 5.0 exercise the lower framework bounds too.
  run("npm", [
    "install",
    "--ignore-scripts",
    "--no-audit",
    "--no-fund",
    ...tarballs,
    "react@18.3.1",
    "react-dom@18.3.1",
    "@types/react@18",
    "@types/react-dom@18",
    "svelte@5.0.0",
    "vue@3.5.22",
    "solid-js@1.9.13",
  ]);
  const consumer = createRequire(join(fixture, "package.json"));
  for (const router of routers) {
    assert(
      !existsSync(join(fixture, "node_modules", router)),
      `${router} was installed`,
    );
    assert.throws(() => consumer.resolve(router), { code: "MODULE_NOT_FOUND" });
  }
  writeFileSync(
    join(fixture, "consumer.tsx"),
    `
import { Ssgoi as ReactSsgoi, type SsgoiConfig } from "@ssgoi/react";
import { Ssgoi as SvelteSsgoi } from "@ssgoi/svelte";
import { Ssgoi as VueSsgoi } from "@ssgoi/vue";
import { Ssgoi as SolidSsgoi } from "@ssgoi/solid";
import { drill } from "@ssgoi/react/view-transitions";
const config: SsgoiConfig = { transitions: [{ on: "/**", transition: drill() }] };
export const app = <ReactSsgoi config={config}><div>Page</div></ReactSsgoi>;
export { SvelteSsgoi, VueSsgoi, SolidSsgoi };
`,
  );
  run("node", [
    join(root, "packages/react/node_modules/typescript/bin/tsc"),
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
    "consumer.tsx",
  ]);
  const require = createRequire(join(root, "packages/react/package.json"));
  const viteRequire = createRequire(require.resolve("vite/package.json"));
  const { build } = viteRequire("esbuild");
  const { compile } = consumer("svelte/compiler");
  const output = await build({
    absWorkingDir: fixture,
    entryPoints: ["consumer.tsx"],
    bundle: true,
    write: false,
    format: "esm",
    platform: "browser",
    metafile: true,
    plugins: [
      {
        name: "svelte-consumer",
        setup(build) {
          build.onLoad({ filter: /\.svelte$/ }, ({ path }) => ({
            contents: compile(readFileSync(path, "utf8"), {
              filename: path,
              generate: "client",
            }).js.code,
            loader: "js",
            resolveDir: dirname(path),
          }));
        },
      },
    ],
  });
  for (const input of Object.keys(output.metafile.inputs)) {
    assert(
      !routers.some((router) => input.includes(`node_modules/${router}/`)),
      `Router leaked: ${input}`,
    );
  }
  for (const entry of [
    "@ssgoi/react",
    "@ssgoi/react/view-transitions",
    "@ssgoi/vue",
  ]) {
    assert(consumer(entry), `${entry} CommonJS entry failed`);
  }
  // An installed legacy router must not constrain a consumer of root exports.
  // npm cannot scope peer ranges to subpath imports, so optional router peers
  // deliberately use *. Supported adapter versions are documented separately.
  run("npm", [
    "install",
    "--ignore-scripts",
    "--no-audit",
    "--no-fund",
    "react-router@5.3.4",
  ]);
  assert.equal(consumer("react-router/package.json").version, "5.3.4");
  assert(consumer("@ssgoi/react"));
  console.log(
    "Router isolation passed: clean npm install, strict root types, browser bundle, CommonJS root imports without routers, and coexistence with an unused legacy router.",
  );
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
