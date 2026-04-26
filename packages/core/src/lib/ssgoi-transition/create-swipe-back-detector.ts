/**
 * Swipe-Back Detector
 *
 * Detects native edge swipe-back / swipe-forward gestures (iOS Safari, Android
 * system back gesture) purely from touch event sequences. We deliberately do
 * NOT depend on popstate because:
 *
 *   - iOS 16+ has a regression (WebKit 248303) where swipe-back skips popstate
 *     when history entries were created without user interaction.
 *   - popstate doesn't tell us *how* the navigation happened — header back-button,
 *     keyboard shortcut, history.back() and edge-swipe all look identical.
 *
 * Heuristic
 *   1. touchstart with a single touch starting within EDGE_THRESHOLD px of either
 *      vertical edge of the layout viewport → record a candidate.
 *   2. touchmove that is horizontally dominant AND moves *away* from that edge
 *      by more than MOVE_THRESHOLD → mark candidate as "moved".
 *      Multi-touch, vertically-dominant motion, or losing the tracked finger all
 *      drop the candidate.
 *   3. touchend with cumulative |dx| ≥ FINAL_DISTANCE in the correct direction
 *      → settle as a swipe.
 *      touchcancel after horizontal commitment also counts: the browser took the
 *      gesture over, which is exactly what edge-swipe-back does on iOS.
 *
 * Settling arms an "active" flag. The flag auto-expires after EXPIRE_WINDOW so
 * a successful gesture that wasn't actually a navigation (e.g. user dragged a
 * right-anchored sheet) doesn't poison subsequent navigations.
 *
 * The flag also has a `stickyActive` mirror that lives one extra macrotask past
 * `onPageEnter()`, so an OUT/IN pair queued together (which can fire in either
 * order across adapters) reads the same value.
 *
 * Mac trackpad and Magic Trackpad swipes don't dispatch touch events on web, so
 * they go unhandled here. That's intentional — we'd rather miss-detect those
 * than false-positive them.
 */

const EDGE_THRESHOLD = 30;
const MOVE_THRESHOLD = 8;
const HORIZONTAL_RATIO = 1.2;
const FINAL_DISTANCE = 30;
// If a navigation doesn't arrive within this window after a swipe settles, the
// flag self-clears so unrelated downstream interactions aren't suppressed.
const EXPIRE_WINDOW = 600;

type Candidate = {
  identifier: number;
  startX: number;
  startY: number;
  fromLeftEdge: boolean;
  moved: boolean;
};

