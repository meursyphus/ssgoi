import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import angular from '@angular-eslint/eslint-plugin';
import angularTemplate from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', '*.js', '*.mjs']
  },
  // TypeScript files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: ['./tsconfig.lib.json'],
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 2022,
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      '@angular-eslint': angular
    },
    rules: {
      // TypeScript recommended rules
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // Angular recommended rules
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: ['ssgoi', 'transition'],
          style: 'camelCase'
        }
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'ssgoi',
          style: 'kebab-case'
        }
      ],
      '@angular-eslint/no-input-rename': 'error',
      '@angular-eslint/no-output-rename': 'error',
      '@angular-eslint/use-lifecycle-interface': 'error',
      '@angular-eslint/use-pipe-transform-interface': 'error'
    }
  },
  // Exception for ssgoi.component.ts - single word selector is allowed
  {
    files: ['**/ssgoi.component.ts'],
    rules: {
      '@angular-eslint/component-selector': 'off'
    }
  },
  // HTML template files
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: angularTemplateParser
    },
    plugins: {
      '@angular-eslint/template': angularTemplate
    },
    rules: {
      '@angular-eslint/template/no-negated-async': 'error',
      '@angular-eslint/template/eqeqeq': 'error',
      '@angular-eslint/template/no-any': 'warn'
    }
  }
];
