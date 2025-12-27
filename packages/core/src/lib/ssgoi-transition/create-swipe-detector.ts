/**
 * Creates a swipe detector for iOS Safari swipe-back gesture
 * Detects edge swipes that trigger Safari's native back navigation
 */
export function createSwipeDetector(enabled: boolean) {
  let isSwipeDetected = false;
  let startX = 0;
  let startY = 0;
  let isEdgeTouch = false;

  // Maximum distance from left edge to start detecting (in pixels)
  const EDGE_THRESHOLD = 50;

  const handleTouchStart = (e: TouchEvent) => {
    if (!enabled) return;

    const touch = e.touches[0];
    if (!touch) return;

    // Check if touch started near left edge
    isEdgeTouch = touch.clientX < EDGE_THRESHOLD;

    if (isEdgeTouch) {
      startX = touch.clientX;
      startY = touch.clientY;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!enabled) return;
    if (!isEdgeTouch) return;

    const touch = e.touches[0];
    if (!touch) return;

    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    // Detect swipe: moved right more than threshold and horizontal movement is dominant
    if (
      deltaX > window.outerWidth / 2 - 5 &&
      Math.abs(deltaX) > Math.abs(deltaY)
    ) {
      isSwipeDetected = true;
    } else {
      isSwipeDetected = false;
    }
  };

  const handleTouchEnd = () => {
    if (!enabled) return;

    // Reset state
    isEdgeTouch = false;
    startX = 0;
    startY = 0;
  };

  const isSwipePending = () => isSwipeDetected;

  const initialize = () => {
    if (typeof window === "undefined") return;
    if (!enabled) return;

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
  };

  const cleanup = () => {
    if (typeof window === "undefined") return;
    window.removeEventListener("touchstart", handleTouchStart);
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchend", handleTouchEnd);
  };

  let swipeResetCounter = 0;
  const resetSwipeDetection = () => {
    requestAnimationFrame(() => {
      swipeResetCounter++;
      if (swipeResetCounter > 1) {
        swipeResetCounter = 0;
        isSwipeDetected = false;
      }
    });
  };

  return {
    initialize,
    cleanup,
    isSwipePending,
    resetSwipeDetection,
  };
}
