import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { environment: "jsdom", include: ["tests/**/*.test.tsx"] },
  esbuild: { jsx: "automatic", jsxImportSource: "preact" },
  // Resolve the same browser build for the renderer, hooks, and test-utils.
  resolve: { conditions: ["browser"] },
});
