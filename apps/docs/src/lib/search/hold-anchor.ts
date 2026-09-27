/*
 * Search results link to #anchors. When the browser loads a page itself it
 * keeps the fragment target in view while the page settles, but a client
 * navigation scrolls to it only once. Content that arrives later then pushes
 * the target away: blog images carry no intrinsic size, WebKit has no scroll
 * anchoring to compensate, and the catalog's SSGOI boundary resets scroll a
 * frame after Next's hash scroll. These helpers re-align the target until the
 * page settles or the reader scrolls.
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
  // Late images and fonts resize the body; a boundary reset does not, so a
  // few timed checks cover that case.
  const resize = new ResizeObserver(schedule);
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
