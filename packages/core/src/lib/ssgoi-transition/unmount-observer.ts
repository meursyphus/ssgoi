/**
 * Shared MutationObserver for detecting element unmount.
 *
 * One observer watches `document.body` with `subtree: true`. Each watched
 * element registers a callback; when ANY DOM removal happens, the observer
 * walks the removed subtree and fires the callback for any tracked element
 * it finds (including descendants of the actually-removed node).
 *
 * One shared observer beats per-element observers for two reasons:
 *  - parent re-mounts that detach the watched node also fire
 *  - lower memory / browser overhead than dozens of observers
 */

type UnmountCallback = () => void;

const watched = new Map<HTMLElement, UnmountCallback>();

let sharedObserver: MutationObserver | null = null;
let initialized = false;

function checkRemovedSubtree(node: Node): void {
  // A childList "removed" record also fires when a node is MOVED (removed then
  // re-inserted within the same commit) — e.g. Next.js reorders its bfcache
  // `<Activity>` siblings on back/forward navigation, so React detaches and
  // reattaches a kept-alive page's DOM node. By the time this observer callback
  // runs the move is already complete, so `isConnected` distinguishes a real
  // unmount (still detached) from a reorder (already reattached). Only a true
  // unmount may fire the leave callback; a moved node keeps its watch, otherwise
  // its visibility tracking would be torn down and later transitions break.
  if (node instanceof HTMLElement && watched.has(node) && !node.isConnected) {
    const cb = watched.get(node)!;
    watched.delete(node);
    // Defer to microtask so we never mutate the DOM inside the observer
    // callback (some browsers complain).
    queueMicrotask(cb);
  }
  for (const child of Array.from(node.childNodes)) {
    checkRemovedSubtree(child);
  }
}

function init(): void {
  if (initialized || typeof document === "undefined") return;
  initialized = true;

  sharedObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const removed of Array.from(m.removedNodes)) {
        checkRemovedSubtree(removed);
      }
    }
  });

  const start = () => {
    sharedObserver?.observe(document.body, { childList: true, subtree: true });
  };

  if (document.body) {
    start();
  } else {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  }
}

/** Register `cb` to fire when `element` is removed from the DOM. */
export function watchUnmount(
  element: HTMLElement,
  cb: UnmountCallback,
): () => void {
  init();
  watched.set(element, cb);
  return () => {
    watched.delete(element);
  };
}
