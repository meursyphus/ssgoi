import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [svelte({ configFile: false })],
  resolve: {
    conditions: ["browser"],
    alias: {
      "$app/navigation": fileURLToPath(
        new URL("./tests/navigation.ts", import.meta.url),
      ),
      "$app/stores": fileURLToPath(
        new URL("./tests/navigation.ts", import.meta.url),
      ),
    },
  },
  test: { environment: "jsdom", include: ["tests/**/*.test.ts"] },
});
