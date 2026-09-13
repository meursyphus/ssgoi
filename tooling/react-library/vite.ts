import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import preserveDirectives from "rollup-plugin-preserve-directives";
import { isAbsolute, resolve } from "node:path";

/** Keep adapters thin: all package imports, including the platform, stay external. */
export function reactAdapterConfig() {
  const entries = [
    "index",
    "types",
    "view-transitions",
    "unplugin/index",
    "unplugin/webpack",
    "unplugin/vite",
    "unplugin/rollup",
    "unplugin/esbuild",
  ];
  return defineConfig({
    esbuild: { jsx: "automatic" },
    plugins: [dts({ include: ["src"], tsconfigPath: "./tsconfig.json" })],
    build: {
      lib: {
        entry: Object.fromEntries(
          entries.map((entry) => [entry, resolve("src", `${entry}.ts`)]),
        ),
        formats: ["es", "cjs"],
        fileName: (format, entry) =>
          `${entry}.${format === "es" ? "js" : "cjs"}`,
      },
      rollupOptions: {
        external: (id) =>
          !id.startsWith(".") && !isAbsolute(id) && !id.startsWith("\0"),
        output: { preserveModules: true, exports: "named", interop: "auto" },
        plugins: [preserveDirectives()],
      },
    },
  });
}
