import { createTransitionCallback } from "./create-transition-callback";
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
const transitionDefinitions = new Map<TransitionKey, Transition>();

// Map to store transition callbacks by key
const transitionCallbacks = new Map<TransitionKey, TransitionCallback>();

/**
 * Registers a transition with a key and returns the callback
 * Usage: registerTransition('fade', { in: fadeIn, out: fadeOut })
 */
function registerTransition(
  key: TransitionKey,
  transition: Transition
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
        throw new Error(`Transition "${String(key)}" not found`);
      }
      return trans;
    },
    {
      onCleanupEnd() {
        unregisterTransition(key);
      },
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
 * Usage: <div ref={transition({ key: 'fade', in, out })} />
 */
export function transition(options: {
  key: TransitionKey;
  in?: Transition["in"];
  out?: Transition["out"];
}): TransitionCallback {
  // Register transition and get callback
  return registerTransition(options.key, {
    in: options.in,
    out: options.out,
  });
}
