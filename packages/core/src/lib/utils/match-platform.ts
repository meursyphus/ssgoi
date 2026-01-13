import type { Platform } from "../types";
import { isIOS } from "./is-ios";
import { isAndroid } from "./is-android";
import { isDesktop } from "./is-desktop";

/**
 * Check if current platform matches any of the specified platforms
 * @param platforms Array of platforms to check against
 * @returns true if current platform matches any in the array
 */
export function matchPlatform(platforms: Platform[]): boolean {
  if (platforms.length === 0) {
    return false;
  }

  if (platforms.includes("all")) {
    return true;
  }

  if (platforms.includes("ios") && isIOS()) {
    return true;
  }

  if (platforms.includes("android") && isAndroid()) {
    return true;
  }

  if (platforms.includes("desktop") && isDesktop()) {
    return true;
  }

  return false;
}
