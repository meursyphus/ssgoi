import { readFileSync, mkdtempSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const core = path.join(root, "packages/core");
const require = createRequire(path.join(core, "package.json"));
const ts = require("typescript");
const source = readFileSync(
  path.join(root, "apps/docs/src/page/docs/motion-examples.ts"),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const examples = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);
const directory = mkdtempSync(
  path.join(tmpdir(), "ssgoi-transition-examples-"),
);
const entries = [
  ["override.ts", examples.OVERRIDE_EXAMPLE],
  ["custom-transition.ts", examples.CUSTOM_TRANSITION_EXAMPLE],
  ["custom-override.ts", examples.CUSTOM_OVERRIDE_EXAMPLE],
  ["custom-integrator.ts", examples.CUSTOM_INTEGRATOR_EXAMPLE],
];
for (const [name, code] of entries)
  writeFileSync(path.join(directory, name), code);
const config = ts.readConfigFile(
  path.join(core, "tsconfig.json"),
  ts.sys.readFile,
);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, core);
parsed.options.paths["@ssgoi/core"] = [path.join(core, "src/lib/index.ts")];
const program = ts.createProgram(
  entries.map(([name]) => path.join(directory, name)),
  parsed.options,
);
const diagnostics = ts.getPreEmitDiagnostics(program);
if (diagnostics.length) {
  process.stderr.write(
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: (p) => p,
      getCurrentDirectory: () => core,
      getNewLine: () => "\n",
    }),
  );
  process.exitCode = 1;
} else {
  process.stdout.write(
    `Typechecked ${entries.length} public documentation examples.\n`,
  );
}
