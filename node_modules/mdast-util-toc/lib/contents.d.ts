/**
 * Transform a list of heading objects to a markdown list.
 *
 * @param {Array<SearchEntry>} map
 * @param {ContentsOptions} settings
 */
export function contents(map: Array<SearchEntry>, settings: ContentsOptions): import("mdast").List;
export type List = import('mdast').List;
export type ListItem = import('mdast').ListItem;
export type PhrasingContent = import('mdast').PhrasingContent;
export type SearchEntry = import('./search.js').SearchEntry;
/**
 * Build configuration.
 */
export type ContentsOptions = {
    /**
     * Whether to compile list items tightly (default: `false`).
     */
    tight?: boolean | null | undefined;
    /**
     * Whether to compile list items as an ordered list, otherwise they are
     * unordered (default: `false`).
     */
    ordered?: boolean | null | undefined;
    /**
     * Add a prefix to links to headings in the table of contents (default:
     * `undefined`).
     *
     * Useful for example when later going from mdast to hast and sanitizing with
     * `hast-util-sanitize`.
     */
    prefix?: string | null | undefined;
};
//# sourceMappingURL=contents.d.ts.map