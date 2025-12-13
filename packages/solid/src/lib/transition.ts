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
};

/**
 * Solid ref callback for element transitions
 *
 * OUT transition is automatically triggered by MutationObserver
 * when the element is removed from the DOM
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
  const callback = _transition(options);

  // Return ref callback
  // Use MutationObserver to detect unmount and trigger OUT transition
  return (element: HTMLElement | null) => {
    if (element) {
      const cleanup = callback(element);
      if (cleanup) {
        // Register cleanup with MutationObserver for automatic OUT transition
        watchUnmount(element, cleanup);
      }
    }
  };
};
