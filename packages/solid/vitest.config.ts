import { defineConfig } from "vitest/config";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  test: { environment: "jsdom", include: ["tests/**/*.test.tsx"] },
});
