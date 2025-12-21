/**
 * Animate Module
 *
 * Unified animation interface
 * Internally selects appropriate runner based on tick or css option
 */

import { runTickAnimation } from "./tick-runner";
import { runCssAnimation } from "./css-runner";
import { IntegratorProvider, SpringIntegrator } from "../integrator";
import type { AnimationControls, AnimationOptions } from "./types";

export type { AnimationControls, AnimationOptions };

// Default spring config
const DEFAULT_SPRING = { stiffness: 300, damping: 30 };

/**
 * Run spring animation
 *
 * tick option: RAF-based real-time animation
 * css option: Web Animation API based (GPU accelerated)
 *
 * @example
 * ```ts
 * // Tick mode (RAF) with spring config
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
 * // Custom integrator
 * const controls = animate({
 *   from: 0,
 *   to: 1,
 *   integrator: () => new SpringIntegrator({ stiffness: 500, damping: 25 }),
 *   tick: (value) => element.style.opacity = String(value),
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
  const {
    from,
    to,
    spring,
    integrator: integratorFactory,
    velocity,
    onComplete,
    onStart,
    tick,
    css,
  } = options;

  // Validation: tick and css are mutually exclusive
  if (tick && css) {
    throw new Error("Cannot use both 'tick' and 'css' options together");
  }

  // Validation: spring and integrator are mutually exclusive
  if (spring && integratorFactory) {
    throw new Error(
      "Cannot use both 'spring' and 'integrator' options together",
    );
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

  // Create integrator: use factory if provided, otherwise use spring config
  const integrator = integratorFactory
    ? integratorFactory()
    : spring
      ? IntegratorProvider.from(spring)
      : new SpringIntegrator(DEFAULT_SPRING);

  // CSS mode
  if (css) {
    return runCssAnimation({
      integrator,
      element: css.element,
      from,
      to,
      velocity,
      style: css.style,
      onComplete,
      onStart,
    });
  }

  // Tick mode
  return runTickAnimation({
    integrator,
    from,
    to,
    velocity,
    onUpdate: tick!,
    onComplete,
    onStart,
  });
}
