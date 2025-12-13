import { defineConfig } from "@solidjs/start/config";
import type { Plugin } from "vite";

// Plugin to add 'use' export to solid-js/web for Solid 1.x compatibility
// vite-plugin-solid 2.10+ generates code that uses 'use' but solid-js 1.x doesn't export it
function solidWebUseShim(): Plugin {
  return {
    name: "solid-web-use-shim",
    transform(code, id) {
      // Only transform solid-js/web module
      if (id.includes("solid-js") && id.includes("web") && id.endsWith(".js")) {
        // Check if 'use' is already exported
        if (
          !code.includes("export") ||
          code.includes("export { use }") ||
          code.includes("export function use")
        ) {
          return null;
        }
        // Add 'use' function at the end of the module
        const useShim = `
// Shim for solid-js 1.x compatibility with vite-plugin-solid 2.10+
export function use(fn, el) {
  if (typeof fn === "function") {
    fn(el);
  }
}
`;
        return code + useShim;
      }
      return null;
    },
  };
}

export default defineConfig({
  ssr: false,
  server: {
    preset: "static",
  },
  vite: {
    plugins: [solidWebUseShim()],
  },
});
