import { createTransitionCallback } from "./create-transition-callback";
import {
  StrategyContext,
  TRANSITION_STRATEGY,
  TransitionStrategy,
} from "./transition-strategy";
import type {
  RefCallback,
  Transition,
  TransitionCallback,
  TransitionMode,
  TransitionOptions,
  TransitionScope,
} from "../types";
import type { TransitionKey } from "../types";
import { parseCallerLocation } from "../utils/parse-caller-location";
import { watchUnmount } from "./unmount-observer";

/**
 * Centralized transition management
 * Uses string/symbol keys for all storage
 */

// Map to store transition definitions by key
const transitionDefinitions = new Map<TransitionKey, Transition<undefined>>();

// Map to store transition callbacks by key (manual mode)
const transitionCallbacks = new Map<TransitionKey, TransitionCallback>();

// Map to store ref callbacks by key (auto mode with MutationObserver)
const refCallbacks = new Map<TransitionKey, RefCallback>();

/**
 * Registers a transition with a key and returns the callback
 */
function registerTransition(
  key: TransitionKey,
  transition: Transition<undefined>,
  options?: {
    strategy?: (context: StrategyContext) => TransitionStrategy;
    scope?: TransitionScope;
  },
): TransitionCallback {
  transitionDefinitions.set(key, transition);

  let callback = transitionCallbacks.get(key);
  if (callback) {
    return callback;
  }

  // Store reference to the transition registered with this callback
  // Used to prevent cleanup from removing a newer transition
  const registeredTransition = transition;

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
      strategy: options?.strategy,
      scope: options?.scope,
      onCleanupEnd: () => {
        // Only unregister if the current transition is still the one we registered
        // This prevents cleanup from removing a newer transition when callbacks are reused
        if (transitionDefinitions.get(key) === registeredTransition) {
          unregisterTransition(key);
        }
      },
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
  refCallbacks.delete(key);
}

// ---------------------------------------------
// Auto key generation
// ---------------------------------------------

// Fallback counter for when stack parsing fails
let __fallbackCounter = 0;

// Track if we've already warned about auto key fallback
let __hasWarnedAboutFallback = false;

export function generateAutoKey(): TransitionKey {
  const stack = new Error().stack;
  const location = parseCallerLocation(stack);

  if (location) {
    const key =
      `auto_${location.file}_${location.line}_${location.column}` as const;
    return key;
  }

  // Fallback: use sequential counter with timestamp prefix for uniqueness across sessions
  // This is more stable than Symbol because it produces consistent string keys
  const fallbackKey = `ssgoi_fallback_${__fallbackCounter++}`;

  // Warn developers about the fallback (only once to avoid spam)
  if (!__hasWarnedAboutFallback) {
    __hasWarnedAboutFallback = true;
    console.warn(
      `[SSGOI] Auto key generation failed - could not parse call location from stack trace.\n` +
        `This may happen in production builds or certain bundler configurations.\n` +
        `For reliable behavior, please provide an explicit 'key' property:\n\n` +
        `  transition({ key: 'my-unique-key', in: ..., out: ... })\n\n` +
        `Using fallback key: "${fallbackKey}"\n` +
        `Stack trace for debugging:\n${stack}`,
    );
  }

  return fallbackKey;
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

type TransitionOptionsWithStrategy = TransitionOptions<undefined> & {
  [TRANSITION_STRATEGY]?: (context: StrategyContext) => TransitionStrategy;
};

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
 * @param options - Transition configuration
 * @param mode - 'manual' (default) returns cleanup, 'auto' handles unmount via MutationObserver
 * @returns Callback function to be used as a ref
 *
 * @example
 * ```tsx
 * // Manual mode (default) - you handle cleanup
 * <div ref={transition({
 *   key: 'hero-fade',
 *   in: (element) => ({ tick: (p) => element.style.opacity = String(p) }),
 *   out: (element) => ({ tick: (p) => element.style.opacity = String(p) }),
 * })} />
 *
 * // Auto mode - automatic unmount detection via MutationObserver
 * <div ref={transition({
 *   key: 'hero-fade',
 *   in: (element) => ({ tick: (p) => element.style.opacity = String(p) }),
 *   out: (element) => ({ tick: (p) => element.style.opacity = String(p) }),
 * }, 'auto')} />
 * ```
 */
export function transition(
  options: TransitionOptionsWithStrategy,
  mode?: "manual",
): TransitionCallback;
export function transition(
  options: TransitionOptionsWithStrategy,
  mode: "auto",
): RefCallback;
export function transition(
  options: TransitionOptionsWithStrategy,
  mode: TransitionMode = "manual",
): TransitionCallback | RefCallback {
  const resolvedKey = options.key || generateAutoKey();

  if (options.ref && __cleanupRegistry) {
    try {
      __cleanupRegistry.register(options.ref, resolvedKey);
    } catch {
      // Ignore registration errors
    }
  }

  const callback = registerTransition(
    resolvedKey,
    {
      in: options.in,
      out: options.out,
    },
    {
      strategy: options[TRANSITION_STRATEGY],
      scope: options.scope,
    },
  );

  if (mode === "manual") {
    return callback;
  }

  // Auto mode: return cached ref callback with MutationObserver integration
  let refCallback = refCallbacks.get(resolvedKey);
  if (refCallback) {
    return refCallback;
  }

  refCallback = (element: HTMLElement | null) => {
    if (element) {
      const cleanup = callback(element);
      if (cleanup) {
        watchUnmount(element, cleanup);
      }
    }
  };

  refCallbacks.set(resolvedKey, refCallback);
  return refCallback;
}
