import { Root } from 'hast';
import { c as IGrammar, h as ThemeInput, q as SpecialTheme, L as LanguageInput, p as SpecialLanguage, r as ThemeRegistrationAny, v as ThemeRegistrationResolved, E as LanguageRegistration, C as CodeToHastOptions, D as ResolveBundleKey, i as CodeToTokensOptions, j as TokensResult, l as CodeToTokensBaseOptions, m as ThemedToken, n as CodeToTokensWithThemesOptions, o as ThemedTokenWithVariants, G as GrammarState } from './chunk-tokens.mjs';
export { A as AnsiLanguage, a5 as Awaitable, B as BundledHighlighterOptions, J as BundledLanguageInfo, _ as BundledThemeInfo, V as CodeOptionsMeta, O as CodeOptionsMultipleThemes, N as CodeOptionsSingleTheme, Q as CodeOptionsThemes, U as CodeToHastOptionsCommon, x as CodeToHastRenderOptions, W as CodeToHastRenderOptionsCommon, aa as DecorationItem, a9 as DecorationOptions, ac as DecorationTransformType, K as DynamicImportLanguageRegistration, Z as DynamicImportThemeRegistration, F as FontStyle, H as HighlighterCoreOptions, M as MaybeArray, a6 as MaybeGetter, a7 as MaybeModule, ad as Offset, ae as OffsetOrPosition, P as PlainTextLanguage, u as Position, b as RawGrammar, a as RawTheme, g as RawThemeSetting, k as RequireKeys, ab as ResolvedDecorationItem, af as ResolvedPosition, z as ShikiTransformer, a4 as ShikiTransformerContext, w as ShikiTransformerContextCommon, a3 as ShikiTransformerContextMeta, y as ShikiTransformerContextSource, a8 as StringLiteralUnion, Y as ThemeRegistration, X as ThemeRegistrationRaw, a0 as ThemedTokenExplanation, $ as ThemedTokenScopeExplanation, a1 as TokenBase, t as TokenStyles, s as TokenizeWithThemeOptions, a2 as TransformerOptions } from './chunk-tokens.mjs';
export { W as WebAssemblyInstantiator } from './chunk-index.mjs';

interface Grammar extends IGrammar {
    name: string;
}

/**
 * Internal context of Shiki, core textmate logic
 */
interface ShikiInternal<BundledLangKeys extends string = never, BundledThemeKeys extends string = never> {
    /**
     * Load a theme to the highlighter, so later it can be used synchronously.
     */
    loadTheme: (...themes: (ThemeInput | BundledThemeKeys | SpecialTheme)[]) => Promise<void>;
    /**
     * Load a language to the highlighter, so later it can be used synchronously.
     */
    loadLanguage: (...langs: (LanguageInput | BundledLangKeys | SpecialLanguage)[]) => Promise<void>;
    /**
     * Get the registered theme object
     */
    getTheme: (name: string | ThemeRegistrationAny) => ThemeRegistrationResolved;
    /**
     * Get the registered language object
     */
    getLanguage: (name: string | LanguageRegistration) => Grammar;
    /**
     * Set the current theme and get the resolved theme object and color map.
     * @internal
     */
    setTheme: (themeName: string | ThemeRegistrationAny) => {
        theme: ThemeRegistrationResolved;
        colorMap: string[];
    };
    /**
     * Get the names of loaded languages
     *
     * Special-handled languages like `text`, `plain` and `ansi` are not included.
     */
    getLoadedLanguages: () => string[];
    /**
     * Get the names of loaded themes
     *
     * Special-handled themes like `none` are not included.
     */
    getLoadedThemes: () => string[];
    /**
     * Dispose the internal registry and release resources
     */
    dispose: () => void;
    /**
     * Dispose the internal registry and release resources
     */
    [Symbol.dispose]: () => void;
}
/**
 * Generic instance interface of Shiki
 */
interface HighlighterGeneric<BundledLangKeys extends string, BundledThemeKeys extends string> extends ShikiInternal<BundledLangKeys, BundledThemeKeys> {
    /**
     * Get highlighted code in HTML string
     */
    codeToHtml: (code: string, options: CodeToHastOptions<ResolveBundleKey<BundledLangKeys>, ResolveBundleKey<BundledThemeKeys>>) => string;
    /**
     * Get highlighted code in HAST.
     * @see https://github.com/syntax-tree/hast
     */
    codeToHast: (code: string, options: CodeToHastOptions<ResolveBundleKey<BundledLangKeys>, ResolveBundleKey<BundledThemeKeys>>) => Root;
    /**
     * Get highlighted code in tokens. Uses `codeToTokensWithThemes` or `codeToTokensBase` based on the options.
     */
    codeToTokens: (code: string, options: CodeToTokensOptions<ResolveBundleKey<BundledLangKeys>, ResolveBundleKey<BundledThemeKeys>>) => TokensResult;
    /**
     * Get highlighted code in tokens with a single theme.
     * @returns A 2D array of tokens, first dimension is lines, second dimension is tokens in a line.
     */
    codeToTokensBase: (code: string, options: CodeToTokensBaseOptions<ResolveBundleKey<BundledLangKeys>, ResolveBundleKey<BundledThemeKeys>>) => ThemedToken[][];
    /**
     * Get highlighted code in tokens with multiple themes.
     *
     * Different from `codeToTokensBase`, each token will have a `variants` property consisting of an object of color name to token styles.
     *
     * @returns A 2D array of tokens, first dimension is lines, second dimension is tokens in a line.
     */
    codeToTokensWithThemes: (code: string, options: CodeToTokensWithThemesOptions<ResolveBundleKey<BundledLangKeys>, ResolveBundleKey<BundledThemeKeys>>) => ThemedTokenWithVariants[][];
    /**
     * Get the last grammar state of a code snippet.
     * You can pass the grammar state to `codeToTokens` as `grammarState` to continue tokenizing from an intermediate state.
     */
    getLastGrammarState: (code: string, options: CodeToTokensBaseOptions<ResolveBundleKey<BundledLangKeys>, ResolveBundleKey<BundledThemeKeys>>) => GrammarState;
    /**
     * Get internal context object
     * @internal
     * @deprecated
     */
    getInternalContext: () => ShikiInternal;
}
/**
 * The fine-grained core Shiki highlighter instance.
 */
type HighlighterCore = HighlighterGeneric<never, never>;

export { CodeToHastOptions, CodeToTokensBaseOptions, CodeToTokensOptions, CodeToTokensWithThemesOptions, type Grammar, GrammarState, type HighlighterCore, type HighlighterGeneric, LanguageInput, LanguageRegistration, ResolveBundleKey, type ShikiInternal, SpecialLanguage, SpecialTheme, ThemeInput, ThemeRegistrationAny, ThemeRegistrationResolved, ThemedToken, ThemedTokenWithVariants, TokensResult };
