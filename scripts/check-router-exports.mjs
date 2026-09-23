#!/usr/bin/env node
// Run after pnpm release:build. Check packed entries, then Remix's real router on React 18.
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
const fixture = mkdtempSync(join(tmpdir(), "ssgoi-router-exports-"));
const local = createRequire(join(root, "packages/react/package.json"));
const entries = {
  react: ["nextjs", "remix", "react-router", "tanstack-router"],
  svelte: ["sveltekit"],
  vue: ["vue-router", "nuxt"],
  solid: ["solid-router", "solidstart"],
  qwik: ["qwik-city"],
  angular: ["router"],
  "react-native": ["expo-router"],
};
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
  const tarballs = {};
  for (const name of ["core", ...Object.keys(entries)]) {
    const cwd = join(root, "packages", name);
    const pkg = JSON.parse(readFileSync(join(cwd, "package.json"), "utf8"));
    run("pnpm", ["pack", "--pack-destination", fixture], cwd);
    const archive = join(fixture, `ssgoi-${name}-${pkg.version}.tgz`);
    tarballs[name] = archive;
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
    for (const entry of entries[name] ?? []) {
      const target = pkg.exports[`./${entry}`].types;
      assert(
        existsSync(join(cwd, target)),
        `${pkg.name}/${entry} types missing`,
      );
      const declaration = readFileSync(join(cwd, target), "utf8");
      assert.equal(
        declaration.includes("@experimental"),
        entry !== "nextjs",
        `${pkg.name}/${entry} experimental annotation`,
      );
    }
  }
  console.log(
    "All public entry targets exist in packed files; only Next.js omits the experimental annotation.",
  );
  writeFileSync(
    join(fixture, "package.json"),
    JSON.stringify({ private: true, type: "module" }),
  );
  run("npm", [
    "install",
    "--ignore-scripts",
    "--no-audit",
    "--no-fund",
    tarballs.core,
    tarballs.react,
    "react@18.3.1",
    "react-dom@18.3.1",
    "@types/react@18",
    "@types/react-dom@18",
    "@remix-run/react@2.17.5",
    "@remix-run/testing@2.17.5",
  ]);
  const consumer = createRequire(join(fixture, "package.json"));
  const { JSDOM } = local("jsdom");
  const dom = new JSDOM("<div id='app'></div>", {
    url: "http://localhost/posts/1",
  });
  for (const key of ["window", "document", "HTMLElement", "Element", "Node"])
    globalThis[key] = dom.window[key];
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const React = consumer("react");
  const { createRoot } = consumer("react-dom/client");
  const { createRemixStub } = consumer("@remix-run/testing");
  const { useNavigate, useLocation } = consumer("@remix-run/react");
  const { SsgoiRouteBoundary } = consumer("@ssgoi/react/remix");
  let navigate;
  function Page() {
    navigate = useNavigate();
    const location = useLocation();
    return React.createElement(
      SsgoiRouteBoundary,
      { as: "article" },
      location.pathname,
    );
  }
  const Stub = createRemixStub([{ path: "/posts/:id", Component: Page }]);
  const host = document.querySelector("#app");
  const renderer = createRoot(host);
  await React.act(async () =>
    renderer.render(
      React.createElement(Stub, { initialEntries: ["/posts/1"] }),
    ),
  );
  const outgoing = host.querySelector("article");
  assert.equal(outgoing?.getAttribute("data-ssgoi-transition"), "/posts/1");
  await React.act(async () => navigate("/posts/1?q=two"));
  assert.equal(host.querySelector("article"), outgoing);
  await React.act(async () => navigate("/posts/2"));
  assert.notEqual(host.querySelector("article"), outgoing);
  assert.equal(outgoing.textContent, "/posts/1");
  assert.equal(
    host.querySelector("article").getAttribute("data-ssgoi-transition"),
    "/posts/2",
  );
  await React.act(async () => renderer.unmount());
  dom.window.close();
  writeFileSync(
    join(fixture, "consumer.tsx"),
    `
import { Ssgoi } from "@ssgoi/react";
import { SsgoiRouteBoundary } from "@ssgoi/react/remix";
import { drill } from "@ssgoi/react/view-transitions";
export const app = <Ssgoi config={{ transitions: [{ on: "/**", transition: drill() }] }}><SsgoiRouteBoundary>Page</SsgoiRouteBoundary></Ssgoi>;
`,
  );
  run("node", [
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
  ]);
  console.log(
    "Packed Remix helper: real Remix router context, query-only identity, outgoing DOM, and strict React 18 consumer types passed.",
  );
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
