"use client";

import {
  transition as _transition,
  type Transition,
  type TransitionKey,
  type TransitionScope,
} from "@ssgoi/core";

type TransitionOptions = Transition<undefined> & {
  key?: TransitionKey;
  scope?: TransitionScope;
  ref?: object;
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
  return _transition(options, "auto");
};
