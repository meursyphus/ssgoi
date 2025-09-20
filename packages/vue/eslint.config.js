import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    files: ["**/*.ts", "**/*.vue"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...pluginVue.configs["flat/recommended"],
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: './tsconfig.json',
        parser: tseslint.parser,
        ecmaVersion: 2020,
        sourceType: "module",
        extraFileExtensions: [".vue"],
      },
    },
    rules: {
      // Vue 3 specific rules
      "vue/multi-word-component-names": "off", // Allow single-word component names
    },
  },
);