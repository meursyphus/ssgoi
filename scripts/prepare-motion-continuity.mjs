import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const output = mkdtempSync(path.join(tmpdir(), "ssgoi-motion-continuity-"));
const core = path.join(root, "packages/core");
const require = createRequire(path.join(core, "package.json"));
const viteRequire = createRequire(require.resolve("vite"));
const { build } = viteRequire("esbuild");
await build({
  stdin: {
    contents:
      'export * from "./src/lib/index.ts"; export {HostAnimation} from "./src/lib/animation/host-animation.ts"; export {createSggoiTransitionContext} from "./src/lib/ssgoi-transition/create-ssgoi-transition-context.ts";',
    resolveDir: core,
  },
  tsconfig: path.join(core, "tsconfig.json"),
  bundle: true,
  format: "iife",
  platform: "browser",
  globalName: "continuity",
  outfile: path.join(output, "engine.js"),
  logLevel: "silent",
});
const html = readFileSync(
  path.join(core, "tests/browser/motion-continuity.html"),
  "utf8",
)
  .replace(
    '<script type="module">',
    '<script src="engine.js"></script><script>',
  )
  .replace(
    /import \* as effects from ["']\/src\/lib\/index\.ts["'];/,
    "const effects=continuity;",
  )
  .replace(
    /import \{\s*HostAnimation\s*\} from ["']\/src\/lib\/animation\/host-animation\.ts["'];/,
    "const {HostAnimation}=continuity;",
  );
writeFileSync(path.join(output, "index.html"), html);
process.stdout.write(
  JSON.stringify({
    directory: output,
    fixture: path.join(output, "index.html"),
  }) + "\n",
);
