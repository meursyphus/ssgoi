import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// The monorepo hoists react-router-dom@6 (a dependency of @remix-run/react).
// The React Router plugin pre-bundles react-router-dom whenever it can resolve
// it, and that v6 build fails against react-router@7. This template never
// imports react-router-dom, so drop it after the plugin adds it.
const skipHoistedReactRouterDom: Plugin = {
  name: "ssgoi-template:skip-hoisted-react-router-dom",
  enforce: "post",
  config(config) {
    const optimizeDeps = config.optimizeDeps;
    if (optimizeDeps?.include) {
      optimizeDeps.include = optimizeDeps.include.filter(
        (id) => id !== "react-router-dom",
      );
    }
  },
};

export default defineConfig({
  resolve: { dedupe: ["react", "react-dom"] },
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    skipHoistedReactRouterDom,
  ],
});
