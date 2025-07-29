import { createTransitionCallback } from "./create-transition-callback";
import { singletonFactory } from "./singleton";
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
type TransitionAndCallback = {
  transition?: Transition;
  callback?: TransitionCallback;
}

/**
 * Registers a transition with a key and returns the callback
 * Usage: registerTransition('fade', { in: fadeIn, out: fadeOut })
 */
function registerTransition(
  key: TransitionKey,
  transition: Transition,
  strategy?: (context: StrategyContext) => TransitionStrategy
): TransitionCallback {
  const [getTransitionAndCallback, removeTransitionAndCallback] = singletonFactory<TransitionKey, TransitionAndCallback>(key, { transition });

  // Return existing callback if it exists
  const transitionAndCallback = getTransitionAndCallback();
  let callback = transitionAndCallback?.callback;
  if (callback) {
    return callback;
  }

  // Create new callback
  callback = createTransitionCallback(
    () => {
      const trans = getTransitionAndCallback()?.transition;
      if (!trans) {
        console.warn(`Transition "${String(key)}" not found`);
        return {};
      }
      return trans;
    },
    {
      strategy,
      onCleanupEnd: () => removeTransitionAndCallback(),
    }
  );

  if (transitionAndCallback) {
    transitionAndCallback.callback = callback;
  }
  
  return callback;
}

/**
 * Framework-agnostic transition function that can be used as a ref
 * Usage: <div ref={transition({ key: 'fade', in, out })} />
 */
export function transition(options: {
  key: TransitionKey;
  in?: Transition["in"];
  out?: Transition["out"];
  [TRANSITION_STRATEGY]?: (context: StrategyContext) => TransitionStrategy;
}): TransitionCallback {
  // Register transition and get callback
  return registerTransition(options.key, {
    in: options.in,
    out: options.out,
  });
}
