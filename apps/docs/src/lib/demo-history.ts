/**
 * In-demo history checks for mobile demo back/close affordances. React
 * wrappers: `DemoBackLink` (`@/lib/components/demo-back-link`) and
 * `useDemoBack` (`@/lib/hooks`).
 *
 * Why the Navigation API and not `history.length`: inside a showcase iframe,
 * `history.length` counts the joint session history, so a blind back() can
 * navigate the parent docs page away. `navigation.entries()` lists only this
 * frame's entries, and `sameDocument` rules out an entry from before a reload
 * (going back to it is a full page load, so no transition would play).
 * Browsers without the Navigation API get the fallback route instead.
 *
 * An embedded demo (any iframe: showcase clips, docs previews) always takes
 * the fallback. Traversal there moves the joint session history of the whole
 * tab, so with sibling clip iframes pushing on their own timers, or a parent
 * that pushed a `#clip-n` hash, `history.go(-1)` (and even
 * `navigation.traverseTo`) reverts whichever frame navigated last: a sibling
 * clip or the docs page itself, not the frame that was tapped.
 */

type NavigationLike = {
  currentEntry: { index: number } | null;
  entries(): { url: string | null; sameDocument: boolean }[];
};

/** Called with the percent-encoded pathname of a history entry. */
export type DemoPathMatch = (pathname: string) => boolean;

/** `/demo/<slug>` for a pathname under a demo, otherwise null. */
function demoRootOf(pathname: string): string | null {
  return /^\/demo\/[^/]+/.exec(pathname)?.[0] ?? null;
}

/**
 * The history delta (-1, -2, …) to the nearest earlier entry of this frame
 * that belongs to the current demo and satisfies `match` (any entry when
 * omitted), or null. The search only walks back through same-document
 * entries under the current `/demo/<slug>` root, so it never leaves the demo.
 */
export function demoBackDelta(match?: DemoPathMatch): number | null {
  if (typeof window === "undefined" || window.self !== window.top) return null;
  const root = demoRootOf(window.location.pathname);
  const nav = (window as Window & { navigation?: NavigationLike }).navigation;
  const index = nav?.currentEntry?.index;
  if (!root || !nav || index == null) return null;
  const entries = nav.entries();
  for (let i = index - 1; i >= 0; i -= 1) {
    const entry = entries[i];
    if (!entry?.url || !entry.sameDocument) return null;
    const { origin, pathname } = new URL(entry.url);
    if (origin !== window.location.origin) return null;
    if (pathname !== root && !pathname.startsWith(`${root}/`)) return null;
    if (!match || match(pathname)) return i - index;
  }
  return null;
}

/**
 * True when the previous history entry of this frame is a same-document page
 * of the current demo, i.e. a page this document navigated from itself, so
 * `router.back()` replays the effect SSGOI recorded for it in reverse.
 */
export function previousEntryIsInDemo(): boolean {
  return demoBackDelta() === -1;
}

/**
 * Traverse back inside the demo when `demoBackDelta(match)` finds an entry.
 * Returns false (and does nothing) when the caller should use its fallback.
 */
export function goBackInDemo(match?: DemoPathMatch): boolean {
  const delta = demoBackDelta(match);
  if (delta == null) return false;
  window.history.go(delta);
  return true;
}
