import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [dts({ include: ["src/**/*.ts"], exclude: ["src/**/*.test.ts"] })],
  build: {
    lib: {
      entry: Object.fromEntries(
        ["index", "types", "router", "view-transitions"].map((entry) => [
          entry,
          resolve(__dirname, `src/${entry}.ts`),
        ]),
      ),
      formats: ["es", "cjs"],
      fileName: (format, entry) => `${entry}.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: [/^@ssgoi\/core(?:\/|$)/, "mithril"],
      output: { exports: "named" },
    },
  },
});
