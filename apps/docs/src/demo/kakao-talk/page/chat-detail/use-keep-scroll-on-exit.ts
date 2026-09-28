"use client";

import { useLayoutEffect, type RefObject } from "react";

/**
 * SSGOI animates the outgoing page with its real DOM node: React detaches it,
 * then SSGOI inserts it back for the exit. A detached scroller loses its
 * scrollTop, so the room would flash to the top of its history under the
 * profile sheet, the 서랍 drill or the drill back to the list.
 *
 * On unmount (before React detaches the node) remember the offset, and put it
 * back as soon as that same node is back in the document — a MutationObserver
 * callback runs before the next paint.
 */
export function useKeepScrollOnExit(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    return () => {
      const top = el.scrollTop;
      let detached = false;
      const observer = new MutationObserver((records) => {
        detached ||= records.some((r) =>
          Array.from(r.removedNodes).some((n) => n.contains(el)),
        );
        if (detached && el.isConnected) {
          el.scrollTop = top;
          observer.disconnect();
        }
      });
      observer.observe(el.ownerDocument.body, {
        childList: true,
        subtree: true,
      });
      // No exit animation (or a remount in dev StrictMode): stop watching.
      window.setTimeout(() => observer.disconnect(), 2000);
    };
  }, [ref]);
}
