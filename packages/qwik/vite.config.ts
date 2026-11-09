import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { resolve } from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";
import pkg from "./package.json";

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
        index: resolve(__dirname, "src/lib/index.ts"),
        types: resolve(__dirname, "src/lib/types.ts"),
        "view-transitions": resolve(__dirname, "src/lib/view-transitions.ts"),
      },
      formats: ["es", "cjs"],
      fileName: (format, entryName) =>
        `${entryName}.qwik.${format === "es" ? "mjs" : "cjs"}`,
    },
    rollupOptions: {
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
  plugins: [qwikVite(), tsconfigPaths({ root: "." })],
});
