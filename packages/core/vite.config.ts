import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/lib/index.ts"),
        internal: resolve(__dirname, "src/lib/internal.ts"),
        types: resolve(__dirname, "src/lib/types.ts"),
      },
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      output: {
        preserveModules: false,
        exports: "named",
      },
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      outDir: "dist",
      include: ["src/lib/**/*"],
      beforeWriteFile: (filePath, content) => ({
        filePath: filePath.replace("/src/lib", ""),
        content,
      }),
    }),
  ],
});
