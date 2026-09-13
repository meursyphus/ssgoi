import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { environment: "jsdom", include: ["tests/**/*.test.ts"] },
  esbuild: {
    tsconfigRaw: { compilerOptions: { experimentalDecorators: true } },
  },
});
