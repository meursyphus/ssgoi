import { defineConfig } from "vite";
import { qwikVite } from "@qwik.dev/core/optimizer";
import { resolve } from "node:path";
import pkg from "./package.json" with { type: "json" };

type DependencyMap = Record<string, string>;
const { dependencies = {}, peerDependencies = {} } = pkg as {
  dependencies?: DependencyMap;
  peerDependencies?: DependencyMap;
};

const makeExternalPattern = (dep: string) => new RegExp(`^${dep}(/.*)?$`);
const externalize = (deps: DependencyMap) =>
  Object.keys(deps).map(makeExternalPattern);

export default defineConfig({
  build: {
    target: "es2020",
    lib: {
      entry: {
        index: resolve(import.meta.dirname, "src/lib/index.ts"),
        "qwik-city": resolve(
          import.meta.dirname,
          "src/lib/routers/qwik-city.ts",
        ),
        "qwik-router": resolve(
          import.meta.dirname,
          "src/lib/routers/qwik-router.ts",
        ),
        types: resolve(import.meta.dirname, "src/lib/types.ts"),
        "view-transitions": resolve(
          import.meta.dirname,
          "src/lib/view-transitions.ts",
        ),
      },
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.qwik.mjs`,
    },
    rolldownOptions: {
      output: {
        preserveModules: true,
        preserveModulesRoot: "src/lib",
      },
      external: [
        /^node:.*/,
        ...externalize(dependencies),
        ...externalize(peerDependencies),
      ],
    },
  },
  plugins: [qwikVite()],
});
