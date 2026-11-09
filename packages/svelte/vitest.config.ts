import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte({ configFile: false })],
  resolve: {
    conditions: ["browser"],
  },
  test: { environment: "jsdom", include: ["tests/**/*.test.ts"] },
});
