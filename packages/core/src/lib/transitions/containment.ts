/**
 * `contain` a transition puts on a moving page while it animates.
 *
 * `layout` keeps the page's layout independent of the rest of the document and
 * makes it the containing block for its positioned descendants, which is what
 * the transforms rely on. It deliberately leaves out `paint`: paint containment
 * clips the page to its box and, in Chromium, drops any `backdrop-filter` that
 * references an SVG filter (`url(#lens)`) on a descendant — glass chrome riding
 * inside the page lost its blur for the whole transition. Pages that need their
 * overflow trimmed already get it from the scroller or an explicit clip-path.
 */
export const PAGE_CONTAIN = "layout";
