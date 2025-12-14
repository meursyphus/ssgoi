"use client";

import {
  transition as _transition,
  type Transition,
  type TransitionKey,
  type TransitionScope,
} from "@ssgoi/core";

type TransitionOptions = Transition<undefined> & {
  key: TransitionKey;
  scope?: TransitionScope;
};

/**
 * React ref callback for element transitions
 *
 * OUT transition is automatically triggered by MutationObserver
 * when the element is removed from the DOM - works with React 18+
 *
 * The returned ref callback has a stable reference (cached by key),
 * so it won't cause unnecessary re-renders when used with React refs.
 *
 * Note: key is optional in the type signature because it can be auto-injected
 * by babel-plugin-ssgoi at build time. However, it is required at runtime.
 *
 * @example
 * ```tsx
 * <div ref={transition({
 *   key: 'fade',
 *   in: (el) => ({ tick: (p) => el.style.opacity = String(p) }),
 *   out: (el) => ({ tick: (p) => el.style.opacity = String(p) }),
 * })} />
 * ```
 */
export const transition = (options: TransitionOptions) => {
  if (!options.key) {
    throw new Error(
      "[ssgoi] transition() requires a 'key' property. " +
        "Either provide it manually or use babel-plugin-ssgoi for auto-injection. " +
        "See: https://ssgoi.dev/docs/babel-plugin",
    );
  }

  return _transition(
    options as TransitionOptions & { key: TransitionKey },
    "auto",
  );
};
