/*
 * Search results link to #anchors. When the browser loads a page itself it
 * keeps the fragment target in view while the page settles, but a client
 * navigation scrolls to it only once. Two things still move the target after
 * that:
 * - The catalog's SSGOI boundary resets a /showcase page to the top right
 *   after the hash scroll, in every engine and on full loads too (see
 *   ScrollToHash).
 * - Blog GIFs shown side by side in a table resize their row when the file
 *   arrives: auto table layout sizes the columns from the natural width,
 *   which the img width/height attributes don't supply under `width: 100%`.
 *   Chromium's scroll anchoring absorbs it; WebKit has none, and headings
 *   below the table drift by hundreds of pixels.
 * These helpers re-align the target until the page settles or the reader
 * scrolls. A same-page result is scrolled by `holdAnchor` alone.
 */

const READER_INPUT = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

let cancelCurrent: (() => void) | null = null;

/** Keeps `#id` at its scroll-margin for `ms`, or until the reader scrolls. */
export function holdAnchor(id: string, ms = 2500): () => void {
  cancelCurrent?.();
  let done = false;
  let frame = 0;
  let end = 0;

  const align = () => {
    const el = document.getElementById(id);
    if (done || !el) return;
    const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    if (Math.abs(el.getBoundingClientRect().top - margin) > 2)
      el.scrollIntoView({ block: "start", behavior: "instant" });
  };
  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(align);
  };
  // Late images and fonts resize the body. Re-align inside the observer
  // callback, which runs after layout and before paint, so WebKit shows fewer
  // shifted frames; the next-frame check catches a scroll that lands after
  // it. A boundary reset resizes nothing, so a few timed checks cover that.
  const resize = new ResizeObserver(() => {
    align();
    schedule();
  });
  const timers = [0, 150, 400, 900].map((t) => window.setTimeout(schedule, t));

  const stop = () => {
    if (done) return;
    done = true;
    resize.disconnect();
    cancelAnimationFrame(frame);
    timers.forEach((t) => window.clearTimeout(t));
    window.clearTimeout(end);
    for (const type of READER_INPUT)
      window.removeEventListener(type, stop, { capture: true });
    if (cancelCurrent === stop) cancelCurrent = null;
  };

  resize.observe(document.body);
  end = window.setTimeout(stop, ms);
  // Capture phase: a keydown that is still being dispatched (the Enter that
  // chose the result) has already passed it, so it doesn't count.
  for (const type of READER_INPUT)
    window.addEventListener(type, stop, { capture: true, passive: true });
  cancelCurrent = stop;
  return stop;
}

/**
 * Call right after `router.push(href)`: once the new page is on screen with
 * href's #hash, hold that target in place (see `holdAnchor`).
 */
export function holdAnchorAfterNavigation(href: string, timeoutMs = 10_000) {
  const url = new URL(href, window.location.href);
  const id = decodeURIComponent(url.hash.slice(1));
  if (!id) return;
  cancelCurrent?.();
  const started = performance.now();
  let timer = 0;
  const cancel = () => {
    window.clearTimeout(timer);
    if (cancelCurrent === cancel) cancelCurrent = null;
  };
  const poll = () => {
    const arrived =
      window.location.pathname === url.pathname &&
      window.location.hash === url.hash &&
      document.getElementById(id);
    if (arrived) {
      cancel();
      holdAnchor(id);
    } else if (performance.now() - started > timeoutMs) cancel();
    else timer = window.setTimeout(poll, 50);
  };
  cancelCurrent = cancel;
  poll();
}
