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
 * Registers a transition with a key
 * Usage: registerTransition('fade', { in: fadeIn, out: fadeOut })
 */
export function registerTransition(
  key: TransitionKey,
  transition: Transition
): void {
  transitionDefinitions.set(key, transition);

  // Create callback only if it doesn't exist yet
  if (!transitionCallbacks.has(key)) {
    const callback = createTransitionCallback(
      () => {
        const trans = transitionDefinitions.get(key);
        if (!trans) {
          throw new Error(`Transition "${String(key)}" not found`);
        }
        return trans;
      },
      {
        onCleanupEnd() {
          transitionCallbacks.delete(key);
        },
      }
    );
    transitionCallbacks.set(key, callback);
  }
}

/**
 * Unregisters a transition and cleans up associated resources
 */
export function unregisterTransition(key: TransitionKey): void {
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
}) {
  // Register transition if in/out provided
  if (options.in || options.out) {
    const existingTransition = transitionDefinitions.get(options.key);
    registerTransition(options.key, {
      in: options.in || existingTransition?.in,
      out: options.out || existingTransition?.out,
    });
  }

  return (element: HTMLElement | null) => {
    // Apply transition if element exists
    if (element) {
      const callback = transitionCallbacks.get(options.key);
      if (!callback) {
        throw new Error(
          `Transition "${String(options.key)}" not registered. Call registerTransition first.`
        );
      }

      // The callback handles its own cleanup when element unmounts
      return callback(element);
    }
  };
}
