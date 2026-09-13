import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: [
          "./tsconfig.app.json",
          "./tsconfig.node.json",
          "./tsconfig.test.json",
        ],
      },
    },
  },
  {
    files: ["src/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{
          group: ["next", "next/*", "react-router", "react-router/*", "@remix-run/*", "@tanstack/react-router", "./routers/*", "./routers/**"],
          message: "Keep router imports in src/routers and expose them only through router subpaths.",
        }],
      }],
    },
  },
]);
