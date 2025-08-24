import { createTransitionCallback } from "./create-transition-callback";
import {
  StrategyContext,
  TRANSITION_STRATEGY,
  TransitionStrategy,
} from "./transition-strategy";
import type { Transition, TransitionCallback } from "./types";

/**
 * Key type for transitions - can be string or symbol
 */
type TransitionKey = string | symbol;

/**
 * Centralized transition management
 * Uses string/symbol keys for all storage
 */

// Map to store transition definitions by key
const transitionDefinitions = new Map<TransitionKey, Transition<any, any>>();

// Map to store transition callbacks by key
const transitionCallbacks = new Map<TransitionKey, TransitionCallback>();

/**
 * Registers a transition with a key and returns the callback
 * Usage: registerTransition('fade', { in: fadeIn, out: fadeOut })
 */
function registerTransition<TAnimationValue = number>(
  key: TransitionKey,
  transition: Transition<undefined, TAnimationValue>,
  strategy?: (context: StrategyContext<TAnimationValue>) => TransitionStrategy<TAnimationValue>
): TransitionCallback {
  transitionDefinitions.set(key, transition);

  // Return existing callback if it exists
  let callback = transitionCallbacks.get(key);
  if (callback) {
    return callback;
  }

  // Create new callback
  callback = createTransitionCallback(
    () => {
      const trans = transitionDefinitions.get(key);
      if (!trans) {
        console.warn(`Transition "${String(key)}" not found`);
        return {};
      }
      return trans;
    },
    {
      strategy,
      onCleanupEnd: () => unregisterTransition(key),
    }
  );
  transitionCallbacks.set(key, callback);
  return callback;
}

/**
 * Unregisters a transition and cleans up associated resources
 */
function unregisterTransition(key: TransitionKey): void {
  transitionDefinitions.delete(key);
  transitionCallbacks.delete(key);
}

/**
 * Framework-agnostic transition function that can be used as a ref
 * 
 * @description
 * Creates a transition that can be attached to DOM elements via ref.
 * Manages entrance and exit animations with a complete lifecycle system.
 * 
 * **IN Animation Lifecycle (Element Entering):**
 * 1. `prepare` - Setup element's initial state (e.g., opacity: 0)
 * 2. `wait` - Optional async delay before animation starts
 * 3. `onStart` - Called when animation begins
 * 4. `tick` - Called on each animation frame with progress value (0 → 1)
 * 5. `onEnd` - Called when animation completes
 * 
 * **OUT Animation Lifecycle (Element Exiting):**
 * 1. `prepare` - Setup element's initial state for exit
 * 2. `wait` - Optional async delay before animation starts
 * 3. `onStart` - Called when animation begins
 * 4. `tick` - Called on each animation frame with progress value (1 → 0)
 * 5. `onEnd` - Called when animation completes and element is removed
 * 
 * The `key` parameter is crucial for transition management - it uniquely identifies
 * each transition instance, allowing the system to track, cleanup, and prevent
 * conflicts between multiple transitions on the same element.
 * 
 * @param {object} options - Configuration object
 * @param {TransitionKey} options.key - Unique identifier for this transition instance.
 *                                      Can be string or symbol. Used to manage and cleanup
 *                                      transitions internally.
 * @param {Function} options.in - Configuration for entrance animation.
 *                                Returns TransitionConfig with lifecycle hooks.
 * @param {Function} options.out - Configuration for exit animation.
 *                                 Returns TransitionConfig with lifecycle hooks.
 * 
 * @template TAnimationValue - The type of value being animated (number | object)
 * 
 * @returns {TransitionCallback} A callback function to be used as a ref
 * 
 * @example
 * ```tsx
 * // Simple fade transition
 * <div ref={transition({
 *   key: 'hero-fade',
 *   in: (element) => ({
 *     prepare: (el) => el.style.opacity = '0',
 *     tick: (progress) => el.style.opacity = progress.toString(),
 *   }),
 *   out: (element) => ({
 *     tick: (progress) => el.style.opacity = progress.toString(),
 *   })
 * })} />
 * ```
 */
export function transition<TAnimationValue = number>(options: {
  key: TransitionKey;
  in?: Transition<undefined, TAnimationValue>["in"];
  out?: Transition<undefined, TAnimationValue>["out"];
  [TRANSITION_STRATEGY]?: (context: StrategyContext<TAnimationValue>) => TransitionStrategy<TAnimationValue>;
}): TransitionCallback {
  // Register transition and get callback
  return registerTransition(options.key, {
    in: options.in,
    out: options.out,
  }, options[TRANSITION_STRATEGY]);
}
