#!/usr/bin/env node
// Verify the built declaration files resolve under moduleResolution
// node16/nodenext. Run after pnpm release:build.
//
// Every package is "type": "module", so each relative specifier in its .d.ts
// files must be fully specified (`./x.js`, `./x/index.js`) and must point at an
// emitted declaration. An extensionless or `.ts` specifier silently drops
// exports for node16 consumers (meursyphus/ssgoi#464); the package builds run
// scripts/fix-dts-extensions.mjs to prevent that, and this guards it.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  findDeclarationFiles,
  fullySpecified,
  relativeSpecifiers,
} from "./fix-dts-extensions.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
// Every package; declarations live in lib-types (qwik) or dist (the rest).
const declarationDirs = readdirSync(join(root, "packages"), {
  withFileTypes: true,
})
  .filter((entry) => entry.isDirectory())
  .map(({ name }) => [
    name,
    existsSync(join(root, "packages", name, "lib-types"))
      ? "lib-types"
      : "dist",
  ]);

const problems = [];
for (const [name, dir] of declarationDirs) {
  const path = join(root, "packages", name, dir);
  const files = existsSync(path) ? findDeclarationFiles(path) : [];
  if (files.length === 0) {
    problems.push(
      `packages/${name}/${dir}: no declaration files (build first)`,
    );
    continue;
  }
  let checked = 0;
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const { specifier } of relativeSpecifiers(text)) {
      checked += 1;
      const fixed = fullySpecified(file, specifier);
      if (fixed === specifier) continue;
      problems.push(
        `${relative(root, file)}: '${specifier}' ` +
          (fixed
            ? `is not fully specified (expected '${fixed}')`
            : "matches no emitted declaration"),
      );
    }
  }
  console.log(
    `packages/${name}/${dir}: ${files.length} declaration file(s), ` +
      `${checked} relative specifier(s)`,
  );
}

if (problems.length > 0) {
  console.error(`\n${problems.length} unresolvable declaration import(s):`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}
console.log("\nAll relative declaration imports resolve under node16.");
