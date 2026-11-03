/**
 * Shared-element targets can render after the page boundary that holds them.
 * Next.js Cache Components commits a route's static shell first and streams
 * the Suspense body with the `data-hero-enter-key` / `data-zoom-enter-key`
 * element later; on a revisit React hides the body it already has while that
 * boundary re-suspends. Pairs are resolved once, at prepare, so without a
 * wait the transition finds nothing and plays without its shared element.
 *
 * `waitForSharedTarget` holds preparation until `isReady` reports the target
 * (mounted and laid out), bounded by `timeoutMs` and the prepare signal. The
 * incoming page is kept transparent meanwhile so its fallback never paints
 * over the outgoing page.
 */

export const SHARED_TARGET_WAIT_MS = 500;

export type SharedTargetWaitOptions = {
  signal?: AbortSignal;
  timeoutMs?: number;
};

/** Whether `el` is in the document and has a layout box. */
export function isRendered(el: Element): boolean {
  if (el.isConnected === false) return false;
  if (typeof el.getClientRects !== "function") return true;
  return el.getClientRects().length > 0;
}

/**
 * Resolve `true` as soon as `isReady()` holds, `false` once `timeoutMs`
 * elapses or `signal` aborts. Resolves synchronously-fast (no observer) when
 * the target is already there.
 */
export function waitForSharedTarget(
  page: HTMLElement,
  isReady: () => boolean,
  { signal, timeoutMs = SHARED_TARGET_WAIT_MS }: SharedTargetWaitOptions = {},
): Promise<boolean> {
  if (isReady()) return Promise.resolve(true);
  if (signal?.aborted || typeof MutationObserver === "undefined") {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    const previousOpacity = page.style.opacity;
    page.style.opacity = "0";

    let settled = false;
    const finish = (ready: boolean) => {
      if (settled) return;
      settled = true;
      observer.disconnect();
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
      // Strategies read the inline opacity as the value to restore to.
      page.style.opacity = previousOpacity;
      resolve(ready);
    };
    const onAbort = () => finish(false);

    const observer = new MutationObserver(() => {
      if (isReady()) finish(true);
    });
    // A body that re-suspends is un-hidden by an attribute write, not a mount.
    observer.observe(page, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class", "hidden"],
    });
    const timer = setTimeout(() => finish(false), timeoutMs);
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}
