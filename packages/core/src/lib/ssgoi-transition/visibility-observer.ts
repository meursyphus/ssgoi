/**
 * Per-element MutationObserver for detecting inline `display: none` toggles.
 *
 * React 19.2's <Activity mode="hidden"> doesn't unmount children — it applies
 * `style="display: none"` to each host child of the Activity boundary while
 * keeping the DOM and Fiber state alive. The shared unmount-observer cannot
 * see this (no removedNodes mutation fires), so this module gives the
 * dispatcher a second trigger surface: visible↔hidden transitions on inline
 * style.
 *
 * Each watched element gets its own MutationObserver scoped to
 * `attributeFilter: ['style']`. One observer per element is fine — page-level
 * transition wrappers are a handful per route, and per-element scoping lets
 * us pause/resume cleanly when we mutate `display` ourselves (otherwise our
 * own restore-from-hidden write would re-enter as an onShow).
 */

type VisibilityCallbacks = {
  onHide: () => void;
  onShow: () => void;
};

type Entry = {
  observer: MutationObserver;
  wasHidden: boolean;
  observeOptions: MutationObserverInit;
  target: HTMLElement;
};

const watched = new WeakMap<HTMLElement, Entry>();

const isHidden = (el: HTMLElement): boolean => el.style.display === "none";

/**
 * Register `cb` to fire when `element`'s inline display flips into or out of
 * `none`. Returns an unwatch function.
 */
export function watchVisibility(
  element: HTMLElement,
  cb: VisibilityCallbacks,
): () => void {
  if (typeof window === "undefined") return () => {};
  if (watched.has(element)) return () => {};

  const observeOptions: MutationObserverInit = {
    attributes: true,
    attributeFilter: ["style"],
  };

  const entry: Entry = {
    observer: null as unknown as MutationObserver,
    wasHidden: isHidden(element),
    observeOptions,
    target: element,
  };

  const observer = new MutationObserver(() => {
    const hidden = isHidden(element);
    if (hidden === entry.wasHidden) return;
    entry.wasHidden = hidden;
    // Defer to a microtask — mirrors unmount-observer and keeps us from
    // mutating styles inside the observer callback itself.
    queueMicrotask(hidden ? cb.onHide : cb.onShow);
  });

  observer.observe(element, observeOptions);
  entry.observer = observer;
  watched.set(element, entry);

  return () => {
    observer.disconnect();
    watched.delete(element);
  };
}

/**
 * Temporarily stop reacting to style changes on `element`. Use this around
 * intentional inline-display writes that ssgoi makes itself (e.g. unhiding
 * during an exit animation, re-hiding on complete) so they don't bounce back
 * through onHide/onShow as if React did them.
 */
export function pauseVisibility(element: HTMLElement): void {
  watched.get(element)?.observer.disconnect();
}

/**
 * Re-attach the observer after a pause. Resyncs `wasHidden` from the current
 * inline style so the next external change is judged against reality.
 */
export function resumeVisibility(element: HTMLElement): void {
  const entry = watched.get(element);
  if (!entry) return;
  entry.wasHidden = isHidden(element);
  entry.observer.observe(entry.target, entry.observeOptions);
}
