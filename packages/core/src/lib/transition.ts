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
} from "./types";
import type { TransitionKey, SequenceConfig } from "./types";

/**
 * Centralized transition management
 * Uses string/symbol keys for all storage
 */

// Map to store transition definitions by key
const transitionDefinitions = new Map<
  TransitionKey,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Transition<undefined, any>
>();

// Map to store transition callbacks by key
const transitionCallbacks = new Map<TransitionKey, TransitionCallback>();

/**
 * Registers a transition with a key and returns the callback
 * Usage: registerTransition('fade', { in: fadeIn, out: fadeOut })
 */
function registerTransition<TAnimationValue = number>(
  key: TransitionKey,
  transition: Transition<undefined, TAnimationValue>,
  strategy?: (
    context: StrategyContext<TAnimationValue>,
  ) => TransitionStrategy<TAnimationValue>,
  additionalOptions?: {
    sequenceConfig?: SequenceConfig;
    baseKey?: string | symbol;
  },
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
      sequenceConfig: additionalOptions?.sequenceConfig,
      baseKey: additionalOptions?.baseKey,
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

/**
 * Simple string hash function for generating stable keys
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Generate a content-based key from transition options
 */
function generateContentKey<TAnimationValue>(
  options: TransitionOptions<undefined, TAnimationValue> & {
    [TRANSITION_STRATEGY]?: (
      context: StrategyContext<TAnimationValue>,
    ) => TransitionStrategy<TAnimationValue>;
  },
): string {
  const parts: string[] = [];

  // Include 'in' function content
  if (options.in) {
    if (typeof options.in === "function") {
      parts.push(`in:${options.in.toString()}`);
    } else {
      parts.push(`in:${JSON.stringify(options.in)}`);
    }
  }

  // Include 'out' function content
  if (options.out) {
    if (typeof options.out === "function") {
      parts.push(`out:${options.out.toString()}`);
    } else {
      parts.push(`out:${JSON.stringify(options.out)}`);
    }
  }

  // Include strategy if present
  if (options[TRANSITION_STRATEGY]) {
    parts.push(`strategy:${options[TRANSITION_STRATEGY].toString()}`);
  }

  const contentString = parts.join("|");
  const hash = simpleHash(contentString);
  return `auto_content_${hash}`;
}

export function generateAutoKey<TAnimationValue>(
  options?: TransitionOptions<undefined, TAnimationValue> & {
    [TRANSITION_STRATEGY]?: (
      context: StrategyContext<TAnimationValue>,
    ) => TransitionStrategy<TAnimationValue>;
  },
): TransitionKey {
  // Primary approach: generate content-based key from transition configuration
  if (options && (options.in || options.out)) {
    const key = generateContentKey(options);
    return key;
  }

  // Fallback: unique symbol for cases without transition configuration
  const key = Symbol(
    `ssgoi_auto_${Date.now()}_${Math.random().toString(36).slice(2)}`,
  );
  return key;
}

// Optional GC-based cleanup registry (browser/node supporting FinalizationRegistry)
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
        /** empty block */
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
export function transition<TAnimationValue = number>(
  options: TransitionOptions<undefined, TAnimationValue> & {
    [TRANSITION_STRATEGY]?: (
      context: StrategyContext<TAnimationValue>,
    ) => TransitionStrategy<TAnimationValue>;
  },
): TransitionCallback {
  const resolvedKey = options.key ?? generateAutoKey(options);
  // Register GC cleanup for auto-generated keys bound to a ref
  if (options.ref && __cleanupRegistry) {
    try {
      __cleanupRegistry.register(options.ref, resolvedKey);
    } catch {
      /** empty block */
    }
  }

  // Check if sequence configuration exists
  const sequenceConfig = getSequenceConfigFromOptions(options);

  // Use registerTransition for both regular and sequence transitions
  return registerTransition(
    resolvedKey,
    {
      in: options.in,
      out: options.out,
    },
    options[TRANSITION_STRATEGY],
    {
      sequenceConfig,
      baseKey: resolvedKey,
    },
  );
}

// ---------------------------------------------
// Sequence support functions
// ---------------------------------------------

/**
 * Extract sequence configuration from transition options
 */
function getSequenceConfigFromOptions<TAnimationValue>(
  options: TransitionOptions<undefined, TAnimationValue>,
): SequenceConfig | undefined {
  // sequence configuration is directly on the options object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (options as any).sequence;
}
