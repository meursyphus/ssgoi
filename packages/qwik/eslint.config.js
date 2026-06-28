import js from "@eslint/js";
import globals from "globals";
import { qwikEslint9Plugin } from "eslint-plugin-qwik";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["lib", "lib-types"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  qwikEslint9Plugin.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "qwik/no-use-visible-task": "off",
    },
  },
);
