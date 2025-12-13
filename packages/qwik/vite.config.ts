import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { resolve } from "path";
import pkg from "./package.json";

const { dependencies = {}, peerDependencies = {} } = pkg as Record<
  string,
  Record<string, string>
>;
const makeRegex = (dep: string) => new RegExp(`^${dep}(/.*)?$`);
const excludeAll = (obj: Record<string, string>) =>
  Object.keys(obj).map(makeRegex);

export default defineConfig(() => {
  return {
    build: {
      target: "es2020",
      lib: {
        entry: {
          index: resolve(__dirname, "src/lib/index.ts"),
          "transitions/index": resolve(
            __dirname,
            "src/lib/transitions/index.ts",
          ),
          "view-transitions/index": resolve(
            __dirname,
            "src/lib/view-transitions/index.ts",
          ),
          types: resolve(__dirname, "src/lib/types.ts"),
          "presets/index": resolve(__dirname, "src/lib/presets/index.ts"),
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
          ...excludeAll(dependencies),
          ...excludeAll(peerDependencies),
        ],
      },
    },
    plugins: [qwikVite()],
  };
});
