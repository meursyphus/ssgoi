type Lock = { owners: number; restore: () => void };

// Shared across providers: one transition must not unlock another provider's
// scroll container. Input listeners stay attached until the last owner releases.
const locks = new WeakMap<HTMLElement, Lock>();

export const isScrollLocked = (element: HTMLElement): boolean =>
  locks.has(element);

/**
 * Suppress wheel, single-finger touchmove and page-scroll keys without changing
 * CSS or native scrollbars. Native scrollbar interaction and programmatic
 * scrolling remain available; already-running native momentum is not rewound.
 */
export function lockScroll(element: HTMLElement): () => void {
  let lock = locks.get(element);
  if (!lock) {
    const document = element.ownerDocument;
    const isRoot =
      element === document.documentElement ||
      element === document.scrollingElement;
    const target = isRoot ? document : element;
    // Document listeners must explicitly opt out of passive defaults before
    // preventDefault can suppress a cancelable wheel/touchmove event.
    const preventScroll = (event: Event) => {
      if (event.type === "wheel" && (event as WheelEvent).ctrlKey) return;
      if (
        event.type === "touchmove" &&
        (event as TouchEvent).touches.length > 1
      )
        return;
      if (event.cancelable) event.preventDefault();
    };
    const listenerOptions = { passive: false, capture: true };
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
