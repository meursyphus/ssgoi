/**
 * Runner Provider
 *
 * Static class that selects appropriate animation runner based on options.
 * Returns bound runner function with mode-specific options pre-applied.
 */

import { runTickAnimation } from "./tick-runner";
import { runCssAnimation } from "./css-runner";
import { runKeyframesAnimation } from "./keyframes-runner";
import type { AnimationControls, StyleObject } from "./types";
import type { Integrator } from "../integrator";

export type RunnerOptions = {
  tick?: (value: number) => void;
  css?: {
    element: HTMLElement;
    style: (progress: number) => StyleObject;
  };
  keyframes?: {
    element: HTMLElement;
    frames: Keyframe[];
    duration: number;
    easing?: string;
  };
};

/**
 * Common options passed to bound runner
 *
 * `integrator` is required for tick/css mode and unused for keyframes mode
 * (which has its motion pre-baked).
 */
export interface BoundRunnerOptions {
  integrator?: Integrator;
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
   * @param options Animation mode options — exactly one of tick / css / keyframes
   * @returns Bound runner function (empty runner if no animation mode specified)
   * @throws Error if more than one mode is provided
   */
  static from(options: RunnerOptions): BoundRunner {
    const { tick, css, keyframes } = options;

    const modeCount = (tick ? 1 : 0) + (css ? 1 : 0) + (keyframes ? 1 : 0);
    if (modeCount > 1) {
      throw new Error(
        "Cannot use more than one of 'tick', 'css', 'keyframes' together",
      );
    }

    if (keyframes) {
      return (commonOpts) =>
        runKeyframesAnimation({
          element: keyframes.element,
          frames: keyframes.frames,
          duration: keyframes.duration,
          easing: keyframes.easing,
          from: commonOpts.from,
          to: commonOpts.to,
          onComplete: commonOpts.onComplete,
          onStart: commonOpts.onStart,
        });
    }

    if (css) {
      return (commonOpts) => {
        if (!commonOpts.integrator) {
          throw new Error("css mode requires an integrator");
        }
        return runCssAnimation({
          integrator: commonOpts.integrator,
          from: commonOpts.from,
          to: commonOpts.to,
          velocity: commonOpts.velocity,
          onComplete: commonOpts.onComplete,
          onStart: commonOpts.onStart,
          element: css.element,
          style: css.style,
        });
      };
    }

    if (tick) {
      return (commonOpts) => {
        if (!commonOpts.integrator) {
          throw new Error("tick mode requires an integrator");
        }
        return runTickAnimation({
          integrator: commonOpts.integrator,
          from: commonOpts.from,
          to: commonOpts.to,
          velocity: commonOpts.velocity,
          onComplete: commonOpts.onComplete,
          onStart: commonOpts.onStart,
          onUpdate: tick,
        });
      };
    }

    return runEmptyAnimation;
  }
}
