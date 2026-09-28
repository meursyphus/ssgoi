// Collects the headings of every static docs page for the site search.
//
// Docs headings are string literals in JSX (<Section title="Path patterns">),
// so this walks the TypeScript AST of src/app/docs/**/page.tsx, follows JSX
// tags into same-file components and @/page/docs/* imports, and records each
// literal Section/Step title (plus an explicit id when one is given). Anchors
// are derived at runtime by src/lib/slug.ts, so only raw titles are emitted.
//
// Output: src/lib/search/docs-headings.generated.json (gitignored).
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docsDir = path.join(appDir, "src/app/docs");
const outputFile = path.join(
  appDir,
  "src/lib/search/docs-headings.generated.json",
);
const ts = createRequire(path.join(appDir, "package.json"))("typescript");

const HEADING_TAGS = new Map([
  ["Section", 2],
  ["Step", 3],
]);
const files = new Map();
const warnings = [];

/** "@/page/docs/x" → the .tsx/.ts file or folder index it names, if any. */
function resolveModule(spec) {
  const base = path.join(appDir, "src", spec.slice(2));
  const candidates = [".tsx", ".ts", "/index.tsx", "/index.ts"].map(
    (ext) => base + ext,
  );
  return candidates.find((file) => existsSync(file));
}

function parse(file) {
  if (files.has(file)) return files.get(file);
  const sf = ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const decls = new Map();
  const consts = new Map();
  const imports = new Map();
  for (const st of sf.statements) {
    if (ts.isFunctionDeclaration(st) && st.name) decls.set(st.name.text, st);
    if (ts.isVariableStatement(st)) {
      for (const d of st.declarationList.declarations) {
        if (ts.isIdentifier(d.name) && d.initializer)
          consts.set(d.name.text, d.initializer);
      }
    }
    const bindings = ts.isImportDeclaration(st)
      ? st.importClause?.namedBindings
      : undefined;
    if (bindings && ts.isNamedImports(bindings)) {
      const spec = st.moduleSpecifier.text;
      if (!spec.startsWith("@/page/docs/")) continue;
      const target = resolveModule(spec);
      if (!target) continue;
      for (const el of bindings.elements) {
        imports.set(el.name.text, {
          file: target,
          name: (el.propertyName ?? el.name).text,
        });
      }
    }
  }
  const entry = { sf, decls, consts, imports };
  files.set(file, entry);
  return entry;
}

function unwrap(node) {
  while (
    node &&
    (ts.isAsExpression(node) ||
      ts.isSatisfiesExpression?.(node) ||
      ts.isParenthesizedExpression(node))
  )
    node = node.expression;
  return node;
}

function literal(node) {
  node = unwrap(node);
  if (!node) return undefined;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
    return node.text;
  return undefined;
}

/**
 * `title={check.title}` inside `LIST.map((check) => …)`, where LIST is a
 * same-file array of object literals: every element's literal `title`.
 */
function mappedLiterals(expr, file) {
  if (!ts.isPropertyAccessExpression(expr) || !ts.isIdentifier(expr.expression))
    return null;
  const param = expr.expression.text;
  const prop = expr.name.text;
  for (let n = expr.parent; n; n = n.parent) {
    if (!ts.isArrowFunction(n) && !ts.isFunctionExpression(n)) continue;
    const first = n.parameters[0];
    if (!first || !ts.isIdentifier(first.name) || first.name.text !== param)
      continue;
    const call = n.parent;
    if (
      !ts.isCallExpression(call) ||
      !ts.isPropertyAccessExpression(call.expression) ||
      call.expression.name.text !== "map" ||
      !ts.isIdentifier(call.expression.expression)
    )
      return null;
    const list = unwrap(
      parse(file).consts.get(call.expression.expression.text),
    );
    if (!list || !ts.isArrayLiteralExpression(list)) return null;
    const out = [];
    for (const el of list.elements) {
      const obj = unwrap(el);
      if (!ts.isObjectLiteralExpression(obj)) return null;
      const p = obj.properties.find(
        (x) => ts.isPropertyAssignment(x) && x.name.getText() === prop,
      );
      const value = p && literal(p.initializer);
      if (value === undefined) return null;
      out.push(value);
    }
    return out;
  }
  return null;
}

