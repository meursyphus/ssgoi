/**
 * Creates a swipe detector for iOS Safari swipe-back gesture
 * Detects edge swipes that trigger Safari's native back navigation
 */
export function createSwipeDetector(enabled: boolean) {
  let isSwipeDetected = false;
  let isEdgeTouch = false;

  const handleTouchStart = (e: TouchEvent) => {
    if (!enabled) return;

    const touch = e.touches[0];
    if (!touch) return;

    // Check if touch started near left edge (within 50px from left)
    isEdgeTouch = touch.clientX < 50;
  };

  const handleTouchEnd = () => {
    if (!enabled) return;

    // If touch started at edge and ended, assume it's a swipe-back gesture
    if (isEdgeTouch) {
      isSwipeDetected = true;

      // Reset the flag after 500ms to allow normal navigation to resume
      setTimeout(() => {
        isSwipeDetected = false;
      }, 500);
    }

    // Reset edge touch flag
    isEdgeTouch = false;
  };

  const isSwipePending = () => isSwipeDetected;

  const initialize = () => {
    if (typeof window === "undefined") return;
    if (!enabled) return;

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
  };

  const cleanup = () => {
    if (typeof window === "undefined") return;
    window.removeEventListener("touchstart", handleTouchStart);
    window.removeEventListener("touchend", handleTouchEnd);
  };

  return {
    initialize,
    cleanup,
    isSwipePending,
  };
}
