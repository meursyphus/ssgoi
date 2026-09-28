"use client";

import { useLayoutEffect, useState, type RefObject } from "react";

function scrollParent(el: HTMLElement | null) {
  let node = el?.parentElement ?? null;
  while (node) {
    const { overflowY } = getComputedStyle(node);
    if (overflowY === "auto" || overflowY === "scroll") return node;
    node = node.parentElement;
  }
  return null;
}

/**
 * Height of the phone frame's scroll container, so an overlay pinned with
 * `sticky top-0` can cover exactly the visible screen (no position: fixed —
 * that would escape the desktop phone mock).
 */
export function useFrameViewport(ref: RefObject<HTMLElement | null>) {
  const [height, setHeight] = useState(0);
  const [scroller, setScroller] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const parent = scrollParent(ref.current);
    if (!parent) return;
    const observer = new ResizeObserver(() => {
      setHeight(parent.clientHeight);
      setScroller(parent);
    });
    observer.observe(parent);
    return () => observer.disconnect();
  }, [ref]);

  return { height, scroller };
}
