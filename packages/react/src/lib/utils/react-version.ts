/**
 * React version detection utilities
 *
 * Determines React version to provide appropriate ref cleanup strategy
 * @see https://github.com/meursyphus/ssgoi/issues/181
 */

import React from "react";

/**
 * Checks if the current React version supports ref cleanup functions
 *
 * Ref cleanup was introduced in React 19.0.0 (released Dec 5, 2024)
 *
 * @returns true if React version >= 19.0.0
 *
 * @example
 * ```ts
 * if (supportsRefCleanup()) {
 *   // Use modern ref cleanup
 *   return (el) => {
 *     return () => cleanup();
 *   };
 * } else {
 *   // Use fallback strategy (MutationObserver or null check)
 *   return (el) => {
 *     if (el === null) cleanup();
 *   };
 * }
 * ```
 */
export function supportsRefCleanup(): boolean {
  try {
    const version = React.version;
    const majorVersion = parseInt(version.split(".")[0], 10);
    return majorVersion >= 19;
  } catch {
    // If we can't determine version, assume modern React
    return true;
  }
}

/**
 * Gets the current React version string
 *
 * @returns React version (e.g., "19.0.0", "18.2.0")
 */
export function getReactVersion(): string {
  return React.version;
}
