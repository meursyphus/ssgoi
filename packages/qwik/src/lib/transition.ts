import {
  transition as _transition,
  watchUnmount,
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
 * Qwik ref callback for element transitions
 *
 * OUT transition is automatically triggered by MutationObserver
 * when the element is removed from the DOM - works with Qwik
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
  // Return ref callback
  // Guard against SSR - only run in browser
  return (element: HTMLElement | undefined) => {
    if (typeof window === "undefined" || !element) return;

    const callback = _transition(options);
    const cleanup = callback(element);
    if (cleanup) {
      // Register cleanup with MutationObserver for automatic OUT transition
      watchUnmount(element, cleanup);
    }
  };
};
