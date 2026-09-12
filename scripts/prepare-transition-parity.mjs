import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const revision = process.argv[2] ?? "origin/latest";
const output = mkdtempSync(path.join(tmpdir(), "ssgoi-transition-parity-"));
const baseline = path.join(output, "baseline");
mkdirSync(baseline);
const archive = execFileSync(
  "git",
  ["archive", revision, "packages/core/src", "packages/core/tsconfig.json"],
  { cwd: root, maxBuffer: 32 * 1024 * 1024 },
);
execFileSync("tar", ["-x", "-C", baseline], { input: archive });
const require = createRequire(path.join(root, "packages/core/package.json"));
const viteRequire = createRequire(require.resolve("vite"));
const { build } = viteRequire("esbuild");
for (const [name, directory] of [
  ["baseline", baseline],
  ["current", root],
]) {
  const core = path.join(directory, "packages/core");
  await build({
    entryPoints: [path.join(core, "src/lib/index.ts")],
    tsconfig: path.join(core, "tsconfig.json"),
    bundle: true,
    format: "iife",
    platform: "browser",
    globalName: name,
    outfile: path.join(output, `${name}.js`),
    logLevel: "silent",
  });
}
copyFileSync(
  path.join(root, "packages/core/tests/transition-parity.html"),
  path.join(output, "index.html"),
);
process.stdout.write(
  JSON.stringify({
    revision,
    directory: output,
    fixture: path.join(output, "index.html"),
  }) + "\n",
);
