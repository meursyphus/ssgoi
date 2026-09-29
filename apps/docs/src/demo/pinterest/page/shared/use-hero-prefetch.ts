"use client";

import { useEffect, type RefObject } from "react";
import { pinImageUrl } from "@/demo/pinterest/api/pin/image";

/**
 * Warms the close-up's 800px hero once the element that opens it scrolls
 * near the viewport, so the zoom lands on a painted image instead of a
 * blank page on the first open.
 */
export function useHeroPrefetch(
  ref: RefObject<Element | null>,
  image: string,
  aspectRatio: string,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const conn = (navigator as { connection?: { saveData?: boolean } })
      .connection;
    if (conn?.saveData) return;

    let idleHandle: number | undefined;
    let timeoutHandle: number | undefined;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const fire = () => {
          const img = new Image();
          img.src = pinImageUrl(image, aspectRatio, 800);
        };
        if (typeof w.requestIdleCallback === "function") {
          idleHandle = w.requestIdleCallback(fire);
        } else {
          timeoutHandle = window.setTimeout(fire, 250);
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (idleHandle != null) w.cancelIdleCallback?.(idleHandle);
      if (timeoutHandle != null) window.clearTimeout(timeoutHandle);
    };
  }, [ref, image, aspectRatio]);
}
