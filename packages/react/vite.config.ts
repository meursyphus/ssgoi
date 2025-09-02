import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import preserveDirectives from "rollup-plugin-preserve-directives";

export default defineConfig({
  plugins: [
    react(),
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
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/lib/index.ts"),
        "transitions/index": resolve(__dirname, "src/lib/transitions/index.ts"),
        "view-transitions/index": resolve(
          __dirname,
          "src/lib/view-transitions/index.ts",
        ),
        types: resolve(__dirname, "src/lib/types.ts"),
        "presets/index": resolve(__dirname, "src/lib/presets/index.ts"),
      },
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@ssgoi/core",
        "@ssgoi/core/view-transitions",
        "@ssgoi/core/transitions",
        "@ssgoi/core/presets",
      ],
      output: {
        preserveModules: true,
        exports: "named",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "react/jsx-runtime",
          "@ssgoi/core": "@ssgoi/core",
        },
      },
      plugins: [preserveDirectives()],
    },
  },
});
