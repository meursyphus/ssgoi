import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const core = fileURLToPath(
  new URL("../../../../../packages/core/", import.meta.url),
);
const require = createRequire(path.join(core, "package.json"));
const ts = require("typescript");
const config = ts.readConfigFile(
  path.join(core, "tsconfig.json"),
  ts.sys.readFile,
);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, core);
parsed.options.paths["@ssgoi/core"] = [path.join(core, "src/lib/index.ts")];
const program = ts.createProgram(process.argv.slice(2), parsed.options);
const diagnostics = ts.getPreEmitDiagnostics(program);
if (diagnostics.length) {
  process.stderr.write(
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: (p) => p,
      getCurrentDirectory: () => core,
      getNewLine: () => "\n",
    }),
  );
  process.exit(1);
}
process.stdout.write(
  "Generated motion code typechecks against current SSGOI.\n",
);
