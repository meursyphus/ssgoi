import { defineConfig } from "vitest/config";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { resolve } from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";

const cityVirtual = resolve(__dirname, "tests/qwik-city-virtual.ts");

export default defineConfig({
  plugins: [qwikVite(), tsconfigPaths({ root: "." })],
  resolve: {
    alias: {
      "@qwik-city-plan": cityVirtual,
      "@qwik-city-sw-register": cityVirtual,
    },
  },
  test: { include: ["tests/**/*.test.tsx"] },
});
