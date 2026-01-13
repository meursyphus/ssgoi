import { isIOS } from "./is-ios";
import { isAndroid } from "./is-android";

/**
 * Detects if the current runtime is a desktop browser (non-mobile)
 */
export function isDesktop(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  return !isIOS() && !isAndroid();
}
