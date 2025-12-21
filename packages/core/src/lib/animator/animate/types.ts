/**
 * Animation Runner common types
 */

import type { SpringConfig } from "../../types";

/**
 * CSS style object type
 */
export type StyleObject = Record<string, number | string>;

/**
 * Animation Controls - Common interface for both tick-runner and css-runner
 */
export interface AnimationControls {
  stop: () => void;
  getPosition: () => number;
  getVelocity: () => number;
  isRunning: () => boolean;
}

/**
 * Animation Options - Unified options
 */
export interface AnimationOptions {
  from: number;
  to: number;
  spring: SpringConfig;
  velocity?: number;
  onComplete: () => void;
  onStart?: () => void;

  // Use only one of these
  tick?: (value: number) => void;
  css?: {
    element: HTMLElement;
    style: (progress: number) => StyleObject;
  };
}
