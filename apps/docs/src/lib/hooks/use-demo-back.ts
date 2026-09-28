"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { goBackInDemo, type DemoPathMatch } from "@/lib/demo-history";

export type DemoBackOptions = {
  /**
   * Go back to the nearest in-demo entry whose pathname matches, skipping the
   * in-demo entries after it (a screen with several parents, or one reopened
   * by closing a sheet). Without it, only the immediately previous entry
   * counts.
   */
  match?: DemoPathMatch;
  /** Warm the fallback route the way a `<Link>` would. Defaults to true. */
  prefetch?: boolean;
};

/**
 * Programmatic back/close for mobile demos (a close button that is not a
 * link, or dismissing a screen after submit, send or publish). The returned
 * callback goes back through history when an in-demo entry is behind this
 * screen, so SSGOI replays the recorded effect in reverse. Otherwise (direct
 * entry, reload, a showcase clip's first leg) it *replaces* the screen with
 * `fallback`: the closed screen is not left in history for the parent's own
 * back to reopen, and the route rules still animate the swap backward.
 *
 * Plain back/close affordances should use `DemoBackLink`, which does the same
 * and also works before hydration.
 */
export function useDemoBack(
  fallback: string,
  { match, prefetch = true }: DemoBackOptions = {},
): () => void {
  const router = useRouter();

  useEffect(() => {
    if (prefetch) router.prefetch(fallback);
  }, [router, fallback, prefetch]);

  return useCallback(() => {
    if (goBackInDemo(match)) return;
    router.replace(fallback, { scroll: false });
  }, [router, fallback, match]);
}
