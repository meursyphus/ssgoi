import { defineConfig, type UserConfig } from "vite";
import { qwikVite } from "@qwik.dev/core/optimizer";
import { qwikRouter } from "@qwik.dev/router/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command, mode }): UserConfig => {
  return {
    plugins: [tailwindcss(), qwikRouter(), qwikVite()],
    resolve: { tsconfigPaths: true },
    optimizeDeps: {
      exclude: [],
    },
    server: {
      headers: {
        "Cache-Control": "public, max-age=0",
      },
    },
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
    ssr:
      command === "build" && mode === "production"
        ? {
            noExternal: ["@ssgoi/qwik", "@ssgoi/core"],
          }
        : undefined,
  };
});
