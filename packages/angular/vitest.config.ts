import { fileURLToPath } from "node:url";
import { constructorParametersDownlevelTransform } from "@angular/compiler-cli/private/tooling";
import ts from "typescript";
import { defineConfig, type Plugin } from "vitest/config";

const compilerOptions: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ES2022,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  experimentalDecorators: true,
  useDefineForClassFields: false,
  skipLibCheck: true,
  inlineSourceMap: true,
  inlineSources: true,
};

// JIT has no metadata for signal inputs; apply the transform the Angular CLI
// uses for JIT tests so `input()` bindings like `[ssgoiFramework]` resolve.
function angularJit(): Plugin {
  let program: ts.Program | undefined;
  return {
    name: "ssgoi-angular-jit",
    enforce: "pre",
    transform(_code, id) {
      if (!id.endsWith(".ts") || id.includes("/node_modules/")) return;
      program = ts.createProgram({
        rootNames: [id],
        options: compilerOptions,
        oldProgram: program,
      });
      let code = "";
      program.emit(
        program.getSourceFile(id),
        (_name, text) => (code = text),
        undefined,
        false,
        { before: [constructorParametersDownlevelTransform(program)] },
      );
      if (!code)
        throw new Error(`Angular JIT transform emitted nothing for ${id}`);
      return { code, map: null };
    },
  };
}

export default defineConfig({
  plugins: [angularJit()],
  resolve: {
    alias: [
      {
        find: /^@ssgoi\/angular$/,
        replacement: fileURLToPath(
          new URL("./src/public-api.ts", import.meta.url),
        ),
      },
    ],
  },
  test: { environment: "jsdom", include: ["tests/**/*.test.ts"] },
});
