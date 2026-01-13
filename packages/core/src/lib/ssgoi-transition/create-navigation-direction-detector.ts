/**
 * Navigation Direction Detector
 *
 * Detects navigation direction (push/back/forward) using history.state and popstate event.
 * Used to skip animations on back navigation for iOS Safari compatibility.
 *
 * How it works:
 * - Stores an incrementing index in history.state.ssgoiIndex
 * - On popstate, compares the new index with current to determine direction
 * - newIndex < currentIndex → back
 * - newIndex > currentIndex → forward
 * - No popstate → push (new navigation)
 */

export type NavigationDirection = "push" | "back" | "forward";

export function createNavigationDirectionDetector() {
  let currentIndex =
    typeof history !== "undefined" ? (history.state?.ssgoiIndex ?? 0) : 0;
  let direction: NavigationDirection = "push";
  let popstateOccurred = false;

  const handlePopstate = (e: PopStateEvent) => {
    popstateOccurred = true;
    const newIndex = e.state?.ssgoiIndex ?? 0;

    if (newIndex < currentIndex) {
      direction = "back";
    } else if (newIndex > currentIndex) {
      direction = "forward";
    }

    currentIndex = newIndex;
  };

  const initialize = () => {
    if (typeof window === "undefined") return;
    window.addEventListener("popstate", handlePopstate);

    // Set initial index if not present
    if (history.state?.ssgoiIndex == null) {
      history.replaceState({ ...history.state, ssgoiIndex: currentIndex }, "");
    } else {
      // Sync with existing state (e.g., after page refresh)
      currentIndex = history.state.ssgoiIndex;
    }
  };

  /**
   * Called on page enter (IN transition)
   * - Updates index for push navigation
   * - Resets direction and popstateOccurred flag
   * - Returns the direction of this navigation
   */
  const onPageEnter = (): NavigationDirection => {
    if (!popstateOccurred) {
      // No popstate = push navigation
      currentIndex++;
      history.replaceState({ ...history.state, ssgoiIndex: currentIndex }, "");
    }

    const result = direction;
    direction = "push"; // Reset for next navigation
    popstateOccurred = false;
    return result;
  };

  const isBack = () => direction === "back";

  return {
    initialize,
    onPageEnter,
    isBack,
  };
}
