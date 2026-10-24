import { defineConfig } from "vite";
import { resolve } from "node:path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts({ include: ["src/**/*"], entryRoot: "src", outDir: "dist" })],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        types: resolve(__dirname, "src/types.ts"),
        "view-transitions": resolve(__dirname, "src/view-transitions.ts"),
      },
      formats: ["es", "cjs"],
      fileName: (format, name) => `${name}.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: [/^preact(?:\/|$)/, /^@ssgoi\/core(?:\/|$)/],
      output: { exports: "named" },
    },
  },
});
