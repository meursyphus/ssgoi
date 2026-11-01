/**
 * Scroll offsets of the scrollers inside a page boundary: horizontal lists,
 * carousels, inner panes.
 *
 * A scroller's offset lives on its layout box, and the box is dropped whenever
 * the node leaves the document. Both page modes do that to the outgoing page:
 *
 *  - Unmount mode detaches the page and reinserts it for the OUT.
 *  - Hidden mode (React `<Activity>`, Next.js Cache Components): React may
 *    MOVE a hidden page's node while it reorders the kept-alive siblings, in
 *    the same commit that hides it and before ssgoi sees the hide.
 *
 * Unless the offsets are restored, the outgoing page animates with every inner
 * scroller back at its start. A shared element measured inside one, such as a
 * hero card, then flies from the wrong spot, and a kept-alive page comes back
 * with its lists reset.
 *
 * Offsets are recorded while the user scrolls. `scroll` does not bubble but
 * does capture, so one listener on the boundary sees every descendant
 * scroller. The offsets are written back once ssgoi has the page in the
 * document and displayed again. The boundary's own scroll is not tracked,
 * because the navigation's scroll policy owns it.
 */

type Offset = { left: number; top: number };

const tracked = new WeakMap<HTMLElement, Map<Element, Offset>>();

/** Whether `element` has a layout box (connected and not under `display:none`). */
function rendered(element: Element): boolean {
  if (!element.isConnected) return false;
  return typeof element.checkVisibility === "function"
    ? element.checkVisibility()
    : true;
}

/** Start recording the offsets of scrollers inside `root`. Idempotent. */
export function trackScrollOffsets(root: HTMLElement): void {
  if (tracked.has(root) || typeof root.addEventListener !== "function") return;
  const offsets = new Map<Element, Offset>();
  tracked.set(root, offsets);
  root.addEventListener(
    "scroll",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element) || target === root) return;
      const left = target.scrollLeft;
      const top = target.scrollTop;
      if (left || top) offsets.set(target, { left, top });
      // A scroller with no box reads 0 without the user having scrolled back,
      // so keep its record until the page is displayed again.
      else if (rendered(target)) offsets.delete(target);
    },
    { capture: true, passive: true },
  );
}

/**
 * Write the recorded offsets back onto scrollers inside `root` that lost them.
 * Call only while `root` is in the document and displayed: an offset needs a
 * layout box to land on. Only an axis now at 0 is restored, so an offset the
 * app set itself after the page came back is left alone. `skip` excludes the
 * navigation's scroll container, whose position the scroll policy owns.
 */
export function restoreScrollOffsets(
  root: HTMLElement,
  skip?: Element | null,
): void {
  const offsets = tracked.get(root);
  if (!offsets?.size) return;
  for (const [element, { left, top }] of offsets) {
    // A scroller React removed since it was recorded: forget it.
    if (!root.contains(element)) {
      offsets.delete(element);
      continue;
    }
    if (element === skip) continue;
    if (left && element.scrollLeft === 0) element.scrollLeft = left;
    if (top && element.scrollTop === 0) element.scrollTop = top;
  }
}
