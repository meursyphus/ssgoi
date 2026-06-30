import { defineConfig, type UserConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command, mode }): UserConfig => {
  return {
    plugins: [
      tailwindcss(),
      qwikCity(),
      qwikVite(),
      tsconfigPaths({ root: "." }),
    ],
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
