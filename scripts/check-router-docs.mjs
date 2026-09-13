#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const local = createRequire(join(root, "packages/react/package.json"));
const ts = local("typescript");
async function sourceModule(path) {
  const source = readFileSync(join(root, path), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });
  return import(
    `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
  );
}
const { FRAMEWORK_DOCS, LEGACY_FRAMEWORK_PATHS, getLegacyFrameworkPath } = await sourceModule(
  "apps/docs/src/page/docs/frameworks-data.ts",
);
const { DOCS_NAV, DOCS_NAV_FLAT } = await sourceModule(
  "apps/docs/src/page/docs/nav.ts",
);
assert.equal(getLegacyFrameworkPath("toString"), undefined);
assert.equal(getLegacyFrameworkPath("__proto__"), undefined);
const anchors = new Set();
for (const framework of FRAMEWORK_DOCS) {
  const path = `/docs/frameworks/${framework.slug}`;
  anchors.add(path);
  assert(!/experimental|preview/i.test(framework.name));
  for (const router of framework.routers) {
    anchors.add(`${path}#${router.slug}`);
    assert.equal(router.experimental, router.slug !== "nextjs", router.slug);
    assert(!/experimental|preview/i.test(router.name));
    if (router.llmsUrl) {
      const file = join(
        root,
        "apps/docs/public",
        new URL(router.llmsUrl).pathname,
      );
      assert(existsSync(file), `Missing guide ${file}`);
      const content = readFileSync(file, "utf8");
      assert.equal(
        content.includes("Experimental API:"),
        router.experimental,
        `${router.slug} agent guide status`,
      );
    }
  }
}
function checkNav(nodes) {
  for (const node of nodes) {
    assert(
      !/experimental|preview/i.test(node.title),
      `Status leaked into sidebar: ${node.title}`,
    );
    if (node.href?.startsWith("/docs/frameworks/"))
      assert(anchors.has(node.href), `Missing section ${node.href}`);
    if (node.children) checkNav(node.children);
  }
}
for (const group of DOCS_NAV) checkNav(group.items);
for (const path of Object.values(LEGACY_FRAMEWORK_PATHS))
  assert(anchors.has(path), path);
assert(
  DOCS_NAV_FLAT.every((node) => !node.href.includes("#")),
  "Section links leaked into page pagination",
);
const llms = readFileSync(join(root, "apps/docs/public/llms.txt"), "utf8");
assert(llms.includes("Next.js App Router"));
assert(llms.includes('from "@ssgoi/react/nextjs"'));
assert(!llms.includes("manual-boundaries"));
assert(
  llms.split("\n").length < 100,
  "The minimal Next.js guide grew beyond its intended scope",
);
const version = JSON.parse(
  readFileSync(join(root, "packages/core/package.json")),
).version;
assert(llms.includes(`Current version: \`@ssgoi/core@${version}\``));
console.log(
  "Framework groups, router anchors, subtle experimental metadata, legacy redirects, page navigation, and minimal Next.js llms.txt passed.",
);
