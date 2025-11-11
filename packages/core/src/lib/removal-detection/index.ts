/**
 * DOM Element Removal Detection
 *
 * Automatically detects when elements are removed from the DOM
 * and triggers exit animations without framework lifecycle support.
 *
 * @module removal-detection
 */

export { RemovalDetector, globalRemovalDetector } from "./removal-detector";
export {
  configureRemovalDetection,
  getRemovalDetectionConfig,
  resetRemovalDetectionConfig,
} from "./config";
export {
  shouldAutoDetectRemoval,
  shouldDetectRemoval,
} from "./framework-detector";
export type { RemovalDetectionConfig, RemovalDetectionStrategy } from "./types";
