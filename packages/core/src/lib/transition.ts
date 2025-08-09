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
type TransitionAndCallback<TAnimationValue> = {
  transition?: Transition<undefined, TAnimationValue>;
  callback?: TransitionCallback;
}

/**
 * Registers a transition with a key and returns the callback
 * Usage: registerTransition('fade', { in: fadeIn, out: fadeOut })
 */
function registerTransition<TAnimationValue = number>(
  key: TransitionKey,
  transition: Transition<undefined, TAnimationValue>,
  strategy?: (context: StrategyContext<TAnimationValue>) => TransitionStrategy<TAnimationValue>
): TransitionCallback {
  const [getTransitionAndCallback, removeTransitionAndCallback] = singletonFactory<TransitionKey, TransitionAndCallback<TAnimationValue>>(key, { transition });

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
 * 
 * @template TAnimationValue - The type of value being animated (number | object)
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
