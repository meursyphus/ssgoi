import { R as Root } from './types/wasm-dynamic.mjs';
export { g as getWasmInlined } from './types/wasm-dynamic.mjs';
import * as _shikijs_core from '@shikijs/core';
import { HighlighterGeneric, CreateHighlighterFactory } from '@shikijs/core';
export * from '@shikijs/core';
import { BundledLanguage } from './langs.mjs';
export { bundledLanguages, bundledLanguagesAlias, bundledLanguagesBase, bundledLanguagesInfo } from './langs.mjs';
import { BundledTheme } from './themes.mjs';
export { bundledThemes, bundledThemesInfo } from './themes.mjs';
export { CssVariablesThemeOptions, createCssVariablesTheme } from './theme-css-variables.mjs';
import '@shikijs/core/types';

type Highlighter = HighlighterGeneric<BundledLanguage, BundledTheme>;
/**
 * Initiate a highlighter instance and load the specified languages and themes.
 * Later it can be used synchronously to highlight code.
 *
 * Importing this function will bundle all languages and themes.
 * @see https://shiki.style/guide/bundles#shiki-bundle-full
 *
 * For granular control over the bundle, check:
 * @see https://shiki.style/guide/install#fine-grained-bundle
 */
declare const createHighlighter: CreateHighlighterFactory<BundledLanguage, BundledTheme>;
declare const codeToHtml: (code: string, options: _shikijs_core.CodeToHastOptions<BundledLanguage, BundledTheme>) => Promise<string>;
declare const codeToHast: (code: string, options: _shikijs_core.CodeToHastOptions<BundledLanguage, BundledTheme>) => Promise<Root>;
declare const codeToTokens: (code: string, options: _shikijs_core.CodeToTokensOptions<BundledLanguage, BundledTheme>) => Promise<_shikijs_core.TokensResult>;
declare const codeToTokensBase: (code: string, options: _shikijs_core.RequireKeys<_shikijs_core.CodeToTokensBaseOptions<BundledLanguage, BundledTheme>, "theme" | "lang">) => Promise<_shikijs_core.ThemedToken[][]>;
declare const codeToTokensWithThemes: (code: string, options: _shikijs_core.RequireKeys<_shikijs_core.CodeToTokensWithThemesOptions<BundledLanguage, BundledTheme>, "lang" | "themes">) => Promise<_shikijs_core.ThemedTokenWithVariants[][]>;
declare const getSingletonHighlighter: (options?: Partial<_shikijs_core.BundledHighlighterOptions<BundledLanguage, BundledTheme>> | undefined) => Promise<HighlighterGeneric<BundledLanguage, BundledTheme>>;
declare const getLastGrammarState: (code: string, options: _shikijs_core.CodeToTokensBaseOptions<BundledLanguage, BundledTheme>) => Promise<_shikijs_core.GrammarState>;
/**
 * @deprecated Use `createHighlighter` or `getSingletonHighlighter` instead.
 */
declare const getHighlighter: CreateHighlighterFactory<BundledLanguage, BundledTheme>;

export { BundledLanguage, BundledTheme, type Highlighter, codeToHast, codeToHtml, codeToTokens, codeToTokensBase, codeToTokensWithThemes, createHighlighter, getHighlighter, getLastGrammarState, getSingletonHighlighter };