/** Literal attribute value(s): string[] when resolvable, null when dynamic. */
function attr(el, name, file) {
  for (const p of el.attributes.properties) {
    if (!ts.isJsxAttribute(p) || p.name.getText() !== name) continue;
    if (!p.initializer) return null;
    if (ts.isStringLiteral(p.initializer)) return [p.initializer.text];
    if (ts.isJsxExpression(p.initializer) && p.initializer.expression) {
      const value = literal(p.initializer.expression);
      if (value !== undefined) return [value];
      return mappedLiterals(p.initializer.expression, file);
    }
    return null;
  }
  return undefined;
}

function collect(node, file, out, seen) {
  const { decls, imports } = parse(file);
  const visit = (n) => {
    if (ts.isJsxOpeningElement(n) || ts.isJsxSelfClosingElement(n)) {
      const tag = n.tagName.getText();
      if (HEADING_TAGS.has(tag)) {
        const titles = attr(n, "title", file);
        const ids = attr(n, "id", file);
        if (titles) {
          titles.forEach((title, i) => {
            const id = ids?.length === titles.length ? ids[i] : undefined;
            out.push({
              level: HEADING_TAGS.get(tag),
              title,
              ...(id && { id }),
            });
          });
        } else {
          const { line } = ts.getLineAndCharacterOfPosition(
            n.getSourceFile(),
            n.getStart(),
          );
          warnings.push(
            `dynamic <${tag} title> skipped: ${path.relative(appDir, file)}:${line + 1}`,
          );
        }
      } else if (decls.has(tag) && !seen.has(`${file}#${tag}`)) {
        seen.add(`${file}#${tag}`);
        collect(decls.get(tag), file, out, seen);
      } else if (imports.has(tag)) {
        const { file: target, name } = imports.get(tag);
        const key = `${target}#${name}`;
        if (!seen.has(key)) {
          seen.add(key);
          const decl = parse(target).decls.get(name);
          if (decl) collect(decl, target, out, seen);
        }
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(node);
}

function metadata(sf) {
  const meta = {};
  const visit = (n) => {
    if (
      ts.isVariableDeclaration(n) &&
      n.name.getText() === "metadata" &&
      n.initializer &&
      ts.isObjectLiteralExpression(n.initializer)
    ) {
      for (const p of n.initializer.properties) {
        if (!ts.isPropertyAssignment(p)) continue;
        const key = p.name.getText();
        const value = literal(p.initializer);
        if ((key === "title" || key === "description") && value)
          meta[key] = value;
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return meta;
}

function pages(dir) {
  const out = [];
  for (const entry of readdirSync(dir).sort()) {
    const p = path.join(dir, entry);
    if (statSync(p).isDirectory()) {
      // Dynamic routes (transitions, frameworks) are indexed from their data.
      if (!entry.startsWith("[")) out.push(...pages(p));
    } else if (entry === "page.tsx") out.push(p);
  }
  return out;
}

const result = {};
let count = 0;
for (const file of pages(docsDir)) {
  const route = `/${path.relative(path.join(appDir, "src/app"), path.dirname(file)).split(path.sep).join("/")}`;
  const { sf } = parse(file);
  const page = sf.statements.find(
    (s) =>
      ts.isFunctionDeclaration(s) &&
      s.modifiers?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword),
  );
  const headings = [];
  if (page) collect(page, file, headings, new Set());
  else
    warnings.push(
      `no \`export default function\` in ${route}: headings skipped`,
    );
  const seenIds = new Map();
  for (const h of headings) {
    const key = h.id ?? h.title.toLowerCase();
    if (seenIds.has(key))
      warnings.push(`duplicate heading "${h.title}" on ${route}`);
    seenIds.set(key, true);
  }
  count += headings.length;
  result[route] = { ...metadata(sf), headings };
}

await mkdir(path.dirname(outputFile), { recursive: true });
await writeFile(outputFile, `${JSON.stringify(result, null, 1)}\n`);
for (const w of warnings) console.warn(`[search-headings] ${w}`);
console.log(
  `Generated ${path.relative(appDir, outputFile)} (${Object.keys(result).length} pages, ${count} headings)`,
);
