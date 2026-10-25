import { defineConfig } from "vite";
import { resolve } from "node:path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts({ entryRoot: "src", include: ["src/**/*.ts"] })],
  build: {
    target: "es2022",
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        types: resolve(__dirname, "src/types.ts"),
        "view-transitions": resolve(__dirname, "src/view-transitions.ts"),
      },
      formats: ["es"],
      fileName: (_format, name) => `${name}.js`,
    },
    rollupOptions: {
      external: [/^lit(?:\/|$)/, /^@ssgoi\/core(?:\/|$)/],
      output: { preserveModules: true, preserveModulesRoot: "src" },
    },
  },
});
