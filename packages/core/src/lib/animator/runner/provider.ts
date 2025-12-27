/**
 * Runner Provider
 *
 * Static class that selects appropriate animation runner based on options.
 * Returns bound runner function with mode-specific options pre-applied.
 */

import { runTickAnimation } from "./tick-runner";
import { runCssAnimation } from "./css-runner";
import type { AnimationControls, StyleObject } from "./types";
import type { Integrator } from "../integrator";

export type RunnerOptions = {
  tick?: (value: number) => void;
  css?: {
    element: HTMLElement;
    style: (progress: number) => StyleObject;
  };
};

/**
 * Common options passed to bound runner
 */
export interface BoundRunnerOptions {
  integrator: Integrator;
  from: number;
  to: number;
  velocity?: number;
  onComplete: () => void;
  onStart?: () => void;
}

/**
 * Bound runner - mode-specific options already applied
 */
export type BoundRunner = (options: BoundRunnerOptions) => AnimationControls;

/**
 * Empty runner for when no animation mode is specified
 * Calls onStart/onComplete immediately without any animation frames
 */
function runEmptyAnimation(options: BoundRunnerOptions): AnimationControls {
  const { to, onStart, onComplete } = options;

  // Call lifecycle hooks immediately
  onStart?.();
  onComplete();

  return {
    stop: () => {},
    getPosition: () => to,
    getVelocity: () => 0,
    isRunning: () => false,
  };
}

export class RunnerProvider {
  /**
   * Get bound runner based on animation mode
   *
   * @param options Animation mode options (tick or css)
   * @returns Bound runner function (empty runner if no animation mode specified)
   * @throws Error if both tick and css are provided
   */
  static from(options: RunnerOptions): BoundRunner {
    const { tick, css } = options;

    if (tick && css) {
      throw new Error("Cannot use both 'tick' and 'css' options together");
    }

    if (css) {
      return (commonOpts) =>
        runCssAnimation({
          ...commonOpts,
          element: css.element,
          style: css.style,
        });
    }

    if (tick) {
      return (commonOpts) =>
        runTickAnimation({
          ...commonOpts,
          onUpdate: tick,
        });
    }

    return runEmptyAnimation;
  }
}
