/**
 * Global MutationObserver for detecting element unmount
 *
 * This module provides a shared observer that watches for DOM removals
 * and triggers cleanup callbacks when watched elements are removed.
 *
 * Key features:
 * - Single shared observer for all transitions (performance)
 * - subtree: true to detect removals at any depth
 * - Optimized: only checks removedNodes, not all watched elements
 * - Framework agnostic: works with React 18/19, Svelte, Vue, etc.
 */

type UnmountCallback = () => void;

// Map of watched elements to their cleanup callbacks
const watchedElements = new Map<HTMLElement, UnmountCallback>();

// Shared observer instance
let sharedObserver: MutationObserver | null = null;

// Flag to track if observer is initialized
let isInitialized = false;

/**
 * Check a removed subtree for watched elements
 * Recursively traverses the removed node and its children
 */
function checkRemovedSubtree(node: Node): void {
  // Check if this node is watched
  if (node instanceof HTMLElement && watchedElements.has(node)) {
    const callback = watchedElements.get(node)!;
    watchedElements.delete(node);
    // Execute callback in next microtask to avoid mutation during observer callback
    queueMicrotask(() => {
      callback();
    });
  }

  // Check children
  const children = node.childNodes;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child) {
      checkRemovedSubtree(child);
    }
  }
}

/**
 * Initialize the shared MutationObserver
 * Called lazily when first element is registered
 */
function initObserver(): void {
  if (isInitialized || typeof document === "undefined") return;

  isInitialized = true;

  sharedObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      // Only process removedNodes
      const removedNodes = mutation.removedNodes;
      for (let i = 0; i < removedNodes.length; i++) {
        const node = removedNodes[i];
        if (node) {
          checkRemovedSubtree(node);
        }
      }
    }
  });

  // Observe document.body with subtree to catch all removals
  // Use document.body instead of document for better compatibility
  if (document.body) {
    sharedObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  } else {
    // If body not ready, wait for DOMContentLoaded
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        sharedObserver?.observe(document.body, {
          childList: true,
          subtree: true,
        });
      },
      { once: true },
    );
  }
}

/**
 * Register an element to watch for unmount
 *
 * When the element is removed from DOM, the callback is executed
 * and the element is automatically unregistered.
 *
 * @param element - The element to watch
 * @param callback - Callback to execute when element is removed from DOM
 */
export function watchUnmount(
  element: HTMLElement,
  callback: UnmountCallback,
): void {
  initObserver();
  watchedElements.set(element, callback);
}

/**
 * Check if an element is being watched
 */
export function isWatched(element: HTMLElement): boolean {
  return watchedElements.has(element);
}

/**
 * Get the number of watched elements (for debugging)
 */
export function getWatchedCount(): number {
  return watchedElements.size;
}

/**
 * Manually trigger unmount for an element
 * Useful when cleanup is called explicitly (React 19, Svelte destroy)
 */
export function triggerUnmount(element: HTMLElement): boolean {
  const callback = watchedElements.get(element);
  if (callback) {
    watchedElements.delete(element);
    callback();
    return true;
  }
  return false;
}

/**
 * Cleanup all watchers and disconnect observer
 * Mainly for testing purposes
 */
export function resetObserver(): void {
  watchedElements.clear();
  sharedObserver?.disconnect();
  sharedObserver = null;
  isInitialized = false;
}
