/**
 * Detects if the current runtime is Android
 */
export function isAndroid(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  return /Android/i.test(navigator.userAgent);
}
