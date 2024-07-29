/**
 * Search a node for a toc.
 *
 * @param {Nodes} root
 * @param {RegExp | undefined} expression
 * @param {SearchOptions} settings
 * @returns {SearchResult}
 */
export function search(root: Nodes, expression: RegExp | undefined, settings: SearchOptions): SearchResult;
export type Heading = import('mdast').Heading;
export type Nodes = import('mdast').Nodes;
export type PhrasingContent = import('mdast').PhrasingContent;
export type Test = import('unist-util-is').Test;
export type Rank = Heading['depth'];
/**
 * Search configuration.
 */
export type SearchOptions = {
    /**
     * Maximum heading depth to include in the table of contents (default: `6`).
     *
     * This is inclusive: when set to `3`, level three headings are included
     * (those with three hashes, `###`).
     */
    maxDepth?: Rank | null | undefined;
    /**
     * Minimum heading depth to include in the table of contents (default: `1`).
     *
     * This is inclusive: when set to `3`, level three headings are included
     * (those with three hashes, `###`).
     */
    minDepth?: Rank | null | undefined;
    /**
     * Headings to skip, wrapped in `new RegExp('^(' + value + ')$', 'i')`
     * (default: `undefined`).
     *
     * Any heading matching this expression will not be present in the table of
     * contents.
     */
    skip?: string | null | undefined;
    /**
     * Allow headings to be children of certain node types (default: the to `toc`
     * given `tree`, to only allow top-level headings) (default:
     * `d => d === tree`).
     *
     * Internally, uses `unist-util-is` to check, so `parents` can be any
     * `is`-compatible test.
     */
    parents?: Test;
};
/**
 * Entry.
 */
export type SearchEntry = {
    /**
     *   ID of entry.
     */
    id: string;
    /**
     *   Contents of entry.
     */
    children: Array<PhrasingContent>;
    /**
     *   Rank of entry.
     */
    depth: Rank;
};
/**
 * Results.
 */
export type SearchResult = {
    /**
     *   Where the contents section starts, if looking for a heading.
     */
    index: number;
    /**
     *   Where the contents section ends, if looking for a heading.
     */
    endIndex: number;
    /**
     *   List of entries.
     */
    map: Array<SearchEntry>;
};
//# sourceMappingURL=search.d.ts.map