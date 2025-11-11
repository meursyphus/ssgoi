/**
 * Global configuration for removal detection
 *
 * Based on patterns from:
 * - AOS (Animate On Scroll) - disableMutationObserver option
 * - Alpine.js - mutationObserverOptions customization
 */

import type { RemovalDetectionConfig } from "./types";

/**
 * Default configuration
 */
const defaultConfig: Required<RemovalDetectionConfig> = {
  disableMutationObserver: false,
  mutationObserverOptions: {
    childList: true,
    subtree: false,
  },
  throttleDelay: 0, // No throttling by default
};

/**
 * Global configuration state
 */
let globalConfig: Required<RemovalDetectionConfig> = { ...defaultConfig };

/**
 * Configure removal detection globally
 *
 * @param config - Partial configuration to merge with defaults
 *
 * @example
 * ```ts
 * // Disable for performance
 * configureRemovalDetection({
 *   disableMutationObserver: true
 * });
 *
 * // Custom observer options
 * configureRemovalDetection({
 *   mutationObserverOptions: {
 *     childList: true,
 *     subtree: true,  // Also watch nested children
 *     attributes: false
 *   }
 * });
 * ```
 */
export function configureRemovalDetection(
  config: Partial<RemovalDetectionConfig>,
): void {
  globalConfig = {
    ...globalConfig,
    ...config,
    // Merge mutationObserverOptions if provided
    mutationObserverOptions: config.mutationObserverOptions
      ? {
          ...globalConfig.mutationObserverOptions,
          ...config.mutationObserverOptions,
        }
      : globalConfig.mutationObserverOptions,
  };
}

/**
 * Get current global configuration
 *
 * @returns Current configuration (readonly copy)
 */
export function getRemovalDetectionConfig(): Readonly<
  Required<RemovalDetectionConfig>
> {
  return { ...globalConfig };
}

/**
 * Reset configuration to defaults
 */
export function resetRemovalDetectionConfig(): void {
  globalConfig = { ...defaultConfig };
}
