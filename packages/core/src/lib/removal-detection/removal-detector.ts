/**
 * DOM Element Removal Detection using MutationObserver
 *
 * Based on production-tested patterns from:
 * - Auto-Animate (FormKit) - WeakMap storage, parent observer reuse
 * - Alpine.js - Pause/resume mechanism
 * - ResizeObserver Polyfill - Throttling patterns
 *
 * @see https://github.com/formkit/auto-animate
 * @see https://github.com/alpinejs/alpine
 */

/**
 * Manages MutationObserver instances for detecting element removal from DOM
 *
 * Key features:
 * - WeakMap storage for automatic garbage collection
 * - Observer reuse per parent element (reference counting)
 * - Comment node filtering (framework compatibility)
 * - Move vs remove detection via isConnected check
 */
export class RemovalDetector {
  // WeakMap for automatic GC - no manual cleanup needed (Auto-Animate pattern)
  private observers = new WeakMap<Element, MutationObserver>();
  private callbacks = new WeakMap<Element, () => void>();
  private parentElements = new WeakMap<Element, Element>();

  // Reference counting for observer cleanup
  private observerRefCounts = new Map<Element, number>();

  // Prevent recursive triggers
  private isProcessing = false;

  /**
   * Observe an element for removal from DOM
   *
   * @param element - Element to observe
   * @param onRemoval - Callback to invoke when element is removed
   * @returns Cleanup function to stop observing
   *
   * @example
   * ```ts
   * const cleanup = detector.observe(element, () => {
   *   console.log('Element removed!');
   *   runExitAnimation(element);
   * });
   *
   * // Later: stop observing
   * cleanup();
   * ```
   */
  observe(element: HTMLElement, onRemoval: () => void): () => void {
    const parent = element.parentElement;

    if (!parent) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[SSGOI] Cannot observe element without parent");
      }
      return () => {};
    }

    // Validate callback
    if (typeof onRemoval !== "function") {
      if (process.env.NODE_ENV === "development") {
        console.error("[SSGOI] onRemoval must be a function");
      }
      return () => {};
    }

    // Store callback and parent reference
    this.callbacks.set(element, onRemoval);
    this.parentElements.set(element, parent);

    // Get or create observer for this parent
    let observer = this.observers.get(parent);

    if (!observer) {
      // Create new observer for this parent (Auto-Animate pattern)
      observer = new MutationObserver((mutations) => {
        this.handleMutations(mutations);
      });

      try {
        // Minimal configuration for performance (Auto-Animate pattern)
        observer.observe(parent, {
          childList: true, // Only monitor child additions/removals
          subtree: false, // Don't watch nested children
        });

        this.observers.set(parent, observer);
        this.observerRefCounts.set(parent, 1);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("[SSGOI] Failed to observe parent:", error);
        }
        return () => {};
      }
    } else {
      // Increment reference count (multiple elements using same observer)
      const count = this.observerRefCounts.get(parent) ?? 0;
      this.observerRefCounts.set(parent, count + 1);
    }

    // Return cleanup function
    return () => this.disconnect(element);
  }

  /**
   * Handle mutations from MutationObserver
   * Processes all mutations in batch for performance
   *
   * @private
   */
  private handleMutations(mutations: MutationRecord[]): void {
    // Prevent re-entrant calls (Alpine.js pattern)
    if (this.isProcessing) return;

    this.isProcessing = true;

    try {
      const processed = new Set<Element>();

      for (const mutation of mutations) {
        // Only process childList mutations
        if (mutation.type !== "childList") continue;

        // Filter to element nodes only (Auto-Animate pattern)
        // This filters out comment nodes, text nodes, etc.
        const removedElements = Array.from(mutation.removedNodes).filter(
          (node): node is Element => node.nodeType === Node.ELEMENT_NODE,
        );

        for (const element of removedElements) {
          // Skip if already processed (batching)
          if (processed.has(element)) continue;
          processed.add(element);

          // Check if we're observing this element
          const callback = this.callbacks.get(element);
          if (!callback) continue;

          // Distinguish move from removal (Auto-Animate pattern)
          // If element is still connected, it was moved to another parent
          if (element.isConnected) continue;

          // Element truly removed - invoke callback
          try {
            callback();
          } catch (error) {
            if (process.env.NODE_ENV === "development") {
              console.error("[SSGOI] Error in removal callback:", error);
            }
          }

          // Clean up tracking for this element
          this.cleanup(element);
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Clean up element tracking without triggering callback
   *
   * @private
   */
  private cleanup(element: Element): void {
    // Remove callback
    this.callbacks.delete(element);

    // Get parent
    const parent = this.parentElements.get(element);
    this.parentElements.delete(element);

    if (!parent) return;

    // Decrement reference count
    const count = this.observerRefCounts.get(parent) ?? 0;
    const newCount = count - 1;

    if (newCount <= 0) {
      // No more elements using this observer - disconnect it
      const observer = this.observers.get(parent);
      if (observer) {
        observer.disconnect();
        this.observers.delete(parent);
      }
      this.observerRefCounts.delete(parent);
    } else {
      this.observerRefCounts.set(parent, newCount);
    }
  }

  /**
   * Manually disconnect an element
   * Does not trigger callback
   *
   * @param element - Element to stop observing
   */
  disconnect(element: Element): void {
    const hasCallback = this.callbacks.has(element);
    if (hasCallback) {
      this.cleanup(element);
    }
  }

  /**
   * Get statistics for debugging
   * Only available in development mode
   *
   * @returns Observer statistics
   */
  getStats(): { activeObservers: number; totalRefCount: number } {
    return {
      activeObservers: this.observerRefCounts.size,
      totalRefCount: Array.from(this.observerRefCounts.values()).reduce(
        (sum, count) => sum + count,
        0,
      ),
    };
  }
}

/**
 * Global singleton instance
 * Most apps only need one detector
 */
export const globalRemovalDetector = new RemovalDetector();
