type Lock = { owners: number; restore: () => void };

// Shared across providers: one transition must not unlock another provider's
// scroll container. Input listeners stay attached until the last owner releases.
const locks = new WeakMap<HTMLElement, Lock>();

export const isScrollLocked = (element: HTMLElement): boolean =>
  locks.has(element);

type Axis = "x" | "y";

/**
 * Whether `node` is a scroller that can take more scroll along `axis` in the
 * direction of `sign`. Overflow is read from computed style; a scroller
 * already at that edge would chain the input to its ancestors.
 */
const canScroll = (
  view: Window,
  node: Element,
  axis: Axis,
  sign: number,
): boolean => {
  const style = view.getComputedStyle(node);
  const overflow = axis === "x" ? style.overflowX : style.overflowY;
  if (overflow !== "auto" && overflow !== "scroll" && overflow !== "overlay")
    return false;
  const max =
    axis === "x"
      ? node.scrollWidth - node.clientWidth
      : node.scrollHeight - node.clientHeight;
  if (max <= 1) return false;
  const position = axis === "x" ? node.scrollLeft : node.scrollTop;
  return sign > 0 ? position < max - 1 : position > 1;
};

/**
 * The lock guards the page container. Input aimed at a scroller nested inside
 * the page (a carousel, a code block, a chat list) is that scroller's to
 * consume, as long as it can still move that way: a wheel over a horizontal
 * carousel right after a navigation must scroll the carousel, not be eaten
 * with the page scroll. Only nodes strictly below the locked container are
 * examined, so the container's own CSS and geometry are never read here.
 */
const nestedScrollerTakes = (
  event: Event,
  element: HTMLElement,
  isRoot: boolean,
  axis: Axis,
  sign: number,
): boolean => {
  const document = element.ownerDocument;
  const view = document.defaultView;
  if (!view || sign === 0) return false;
  for (const entry of event.composedPath()) {
    if (entry === element) break;
    if (
      isRoot &&
      (entry === document.documentElement ||
        entry === document.body ||
        entry === document.scrollingElement)
    )
      break;
    if (!(entry instanceof view.Element)) break;
    if (canScroll(view, entry, axis, sign)) return true;
  }
  return false;
};

/**
 * Suppress wheel, single-finger touchmove and page-scroll keys without changing
 * CSS or native scrollbars. Native scrollbar interaction and programmatic
 * scrolling remain available; already-running native momentum is not rewound.
 * Scrollers nested inside the page keep taking input they can consume.
 */
export function lockScroll(element: HTMLElement): () => void {
  let lock = locks.get(element);
  if (!lock) {
    const document = element.ownerDocument;
    const isRoot =
      element === document.documentElement ||
      element === document.scrollingElement;
    const target = isRoot ? document : element;
    // Where the finger went down, to tell which way a touchmove scrolls.
    let touchStart: { x: number; y: number } | null = null;
    const trackTouch = (event: Event) => {
      const touch = (event as TouchEvent).touches[0];
      touchStart = touch ? { x: touch.clientX, y: touch.clientY } : null;
    };
    // Document listeners must explicitly opt out of passive defaults before
    // preventDefault can suppress a cancelable wheel/touchmove event.
    const preventScroll = (event: Event) => {
      if (!event.cancelable) return;
      if (event.type === "wheel") {
        const wheel = event as WheelEvent;
        if (wheel.ctrlKey) return;
        // Shift turns a vertical wheel into a horizontal scroll.
        const horizontal =
          Math.abs(wheel.deltaX) > Math.abs(wheel.deltaY) ||
          (wheel.shiftKey && wheel.deltaX === 0);
        const delta = horizontal ? wheel.deltaX || wheel.deltaY : wheel.deltaY;
        if (
          nestedScrollerTakes(
            event,
            element,
            isRoot,
            horizontal ? "x" : "y",
            Math.sign(delta),
          )
        )
          return;
      } else if (event.type === "touchmove") {
        const touches = (event as TouchEvent).touches;
        if (touches.length > 1) return;
        const touch = touches[0];
        if (touch && touchStart) {
          const dx = touchStart.x - touch.clientX;
          const dy = touchStart.y - touch.clientY;
          const horizontal = Math.abs(dx) > Math.abs(dy);
          if (
            nestedScrollerTakes(
              event,
              element,
              isRoot,
              horizontal ? "x" : "y",
              Math.sign(horizontal ? dx : dy),
            )
          )
            return;
        }
      }
      event.preventDefault();
    };
    const listenerOptions = { passive: false, capture: true };
    target.addEventListener("touchstart", trackTouch, {
      passive: true,
      capture: true,
    });
    target.addEventListener("wheel", preventScroll, listenerOptions);
    target.addEventListener("touchmove", preventScroll, listenerOptions);
    const scrollKeys = new Set([
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "PageUp",
      "PageDown",
      "Home",
      "End",
      " ",
    ]);
    const preventKeyScroll = (event: Event) => {
      const key = event as KeyboardEvent;
      if (key.defaultPrevented || key.altKey || !scrollKeys.has(key.key))
        return;
      // Preserve typing, caret movement, selection and keyboard-operated
      // controls, including controls inside a shadow root.
      for (const entry of key.composedPath()) {
        const node = entry as HTMLElement;
        if (
          node.isContentEditable ||
          node.matches?.(
            "input, textarea, select, [role=slider], [role=spinbutton], [role=listbox], [role=menu], [role=tablist]",
          )
        )
          return;
        if (key.key === " " && node.matches?.("button, [role=button]")) return;
      }
      if (key.cancelable) key.preventDefault();
    };
    target.addEventListener("keydown", preventKeyScroll, { capture: true });

    lock = {
      owners: 0,
      restore() {
        target.removeEventListener("touchstart", trackTouch, {
          capture: true,
        });
        target.removeEventListener("wheel", preventScroll, { capture: true });
        target.removeEventListener("touchmove", preventScroll, {
          capture: true,
        });
        target.removeEventListener("keydown", preventKeyScroll, {
          capture: true,
        });
      },
    };
    locks.set(element, lock);
  }
  lock.owners++;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--lock.owners === 0) {
      locks.delete(element);
      lock.restore();
    }
  };
}
