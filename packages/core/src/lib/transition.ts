import { createTransitionCallback } from "./create-transition-callback";
import { StrategyContext, TRANSITION_STRATEGY, TransitionStrategy } from "./transition-strategy";
import type { Transition, TransitionCallback, TransitionOptions } from "./types";
import type { TransitionKey } from "./types";
import { parseCallerLocation } from "./utils";

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

// ---------------------------------------------
// Auto key generation
// ---------------------------------------------


export function generateAutoKey(): TransitionKey {

  // Fallback to a stable key from the callsite when available
  const location = parseCallerLocation(new Error().stack);
  if (location) {
    const key = `auto_${location.file}_${location.line}_${location.column}` as const;
    return key;
  }

  // Fallback to a unique symbol when callsite is unavailable
  const key = Symbol(`ssgoi_auto_${Date.now()}`);
  return key;
}

// Optional GC-based cleanup registry (browser/node supporting FinalizationRegistry)
const FinalizationRegistryCtor = (globalThis as any).FinalizationRegistry as
  | (new (cb: (heldValue: TransitionKey) => void) => { register: (target: object, heldValue: TransitionKey) => void })
  | undefined;
const __cleanupRegistry = FinalizationRegistryCtor
  ? (new (FinalizationRegistryCtor as any)((key: TransitionKey) => {
      try {
        unregisterTransition(key);
      } catch {}
    }) as { register: (target: object, heldValue: TransitionKey) => void })
  : undefined;

/**
 * Framework-agnostic transition function that can be used as a ref
 * Usage: <div ref={transition({ key: 'fade', in, out })} />
 *
 * @template TAnimationValue - The type of value being animated (number | object)
 */
export function transition<TAnimationValue = number>(
  options: TransitionOptions<undefined, TAnimationValue> & {
    [TRANSITION_STRATEGY]?: (context: StrategyContext<TAnimationValue>) => TransitionStrategy<TAnimationValue>;
  }
): TransitionCallback {
  const resolvedKey = options.key ?? generateAutoKey();


  // Register GC cleanup for auto-generated keys bound to a ref
  if (options.ref && __cleanupRegistry) {
    try {
      __cleanupRegistry.register(options.ref, resolvedKey);
    } catch {}
  }

  return registerTransition(
    resolvedKey,
    {
      in: options.in,
      out: options.out,
    },
    options[TRANSITION_STRATEGY]
  );
}
