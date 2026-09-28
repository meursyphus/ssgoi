"use client";

import { useEffect } from "react";
import { holdAnchor } from "@/lib/search/hold-anchor";

/**
 * Deep links such as /showcase/air-bnb#clip-1 (catalog search, ⌘K palette).
 * Next scrolls to the hash on a client navigation, but the catalog's SSGOI
 * boundary then resets the arriving page to the top a frame or more later,
 * since no transition rule asks it to keep scroll. Hold the clip in place for
 * a short while after mount, until the reader scrolls on their own.
 */
export function ScrollToHash() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) return holdAnchor(id, 1500);
  }, []);
  return null;
}
