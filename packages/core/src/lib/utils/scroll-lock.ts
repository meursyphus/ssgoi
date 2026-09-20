type Lock = { owners: number; restore: () => void };

// Shared across providers: one transition must not unlock another provider's
// scroll container (or snapshot the other provider's temporary styles).
const locks = new WeakMap<HTMLElement, Lock>();

export const isScrollLocked = (element: HTMLElement): boolean =>
  locks.has(element);

/** Lock user scrolling without moving the body or changing page coordinates. */
export function lockScroll(element: HTMLElement): () => void {
  let lock = locks.get(element);
  if (!lock) {
    const document = element.ownerDocument;
    const view = document.defaultView!;
    const isRoot =
      element === document.documentElement ||
      element === document.scrollingElement;
    const target = isRoot ? document : element;
    const style = element.style;
    const computed = view.getComputedStyle(element);
    const restores: (() => void)[] = [];
    const set = (property: string, value: string) => {
      const previous = style.getPropertyValue(property);
      const priority = style.getPropertyPriority(property);
      style.setProperty(property, value, "important");
      restores.push(() => {
        // Leave application changes made during playback alone.
        if (
          style.getPropertyValue(property) !== value ||
          style.getPropertyPriority(property) !== "important"
        )
          return;
        if (previous) style.setProperty(property, previous, priority);
        else style.removeProperty(property);
      });
    };

    // Preserve an existing classic scrollbar's space. Overlay scrollbars need
    // no gutter, and an existing `stable both-edges` must remain unchanged.
    const scrollbarWidth = isRoot
      ? view.innerWidth - element.clientWidth
      : element.offsetWidth -
        element.clientWidth -
        (parseFloat(computed.borderLeftWidth) || 0) -
        (parseFloat(computed.borderRightWidth) || 0);
    if (scrollbarWidth > 0 && !computed.scrollbarGutter?.includes("stable")) {
      if (view.CSS?.supports("scrollbar-gutter", "stable")) {
        set("scrollbar-gutter", "stable");
      } else {
        // Adding padding to an explicitly sized content-box would widen it.
        // Keep the custom container's border box intact on older browsers.
        if (!isRoot) {
          const width = element.offsetWidth;
          set("box-sizing", "border-box");
          set("width", `${width}px`);
        }
        set(
          "padding-right",
          `${(parseFloat(computed.paddingRight) || 0) + scrollbarWidth}px`,
        );
      }
    }
    set("overflow-x", "hidden");
    set("overflow-y", "hidden");
    set("overscroll-behavior-x", "none");
    set("overscroll-behavior-y", "none");
    set("overflow-anchor", "none");
    set("touch-action", "pinch-zoom");

    // Non-passive listeners also stop a gesture already in progress on Safari;
    // touch-action alone only applies to gestures that start after the lock.
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
        for (const restore of restores.reverse()) restore();
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
