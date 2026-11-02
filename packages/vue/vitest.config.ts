import { defineConfig, type ViteUserConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  // vitest resolves its own vite; the plugin is typed against this package's.
  plugins: [vue()] as ViteUserConfig["plugins"],
  test: { environment: "jsdom", include: ["tests/**/*.test.ts"] },
});
