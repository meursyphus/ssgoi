/**
 * Type definitions for removal detection
 */

/**
 * Configuration for removal detection behavior
 */
export interface RemovalDetectionConfig {
  /**
   * Disable MutationObserver-based removal detection
   * Set to true for manual cleanup only
   *
   * @default false
   */
  disableMutationObserver?: boolean;

  /**
   * Custom MutationObserver configuration
   * Allows fine-tuning of what changes to observe
   *
   * @default { childList: true, subtree: false }
   */
  mutationObserverOptions?: MutationObserverInit;

  /**
   * Throttle delay for mutation callbacks in milliseconds
   * Set to 0 to disable throttling
   *
   * @default 0 (no throttling)
   */
  throttleDelay?: number;
}

/**
 * Strategy for automatic removal detection
 */
export type RemovalDetectionStrategy = "auto" | "always" | "never";
