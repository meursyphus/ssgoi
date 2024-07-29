import { Config } from 'prettier';

export interface PluginConfig {
    svelteSortOrder?: SortOrder;
    svelteStrictMode?: boolean;
    svelteBracketNewLine?: boolean;
    svelteAllowShorthand?: boolean;
    svelteIndentScriptAndStyle?: boolean;
}

export type PrettierConfig = PluginConfig & Config;

type SortOrder =
    | 'options-scripts-markup-styles'
    | 'options-scripts-styles-markup'
    | 'options-markup-styles-scripts'
    | 'options-markup-scripts-styles'
    | 'options-styles-markup-scripts'
    | 'options-styles-scripts-markup'
    | 'scripts-options-markup-styles'
    | 'scripts-options-styles-markup'
    | 'markup-options-styles-scripts'
    | 'markup-options-scripts-styles'
    | 'styles-options-markup-scripts'
    | 'styles-options-scripts-markup'
    | 'scripts-markup-options-styles'
    | 'scripts-styles-options-markup'
    | 'markup-styles-options-scripts'
    | 'markup-scripts-options-styles'
    | 'styles-markup-options-scripts'
    | 'styles-scripts-options-markup'
    | 'scripts-markup-styles-options'
    | 'scripts-styles-markup-options'
    | 'markup-styles-scripts-options'
    | 'markup-scripts-styles-options'
    | 'styles-markup-scripts-options'
    | 'styles-scripts-markup-options'
    | 'none';
