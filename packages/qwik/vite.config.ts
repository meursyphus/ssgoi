import { defineConfig } from "vite";
import pkg from "./package.json";
import { qwikVite } from "@builder.io/qwik/optimizer";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";

const { dependencies = {}, peerDependencies = {} } = pkg as any;
const makeRegex = (dep) => new RegExp(`^${dep}(/.*)?$`);
const excludeAll = (obj) => Object.keys(obj).map(makeRegex);

export default defineConfig(({ mode }) => {
  if (mode === "lib") {
    // Library build mode with Qwik optimizer
    return {
      build: {
        target: "es2020",
        outDir: "dist",
        lib: {
          entry: {
            index: "./src/lib/index.ts",
            "transitions/index": "./src/lib/transitions/index.ts",
            "view-transitions/index": "./src/lib/view-transitions/index.ts",
            "presets/index": "./src/lib/presets/index.ts",
            types: "./src/lib/types.ts",
          },
          formats: ["es", "cjs"],
          fileName: (format, entryName) => {
            // Use .qwik.mjs for ES modules to enable Qwik optimizer
            if (format === "es") return `${entryName}.qwik.mjs`;
            return `${entryName}.cjs`;
          },
        },
        rollupOptions: {
          output: {
            preserveModules: false,
            chunkFileNames: "[name]-[hash].qwik.mjs",
          },
          // externalize deps that shouldn't be bundled into the library
          external: [
            /^node:.*/,
            ...excludeAll(dependencies),
            ...excludeAll(peerDependencies),
          ],
        },
      },
      plugins: [
        qwikVite({
          srcDir: "./src/lib",
          entryStrategy: {
            type: "smart",
          },
          optimizerOptions: {},
        }),
        tsconfigPaths({ root: "." }),
        dts({
          insertTypesEntry: true,
          outDir: "dist",
          include: ["src/lib/**/*"],
          tsconfigPath: "./tsconfig.json",
          beforeWriteFile: (filePath, content) => ({
            filePath: filePath.replace("/src/lib", ""),
            content,
          }),
        }),
      ],
    };
  }

  // Default mode for qwik build
  return {
    build: {
      target: "es2020",
      outDir: "dist",
      lib: {
        entry: "./src/lib/index.ts",
        formats: ["es", "cjs"],
        fileName: (format) => {
          if (format === "es") return "index.qwik.mjs";
          return "index.cjs";
        },
      },
      rollupOptions: {
        // externalize deps that shouldn't be bundled into the library
        external: [
          /^node:.*/,
          ...excludeAll(dependencies),
          ...excludeAll(peerDependencies),
        ],
      },
    },
    plugins: [
      qwikVite({
        srcDir: "./src/lib",
        entryStrategy: {
          type: "smart",
        },
      }),
      tsconfigPaths({ root: "." }),
    ],
  };
});
