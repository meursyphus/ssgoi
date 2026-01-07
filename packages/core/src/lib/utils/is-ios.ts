/**
 * Detects if the current runtime is iOS (iPhone, iPad, iPod)
 * Also detects iPad on iOS 13+ which reports as MacIntel but has touch
 */
export function isIOS(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPad on iOS 13+ reports as MacIntel but has touch
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}
