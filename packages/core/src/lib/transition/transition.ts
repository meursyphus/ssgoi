import { createTransitionCallback } from "./create-transition-callback";
import {
  StrategyContext,
  TRANSITION_STRATEGY,
  TransitionStrategy,
} from "./transition-strategy";
import type {
  Transition,
  TransitionCallback,
  TransitionOptions,
} from "../types";
import type { TransitionKey } from "../types";
import { parseCallerLocation } from "../utils/parse-caller-location";

/**
 * Centralized transition management
 * Uses string/symbol keys for all storage
 */

// Map to store transition definitions by key
const transitionDefinitions = new Map<TransitionKey, Transition<undefined>>();

// Map to store transition callbacks by key
const transitionCallbacks = new Map<TransitionKey, TransitionCallback>();

/**
 * Registers a transition with a key and returns the callback
 */
function registerTransition(
  key: TransitionKey,
  transition: Transition<undefined>,
  strategy?: (context: StrategyContext) => TransitionStrategy,
): TransitionCallback {
  transitionDefinitions.set(key, transition);

  let callback = transitionCallbacks.get(key);
  if (callback) {
    return callback;
  }

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
    },
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

// ---------------------------------------------
// Auto key generation
// ---------------------------------------------

export function generateAutoKey(): TransitionKey {
  const location = parseCallerLocation(new Error().stack);
  if (location) {
    const key =
      `auto_${location.file}_${location.line}_${location.column}` as const;
    return key;
  }

  const key = Symbol(`ssgoi_auto_${Date.now()}`);
  return key;
}

// Optional GC-based cleanup registry
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FinalizationRegistryCtor = (globalThis as any).FinalizationRegistry as
  | (new (cb: (heldValue: TransitionKey) => void) => {
      register: (target: object, heldValue: TransitionKey) => void;
    })
  | undefined;
const __cleanupRegistry = FinalizationRegistryCtor
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (new (FinalizationRegistryCtor as any)((key: TransitionKey) => {
      try {
        unregisterTransition(key);
      } catch {
        // Ignore cleanup errors
      }
    }) as { register: (target: object, heldValue: TransitionKey) => void })
  : undefined;

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
 * @returns {TransitionCallback} A callback function to be used as a ref
 *
 * @example
 * ```tsx
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
export function transition(
  options: TransitionOptions<undefined> & {
    [TRANSITION_STRATEGY]?: (context: StrategyContext) => TransitionStrategy;
  },
): TransitionCallback {
  const resolvedKey = options.key ?? generateAutoKey();

  if (options.ref && __cleanupRegistry) {
    try {
      __cleanupRegistry.register(options.ref, resolvedKey);
    } catch {
      // Ignore registration errors
    }
  }

  return registerTransition(
    resolvedKey,
    {
      in: options.in,
      out: options.out,
    },
    options[TRANSITION_STRATEGY],
  );
}