export function createSwipeBackDetector() {
  let candidate: Candidate | null = null;
  let active = false;
  let stickyActive = false;
  let expireTimer: ReturnType<typeof setTimeout> | null = null;
  let stickyTimer: ReturnType<typeof setTimeout> | null = null;
  let installed = false;

  const findTouch = (list: TouchList, id: number): Touch | null => {
    for (let i = 0; i < list.length; i++) {
      const touch = list.item(i);
      if (touch && touch.identifier === id) return touch;
    }
    return null;
  };

  const clearExpireTimer = () => {
    if (expireTimer !== null) {
      clearTimeout(expireTimer);
      expireTimer = null;
    }
  };

  const clearStickyTimer = () => {
    if (stickyTimer !== null) {
      clearTimeout(stickyTimer);
      stickyTimer = null;
    }
  };

  const settle = () => {
    active = true;
    stickyActive = true;
    clearExpireTimer();
    // A stale stickyTimer scheduled by a previous onPageEnter could otherwise
    // fire after this fresh settle and clobber stickyActive back to false.
    clearStickyTimer();
    expireTimer = setTimeout(() => {
      active = false;
      stickyActive = false;
      expireTimer = null;
    }, EXPIRE_WINDOW);
  };

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 1) {
      candidate = null;
      return;
    }
    const t = e.touches.item(0);
    if (!t) {
      candidate = null;
      return;
    }
    const w = window.innerWidth;
    const fromLeftEdge = t.clientX <= EDGE_THRESHOLD;
    const fromRightEdge = t.clientX >= w - EDGE_THRESHOLD;
    if (!fromLeftEdge && !fromRightEdge) {
      candidate = null;
      return;
    }
    candidate = {
      identifier: t.identifier,
      startX: t.clientX,
      startY: t.clientY,
      fromLeftEdge,
      moved: false,
    };
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!candidate) return;
    if (e.touches.length !== 1) {
      candidate = null;
      return;
    }
    const t = findTouch(e.touches, candidate.identifier);
    if (!t) {
      candidate = null;
      return;
    }

    const dx = t.clientX - candidate.startX;
    const dy = t.clientY - candidate.startY;
    const adx = Math.abs(dx);
    const ady = Math.abs(dy);

    // Vertical-dominant motion at any point cancels the candidate (scrolling).
    // Doing this regardless of `moved` lets a user who started horizontal but
    // changed their mind escape the latch.
    if (ady > MOVE_THRESHOLD && ady > adx * HORIZONTAL_RATIO) {
      candidate = null;
      return;
    }

    const inDirection = candidate.fromLeftEdge ? dx > 0 : dx < 0;
    if (adx > MOVE_THRESHOLD && adx > ady * HORIZONTAL_RATIO && inDirection) {
      candidate.moved = true;
    }
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (!candidate) return;
    const t = findTouch(e.changedTouches, candidate.identifier);
    if (!t) {
      candidate = null;
      return;
    }
    const dx = t.clientX - candidate.startX;
    const inDirection = candidate.fromLeftEdge ? dx > 0 : dx < 0;
    if (candidate.moved && inDirection && Math.abs(dx) >= FINAL_DISTANCE) {
      settle();
    }
    candidate = null;
  };

  const onTouchCancel = () => {
    if (!candidate) return;
    // touchcancel often fires when the browser intercepts the gesture
    // (exactly what iOS swipe-back does). We don't always get a Touch object
    // for the original identifier in changedTouches, so treat any cancel that
    // follows committed horizontal movement as a swipe.
    if (candidate.moved) {
      settle();
    }
    candidate = null;
  };

  const initialize = () => {
    if (typeof window === "undefined" || installed) return;
    installed = true;
    const opts: AddEventListenerOptions = { passive: true, capture: true };
    window.addEventListener("touchstart", onTouchStart, opts);
    window.addEventListener("touchmove", onTouchMove, opts);
    window.addEventListener("touchend", onTouchEnd, opts);
    window.addEventListener("touchcancel", onTouchCancel, opts);
  };

  // TODO: not currently called from anywhere. Wire from each adapter's Ssgoi
  // provider unmount (React useEffect cleanup, Vue onUnmounted, Svelte
  // onDestroy, Solid onCleanup, Angular ngOnDestroy) so HMR / repeated mounts /
  // multi-provider pages don't accumulate window touch listeners. Non-issue in
  // production root-level usage today.
  const destroy = () => {
    if (typeof window === "undefined" || !installed) return;
    installed = false;
    const opts: EventListenerOptions = { capture: true };
    window.removeEventListener("touchstart", onTouchStart, opts);
    window.removeEventListener("touchmove", onTouchMove, opts);
    window.removeEventListener("touchend", onTouchEnd, opts);
    window.removeEventListener("touchcancel", onTouchCancel, opts);
    clearExpireTimer();
    clearStickyTimer();
    candidate = null;
    active = false;
    stickyActive = false;
  };

  /**
   * Returns true if a swipe was just detected. Has a side effect: when it
   * returns true, the auto-expire timer is cancelled because we now know a
   * navigation pair is consuming this gesture — let the IN side clear via
   * onPageEnter() instead. This protects against slow-IN races where the IN
   * branch enters getTransition past EXPIRE_WINDOW after OUT already captured.
   */
  const isSwipeBack = () => {
    const result = active || stickyActive;
    if (result) clearExpireTimer();
    return result;
  };

  /**
   * Called when a navigation pair completes (from the IN side, including the
   * cancel/null branch). Clears `active` immediately and defers `stickyActive`
   * one macrotask so a partner OUT/IN already past their capture point still
   * sees the same value.
   */
  const onPageEnter = () => {
    active = false;
    clearExpireTimer();
    clearStickyTimer();
    stickyTimer = setTimeout(() => {
      stickyActive = false;
      stickyTimer = null;
    }, 0);
  };

  return { initialize, destroy, isSwipeBack, onPageEnter };
}
