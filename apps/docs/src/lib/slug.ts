/**
 * The one heading-anchor implementation. Docs `Section`/`Step` headings, blog
 * headings and the search index all derive `#anchors` from it, so a link built
 * by search always points at an id the page actually rendered.
 */
export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .normalize("NFC")
    .toLowerCase()
    .replace(/[`'’"]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+/, "")
    .slice(0, 64)
    .replace(/-+$/, "");
}
