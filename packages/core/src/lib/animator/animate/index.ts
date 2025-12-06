/**
 * Animate Module
 *
 * Unified animation interface
 * Internally selects appropriate runner based on tick or css option
 */

import { runTickAnimation } from "./tick-runner";
import { runCssAnimation } from "./css-runner";
import type { AnimationControls, AnimationOptions } from "./types";

export type { AnimationControls, AnimationOptions };

/**
 * Run spring animation
 *
 * tick option: RAF-based real-time animation
 * css option: Web Animation API based (GPU accelerated)
 *
 * @example
 * ```ts
 * // Tick mode (RAF)
 * const controls = animate({
 *   from: 0,
 *   to: 1,
 *   spring: { stiffness: 300, damping: 30 },
 *   tick: (value) => element.style.opacity = String(value),
 *   onComplete: () => console.log('done'),
 * });
 *
 * // CSS mode (Web Animation API)
 * const controls = animate({
 *   from: 0,
 *   to: 1,
 *   spring: { stiffness: 300, damping: 30 },
 *   css: {
 *     element: myElement,
 *     style: (progress) => ({
 *       opacity: String(progress),
 *       transform: `scale(${0.5 + 0.5 * progress})`,
 *     }),
 *   },
 *   onComplete: () => console.log('done'),
 * });
 *
 * // Stop mid-animation and check state
 * controls.stop();
 * console.log(controls.getPosition()); // Current position
 * console.log(controls.getVelocity()); // Current velocity
 * ```
 */
export function animate(options: AnimationOptions): AnimationControls {
  const { from, to, spring, velocity, onComplete, onStart, tick, css } =
    options;

  // Validation
  if (tick && css) {
    throw new Error("Cannot use both 'tick' and 'css' options together");
  }

  // No animation mode - complete immediately
  if (!tick && !css) {
    onStart?.();
    onComplete();
    return {
      stop: () => {},
      getPosition: () => to,
      getVelocity: () => 0,
      isRunning: () => false,
    };
  }

  // CSS mode
  if (css) {
    return runCssAnimation({
      element: css.element,
      from,
      to,
      spring,
      velocity,
      style: css.style,
      onComplete,
      onStart,
    });
  }

  // Tick mode
  return runTickAnimation({
    from,
    to,
    spring,
    velocity,
    onUpdate: tick!,
    onComplete,
    onStart,
  });
}
