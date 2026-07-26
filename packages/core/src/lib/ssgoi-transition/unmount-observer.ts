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

export type UnmountAnchor = {
  parent: Node;
  nextSibling: Node | null;
};

export type UnmountOptions = {
  /**
   * `false` when this element left inside another watched boundary owned by
   * the same transition context. The nested element still needs cleanup, but
   * the outer boundary owns the navigation OUT event.
   */
  emit: boolean;
};

type UnmountCallback = (
  anchor?: UnmountAnchor,
  options?: UnmountOptions,
) => void;

type WatchGroup = object;

type WatchedEntry = {
  element: HTMLElement;
  callback: UnmountCallback;
  group: WatchGroup;
  parent: WatchedEntry | null;
};

const defaultGroup: WatchGroup = {};
const watched = new Map<HTMLElement, WatchedEntry>();

let sharedObserver: MutationObserver | null = null;
let initialized = false;

function collectRemovedSubtree(
  node: Node,
  anchor: UnmountAnchor,
  removed: Map<HTMLElement, { entry: WatchedEntry; anchor: UnmountAnchor }>,
): void {
  // A childList "removed" record also fires when a node is MOVED (removed then
  // re-inserted within the same commit) — e.g. Next.js reorders its bfcache
  // `<Activity>` siblings on back/forward navigation, so React detaches and
  // reattaches a kept-alive page's DOM node. By the time this observer callback
  // runs the move is already complete, so `isConnected` distinguishes a real
  // unmount (still detached) from a reorder (already reattached). Only a true
  // unmount may fire the leave callback; a moved node keeps its watch, otherwise
  // its visibility tracking would be torn down and later transitions break.
  if (node instanceof HTMLElement && watched.has(node) && !node.isConnected) {
    removed.set(node, { entry: watched.get(node)!, anchor });
  }
  for (const child of Array.from(node.childNodes)) {
    collectRemovedSubtree(child, anchor, removed);
  }
}

function flushRemoved(
  removed: Map<HTMLElement, { entry: WatchedEntry; anchor: UnmountAnchor }>,
): void {
  const removedEntries = new Set(
    Array.from(removed.values(), ({ entry }) => entry),
  );

  for (const [element, { entry, anchor }] of removed) {
    watched.delete(element);

    let parent = entry.parent;
    let nested = false;
    while (parent) {
      if (parent.group === entry.group && removedEntries.has(parent)) {
        nested = true;
        break;
      }
      parent = parent.parent;
    }

    // Defer to microtask so we never mutate the DOM inside the observer
    // callback (some browsers complain).
    queueMicrotask(() => entry.callback(anchor, { emit: !nested }));
  }
}

function init(): void {
  if (initialized || typeof document === "undefined") return;
  initialized = true;

  sharedObserver = new MutationObserver((mutations) => {
    const removed = new Map<
      HTMLElement,
      { entry: WatchedEntry; anchor: UnmountAnchor }
    >();

    for (const m of mutations) {
      const anchor = {
        parent: m.target,
        nextSibling: m.nextSibling,
      };
      for (const removedNode of Array.from(m.removedNodes)) {
        collectRemovedSubtree(removedNode, anchor, removed);
      }
    }

    flushRemoved(removed);
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
  group: WatchGroup = defaultGroup,
): () => void {
  init();

  let parentElement = element.parentElement;
  let parent: WatchedEntry | null = null;
  while (parentElement) {
    const candidate = watched.get(parentElement);
    if (candidate?.group === group) {
      parent = candidate;
      break;
    }
    parentElement = parentElement.parentElement;
  }

  watched.set(element, {
    element,
    callback: cb,
    group,
    parent,
  });

  return () => {
    watched.delete(element);
  };
}
