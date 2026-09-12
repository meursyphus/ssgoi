/**
 * Viewport-accurate counterpart to {@link getRect}: `el`'s position relative to
 * `root`, measured with getBoundingClientRect. Same `(root, el)` shape and
 * meaning as `getRect`, but because gBCR is the on-screen box it REFLECTS any
 * transform / nested-scroll BETWEEN `root` and `el` — e.g. a translate-based
 * horizontal scroller — which is the position the zoom tile must animate from.
 * `getRect` walks the offsetParent chain and ignores transforms, so the
 * page-edge transitions (film, and sheet/jaemin/axis via getViewportRect) keep
 * using it.
 *
 * Safety net: it also normalizes out any scale on `root` itself. The completion
 * cleanup releases each animation's WAAPI fill, so a SETTLED page is back at its
 * natural transform before the next transition measures it — but a page can
 * still be mid-scale when measured by an INTERRUPTED transition (a back-tap
 * before the previous one settles): `buildInput` runs before the orchestrator
 * completes the prior transition, so the zoom background tween may still be
 * scaling the page. gBCR is post-transform while `offsetWidth/Height` is the
 * untransformed layout size, so their ratio is the live scale; dividing returns
 * the rect in `root`'s layout space — the space the zoom translate operates in.
 * An in-page translate (a scrolled row) is scaled by the same factor and so
 * survives the division. (No-op when `root` is at scale 1.)
 *
 * Page-level scroll OUTSIDE `root` cancels in the `el − root` subtraction; the
 * per-page scroll delta is reintroduced separately via context.scrollOffset.
 */
export function getClientRect(root: HTMLElement, el: HTMLElement): DOMRect {
  const rootRect = root.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  // offset dimensions are rounded to integer CSS pixels. A fractional layout
  // size is not a transform: treating it as scale distorts square image boxes
  // and can make a projected crop fall outside its destination window.
  const scale = (size: number, offset: number): number =>
    offset > 0 && Math.abs(size - offset) > 0.5 ? size / offset : 1;
  const sx = scale(rootRect.width, root.offsetWidth);
  const sy = scale(rootRect.height, root.offsetHeight);
  return new DOMRect(
    (elRect.left - rootRect.left) / sx,
    (elRect.top - rootRect.top) / sy,
    elRect.width / sx,
    elRect.height / sy,
  );
}
