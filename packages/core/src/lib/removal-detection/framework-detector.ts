/**
 * Framework detection for automatic removal detection
 *
 * Detects if current environment has framework lifecycle support
 * to determine if MutationObserver fallback is needed
 */

/**
 * Detect if React 19+ with ref cleanup support
 *
 * @returns true if React 19 or higher is detected
 */
function isReact19OrHigher(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const React = (window as Window & { React: { version: string } }).React;

    const majorVersion = parseInt(React.version.split(".")[0] ?? "0", 10);

    return majorVersion >= 19;
  } catch {
    return false;
  }
}

/**
 * Determine if automatic removal detection should be enabled
 *
 * Rules:
 * - React 19+: Disable (has ref cleanup)
 * - React 18-: Enable (no ref cleanup)
 * - Svelte/Vue: Disable (handled by framework packages)
 * - Vanilla JS: Enable (no lifecycle)
 *
 * @returns true if automatic detection should be enabled
 */
export function shouldAutoDetectRemoval(): boolean {
  // React 19+ has ref cleanup - don't need MutationObserver
  if (isReact19OrHigher()) {
    return false;
  }

  // For React 18- and Vanilla JS, enable automatic detection
  // Other frameworks (Svelte, Vue) are handled by framework-specific packages
  return true;
}

/**
 * Determine if removal detection should be enabled based on config and environment
 *
 * @param globalDisabled - Global disable setting
 * @param perElementOverride - Per-element override setting
 * @returns true if detection should be enabled
 */
export function shouldDetectRemoval(
  globalDisabled: boolean,
  perElementOverride?: boolean,
): boolean {
  // Per-element override takes precedence
  if (perElementOverride !== undefined) {
    return perElementOverride;
  }

  // If globally disabled, respect that
  if (globalDisabled) {
    return false;
  }

  // Auto-detect based on environment
  return shouldAutoDetectRemoval();
}
