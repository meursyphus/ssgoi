import { defineConfig } from "vite";
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
    }) as any,
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/lib/index.ts"),
        types: resolve(__dirname, "src/lib/types.ts"),
      },
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "vue",
        "@ssgoi/core",
        "@ssgoi/core/internal",
      ],
      output: {
        preserveModules: true,
        exports: "named",
        globals: {
          vue: "Vue",
          "@ssgoi/core": "@ssgoi/core",
        },
      },
      plugins: [preserveDirectives()],
    },
  },
});
