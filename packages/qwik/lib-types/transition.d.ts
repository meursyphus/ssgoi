import {
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
export declare const transition: (
  options: TransitionOptions,
) => (element: HTMLElement | undefined) => void;
export {};
