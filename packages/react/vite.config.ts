import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import preserveDirectives from "rollup-plugin-preserve-directives";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      outDir: "dist",
      include: ["src/**/*"],
      entryRoot: "src",
      exclude: ["src/vite-env.d.ts"],
      tsconfigPath: "./tsconfig.app.json",
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        nextjs: resolve(__dirname, "src/routers/nextjs/index.ts"),
        "react-router": resolve(__dirname, "src/routers/react-router.tsx"),
        "tanstack-router": resolve(
          __dirname,
          "src/routers/tanstack-router.tsx",
        ),
        remix: resolve(__dirname, "src/routers/remix.tsx"),
        types: resolve(__dirname, "src/types.ts"),
        "view-transitions": resolve(__dirname, "src/view-transitions.ts"),
        "unplugin/index": resolve(__dirname, "src/unplugin/index.ts"),
        "unplugin/webpack": resolve(__dirname, "src/unplugin/webpack.ts"),
        "unplugin/vite": resolve(__dirname, "src/unplugin/vite.ts"),
        "unplugin/rollup": resolve(__dirname, "src/unplugin/rollup.ts"),
        "unplugin/esbuild": resolve(__dirname, "src/unplugin/esbuild.ts"),
      },
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        /^@remix-run\/react(?:\/|$)/,
        /^next(?:\/|$)/,
        /^react-router(?:\/|$)/,
        /^@tanstack\/react-router(?:\/|$)/,
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@ssgoi/core",
        "@ssgoi/core/internal",
        "@ssgoi/core/types",
        "unplugin",
        "@babel/core",
      ],
      output: {
        preserveModules: true,
        exports: "named",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "react/jsx-runtime",
          "@ssgoi/core": "@ssgoi/core",
        },
      },
      plugins: [preserveDirectives() as PluginOption],
    },
  },
});
