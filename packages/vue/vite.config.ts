import { defineConfig, type PluginOption } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import preserveDirectives from "rollup-plugin-preserve-directives";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      outDir: "dist",
      include: ["src/lib/**/*"],
      exclude: ["src/vite-env.d.ts"],
      tsconfigPath: "./tsconfig.app.json",
      beforeWriteFile: (filePath, content) => ({
        filePath: filePath.replace("/src/lib", ""),
        content,
      }),
    }) as PluginOption,
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/lib/index.ts"),
        types: resolve(__dirname, "src/lib/types.ts"),
        "view-transitions": resolve(__dirname, "src/lib/view-transitions.ts"),
      },
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "vue",
        "@ssgoi/core",
        "@ssgoi/core/internal",
        "@ssgoi/core/types",
      ],
      output: {
        preserveModules: true,
        exports: "named",
        globals: {
          vue: "Vue",
          "@ssgoi/core": "@ssgoi/core",
        },
      },
      // Cast away a rollup version skew: preserve-directives is typed against a
      // newer rollup than the one vite resolves, so its Plugin<any> isn't
      // structurally assignable to InputPluginOption (e.g. ModuleInfo gained
      // `safeVariableNames`). Runtime is unaffected.
      plugins: [preserveDirectives() as PluginOption],
    },
  },
});
