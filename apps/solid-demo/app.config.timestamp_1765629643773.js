// app.config.ts
import { defineConfig } from "@solidjs/start/config";
import { resolve } from "path";
var app_config_default = defineConfig({
  ssr: true,
  server: {
    preset: "node-server",
  },
  vite: {
    resolve: {
      alias: {
        // Shim for solid-js 1.x compatibility with vite-plugin-solid 2.10+
        // The compiled code imports 'use' from solid-js/web which doesn't exist in 1.x
        "solid-js/web": resolve(__dirname, "src/solid-web-shim.ts"),
      },
    },
  },
});
export { app_config_default as default };
