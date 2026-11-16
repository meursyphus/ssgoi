#!/usr/bin/env node
// Make every relative specifier in emitted declaration files fully specified.
//
//   node ../../scripts/fix-dts-extensions.mjs dist        (run from a package)
//
// The packages are "type": "module", so TypeScript reads their .d.ts files as
// ES modules. Under moduleResolution node16/nodenext, a relative import in an
// ES module must name its file: `./motion` and `./types/index.ts` do not
// resolve, and every export behind them goes missing or becomes `any`
// (meursyphus/ssgoi#464). The declaration emitters (vite-plugin-dts, tsc,
// svelte-package) copy specifiers from source, where bundler resolution allows
// them. This rewrites each one to the `.js` path TypeScript maps back to the
// emitted declaration: `./motion` -> `./motion.js` or `./motion/index.js`,
// `./types/index.ts` -> `./types/index.js`, `./ssgoi.svelte` ->
// `./ssgoi.svelte.js`. The choice is made by what exists in the emitted tree,
// file before directory, as bundler resolution picks it. Runtime JavaScript is
// untouched. A specifier that matches no emitted declaration fails the build.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const DECLARATION = /\.d\.(ts|mts|cts)$/;
const FULLY_SPECIFIED = /\.(js|mjs|cjs|json)$/;
// `from "./x"`, bare `import "./x"`, and import types `import("./x")`.
const SPECIFIER =
  /(\bfrom\s*|\bimport\s*|\bimport\s*\(\s*)(["'])(\.\.?(?:\/[^"'\n]*)?)\2/g;

export function findDeclarationFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...findDeclarationFiles(path));
    else if (DECLARATION.test(entry.name)) out.push(path);
  }
  return out;
}

// Blank out comments (same length, newlines kept) so example code in JSDoc is
// never read as an import. String literals are skipped so `"//"` survives.
function blankComments(text) {
  let out = "";
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    const next = text[i + 1];
    if (c === "/" && next === "/") {
      const end = text.indexOf("\n", i);
      const stop = end === -1 ? text.length : end;
      out += " ".repeat(stop - i);
      i = stop;
    } else if (c === "/" && next === "*") {
      const end = text.indexOf("*/", i + 2);
      const stop = end === -1 ? text.length : end + 2;
      out += text.slice(i, stop).replace(/[^\n]/g, " ");
      i = stop;
    } else if (c === '"' || c === "'" || c === "`") {
      let j = i + 1;
      while (j < text.length && text[j] !== c) j += text[j] === "\\" ? 2 : 1;
      out += text.slice(i, j + 1);
      i = j + 1;
    } else {
      out += c;
      i += 1;
    }
  }
  return out;
}

/** Every relative module specifier in a declaration file, with its offset. */
export function relativeSpecifiers(text) {
  const scan = blankComments(text);
  const found = [];
  for (const match of scan.matchAll(SPECIFIER)) {
    const start = match.index + match[1].length + 1;
    found.push({ specifier: match[3], start, end: start + match[3].length });
  }
  return found;
}

function isFile(path) {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

/**
 * The fully specified form of `specifier` as seen from `fromFile`, or null if
 * no emitted declaration backs it. Already fully specified specifiers are
 * returned as-is when their declaration exists.
 */
export function fullySpecified(fromFile, specifier) {
  const base = resolve(dirname(fromFile), specifier);
  if (FULLY_SPECIFIED.test(specifier)) {
    const stem = base.replace(/\.(m|c)?js$/, "");
    const ext = base.match(/\.(m|c)?js$/)?.[1] ?? "";
    if (specifier.endsWith(".json")) return isFile(base) ? specifier : null;
    return isFile(`${stem}.d.${ext}ts`) ? specifier : null;
  }
  const stem = base.replace(/\.tsx?$/, "");
  const prefix = specifier.replace(/\.tsx?$/, "").replace(/\/$/, "");
  // `.`, `..` and `./dir/` can only name a directory.
  const dirOnly = /(^|\/)\.\.?$|\/$/.test(specifier);
  if (!dirOnly && isFile(`${stem}.d.ts`)) return `${prefix}.js`;
  if (isFile(join(stem, "index.d.ts"))) return `${prefix}/index.js`;
  return null;
}

/** Rewrite one file's specifiers. Returns { changed, unresolved }. */
export function fixFile(file, { write = true } = {}) {
  const text = readFileSync(file, "utf8");
  const unresolved = [];
  let out = "";
  let last = 0;
  let changed = 0;
  for (const { specifier, start, end } of relativeSpecifiers(text)) {
    const fixed = fullySpecified(file, specifier);
    if (fixed === null) {
      unresolved.push(specifier);
      continue;
    }
    if (fixed === specifier) continue;
    out += text.slice(last, start) + fixed;
    last = end;
    changed += 1;
  }
  if (changed && write) writeFileSync(file, out + text.slice(last));
  return { changed, unresolved };
}

function main(dirs) {
  if (dirs.length === 0) {
    console.error("usage: fix-dts-extensions.mjs <declaration-dir>...");
    process.exit(1);
  }
  let failed = false;
  for (const dir of dirs) {
    const files = findDeclarationFiles(resolve(dir));
    if (files.length === 0) {
      console.error(`fix-dts-extensions: no declaration files in ${dir}`);
      failed = true;
      continue;
    }
    let changed = 0;
    for (const file of files) {
      const result = fixFile(file);
      changed += result.changed;
      for (const specifier of result.unresolved) {
        console.error(
          `fix-dts-extensions: ${relative(process.cwd(), file)}: ` +
            `'${specifier}' matches no emitted declaration`,
        );
        failed = true;
      }
    }
    console.log(
      `fix-dts-extensions: ${dir}: ${changed} specifier(s) fully specified ` +
        `in ${files.length} declaration file(s)`,
    );
  }
  if (failed) process.exit(1);
}

// Run as a CLI; scripts/check-dts-resolution.mjs imports the helpers instead.
if (process.argv[1]?.endsWith("fix-dts-extensions.mjs")) {
  main(process.argv.slice(2));
}
