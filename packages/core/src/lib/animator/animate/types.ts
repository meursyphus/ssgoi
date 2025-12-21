/**
 * Animation Runner common types
 */

import type { SpringConfig, IntegratorFactory } from "../../types";

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
 *
 * Must provide either `spring` or `integrator` (not both)
 */
export interface AnimationOptions {
  from: number;
  to: number;
  velocity?: number;
  onComplete: () => void;
  onStart?: () => void;

  /**
   * Spring physics configuration
   * Cannot be used together with integrator option
   */
  spring?: SpringConfig;

  /**
   * Custom integrator factory function
   * When provided, uses this instead of spring config
   * Cannot be used together with spring option
   */
  integrator?: IntegratorFactory;

  // Use only one of these
  tick?: (value: number) => void;
  css?: {
    element: HTMLElement;
    style: (progress: number) => StyleObject;
  };
}
