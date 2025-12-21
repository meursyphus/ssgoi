/**
 * Animation Runner common types
 */

import type { Integrator } from "../integrator";

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
 * Animation Options - Low-level runner options
 *
 * Receives pre-created Integrator instance.
 * Use SingleAnimator for higher-level API with spring config.
 */
export interface AnimationOptions {
  integrator: Integrator;
  from: number;
  to: number;
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
