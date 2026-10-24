import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [dts({ include: ["src/**/*.ts"], exclude: ["src/**/*.test.ts"] })],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        types: resolve(__dirname, "src/types.ts"),
        "view-transitions": resolve(__dirname, "src/view-transitions.ts"),
      },
      formats: ["es", "cjs"],
      fileName: (format, entry) => `${entry}.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: [/^@ssgoi\/core(?:\/|$)/, "alpinejs"],
      output: { exports: "named" },
    },
  },
});
