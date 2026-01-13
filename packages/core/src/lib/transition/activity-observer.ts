/**
 * Activity Observer for detecting React Activity hidden state
 *
 * React 19.2's Activity component hides elements using `display: none`
 * instead of unmounting them. This observer detects that style change
 * and triggers exit animations without cloning.
 *
 * Detection flow:
 * 1. Watch for style attribute changes on element
 * 2. When display changes to 'none', it's Activity hiding
 * 3. Reveal element (display: ''), run exit animation, then hide back (display: none)
 */

type ActivityHideCallback = (element: HTMLElement) => void;

// Map of watched elements to their callbacks
const watchedElements = new Map<HTMLElement, ActivityHideCallback>();

// Shared observer instance
let sharedObserver: MutationObserver | null = null;

// Flag to track initialization
let isInitialized = false;

// Elements currently being animated (to prevent re-triggering)
const animatingElements = new WeakSet<HTMLElement>();

/**
 * Check if element was hidden by Activity (display: none)
 */
function isActivityHidden(element: HTMLElement): boolean {
  return element.style.display === "none";
}

/**
 * Initialize the shared MutationObserver for Activity detection
 */
function initActivityObserver(): void {
  if (isInitialized || typeof document === "undefined") return;

  isInitialized = true;

  sharedObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type !== "attributes" ||
        mutation.attributeName !== "style"
      ) {
        continue;
      }

      const element = mutation.target as HTMLElement;

      // Skip if not watched
      if (!watchedElements.has(element)) continue;

      // Skip if currently animating (we set display ourselves)
      if (animatingElements.has(element)) continue;

      // Check if Activity just hid this element
      if (isActivityHidden(element)) {
        const callback = watchedElements.get(element)!;
        // Mark as animating to prevent re-trigger
        animatingElements.add(element);
        callback(element);
      }
    }
  });

  if (document.body) {
    sharedObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
      subtree: true,
    });
  } else {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        sharedObserver?.observe(document.body, {
          attributes: true,
          attributeFilter: ["style"],
          subtree: true,
        });
      },
      { once: true },
    );
  }
}

/**
 * Watch an element for Activity hide (display: none)
 *
 * @param element - Element to watch
 * @param callback - Called when Activity hides the element
 */
export function watchActivityHide(
  element: HTMLElement,
  callback: ActivityHideCallback,
): void {
  initActivityObserver();
  watchedElements.set(element, callback);
}

/**
 * Stop watching an element
 */
export function unwatchActivityHide(element: HTMLElement): void {
  watchedElements.delete(element);
  animatingElements.delete(element);
}

/**
 * Check if element is being watched for Activity
 */
export function isWatchedForActivity(element: HTMLElement): boolean {
  return watchedElements.has(element);
}

/**
 * Reveal an Activity-hidden element for animation
 * Call this before running exit animation
 */
export function revealForAnimation(element: HTMLElement): void {
  element.style.display = "";
}

/**
 * Hide element back after animation completes
 * Call this after exit animation finishes
 */
export function hideAfterAnimation(element: HTMLElement): void {
  element.style.display = "none";
  animatingElements.delete(element);
}

/**
 * Mark animation as complete (cleanup)
 */
export function completeActivityAnimation(element: HTMLElement): void {
  animatingElements.delete(element);
}

/**
 * Reset observer (for testing)
 */
export function resetActivityObserver(): void {
  watchedElements.clear();
  sharedObserver?.disconnect();
  sharedObserver = null;
  isInitialized = false;
}
