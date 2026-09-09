#!/usr/bin/env node
// Exercise packed packages outside the workspace. Run after core/native builds.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixture = mkdtempSync(join(tmpdir(), "ssgoi-native-isolation-"));
const local = createRequire(join(root, "packages/react-native/package.json"));
const tsc = local.resolve("typescript/bin/tsc");
const run = (command, args, cwd = fixture) => {
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
};
const install = (...packages) =>
  run("npm", [
    "install",
    "--ignore-scripts",
    "--no-audit",
    "--no-fund",
    ...packages,
  ]);
const write = (name, value) =>
  writeFileSync(
    join(fixture, name),
    typeof value === "string" ? value : JSON.stringify(value),
  );

try {
  write("package.json", { private: true, type: "module" });
  const archives = {};
  for (const name of ["core", "react-native"]) {
    const cwd = join(root, "packages", name);
    const pkg = JSON.parse(readFileSync(join(cwd, "package.json"), "utf8"));
    run("pnpm", ["pack", "--pack-destination", fixture], cwd);
    archives[name] = join(fixture, `ssgoi-${name}-${pkg.version}.tgz`);
  }
  install(archives.core);
  write(
    "core.ts",
    `import { Animation, resolveTransitionRule, simulate, IntegratorProvider, type Pose, type Timeline, type TransitionView } from "@ssgoi/core/runtime";
type NativeTarget = { nativeHandle: number };
const target: NativeTarget = { nativeHandle: 42 };
export const pose: Pose<NativeTarget> = { element: target, value: 0, velocity: 0 };
export const timeline: Timeline<NativeTarget, { x: number }> = { element: target, frames: [{ time: 0, value: 0, velocity: 0, style: { x: 0 } }] };
export const view: TransitionView<NativeTarget, string> = { key: "screen:42", path: "/posts/42", target, value: "route payload" };
export abstract class NativeBackend extends Animation<NativeTarget, { x: number }> {}
// @ts-expect-error A native pose cannot accidentally receive another platform target.
const wrong: Pose<NativeTarget> = { element: "DOM", value: 0, velocity: 0 };
const rule = { on: "/posts/*", transition: { native: true } };
export const result = resolveTransitionRule("/posts", "/posts/42", [rule], "forward");
export const frames = simulate(IntegratorProvider.from({ spring: { stiffness: 170, damping: 22 } }), 0, 1, 0);
`,
  );
  write("tsconfig.json", {
    compilerOptions: {
      strict: true,
      noEmit: true,
      skipLibCheck: false,
      target: "ES2020",
      module: "ESNext",
      moduleResolution: "Bundler",
      lib: ["ES2020"],
      types: [],
    },
    files: ["core.ts"],
  });
  run("node", [tsc, "-p", "tsconfig.json"]);
  run("node", [
    "--input-type=module",
    "-e",
    `
for (const name of ["window", "document", "HTMLElement", "MutationObserver"]) Object.defineProperty(globalThis, name, { get() { throw new Error("DOM access: " + name); } });
const { createPageMotionPlan } = await import("@ssgoi/core/runtime");
if (!(createPageMotionPlan("slide", "forward").duration > 0)) throw new Error("Missing timeline");
`,
  ]);
  console.log(
    "Core runtime: packed import and strict types pass without DOM or framework globals.",
  );

  install(
    archives["react-native"],
    "react@19.2.3",
    "@types/react@19.2.0",
    "react-native@0.85.3",
    "react-native-reanimated@4.3.1",
    "react-native-worklets@0.8.3",
    "@react-native/metro-config@0.85.3",
    "@babel/core@7.28.5",
  );
  for (const name of ["expo-router", "expo", "next", "react-dom"])
    assert(
      !existsSync(join(fixture, "node_modules", name)),
      `${name} was installed by the native root`,
    );
  write(
    "native.tsx",
    `import { Ssgoi, type SsgoiConfig } from "@ssgoi/react-native";
import { slide } from "@ssgoi/react-native/view-transitions";
import { View } from "react-native";
const config: SsgoiConfig = { transitions: [{ on: "/posts/*", transition: slide() }] };
export const app = <Ssgoi config={config}><View /></Ssgoi>;
// @ts-expect-error Explicit scroll restoration is not part of the native MVP.
const unsupported: SsgoiConfig = { transitions: [{ on: "/**", transition: slide(), preserveScroll: { from: true, to: true } }] };
`,
  );
  write("tsconfig.json", {
    compilerOptions: {
      strict: true,
      noEmit: true,
      skipLibCheck: false,
      jsx: "react-jsx",
      target: "ES2020",
      module: "ESNext",
      moduleResolution: "Bundler",
      lib: ["ES2020"],
      types: ["react-native"],
    },
    files: ["native.tsx"],
  });
  run("node", [tsc, "-p", "tsconfig.json"]);
  const { build } = createRequire(join(root, "packages/core/package.json"))(
    "esbuild",
  );
  const result = await build({
    absWorkingDir: fixture,
    entryPoints: ["native.tsx"],
    bundle: true,
    write: false,
    metafile: true,
    format: "esm",
    platform: "neutral",
    conditions: ["react-native"],
    external: [
      "react",
      "react/*",
      "react-native",
      "react-native-reanimated",
      "react-native-worklets",
    ],
    plugins: [
      {
        name: "no-web-or-router",
        setup(builder) {
          builder.onResolve(
            {
              filter:
                /^(expo-router(?:\/|$)|expo$|@ssgoi\/core(?:\/internal)?$|react-dom(?:\/|$))/,
            },
            ({ path }) => {
              throw new Error(`Unexpected native dependency: ${path}`);
            },
          );
        },
      },
    ],
  });
  assert(
    Object.keys(result.metafile.inputs).some((input) =>
      input.includes("@ssgoi/core"),
    ),
  );
  console.log(
    "Native root: clean npm install, strict native types, and bundle pass without Expo or web entry points.",
  );
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
