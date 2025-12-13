import { type QRL, type NoSerialize } from "@builder.io/qwik";
import { type TransitionConfig, type TransitionScope } from "@ssgoi/core";
type GetTransitionConfig = (
  element: HTMLElement,
) => TransitionConfig | Promise<TransitionConfig>;
export type TransitionProps = {
  /** Transition key for identification (string only in Qwik - symbols can't be serialized) */
  transitionKey?: string;
  /** Transition scope */
  scope?: TransitionScope;
  /** IN transition config function (QRL for direct usage) */
  in$?: QRL<GetTransitionConfig>;
  /** OUT transition config function (QRL for direct usage) */
  out$?: QRL<GetTransitionConfig>;
  /** IN transition config function (noSerialize for context usage) */
  inFn?: NoSerialize<GetTransitionConfig>;
  /** OUT transition config function (noSerialize for context usage) */
  outFn?: NoSerialize<GetTransitionConfig>;
  /** CSS class for the wrapper element */
  class?: string;
};
/**
 * Qwik component wrapper for element transitions
 *
 * Uses useVisibleTask$ internally for SSR-safe transitions.
 * The cleanup callback handles unmount automatically - no watchUnmount needed.
 *
 * @example
 * ```tsx
 * // Direct usage with QRLs
 * <Transition
 *   in$={$((el) => ({
 *     tick: (p) => el.style.opacity = String(p)
 *   }))}
 *   out$={$((el) => ({
 *     tick: (p) => el.style.opacity = String(p)
 *   }))}
 * >
 *   <div>Animated content</div>
 * </Transition>
 *
 * // Usage from context with noSerialize functions
 * <Transition inFn={noSerialize(inConfig)} outFn={noSerialize(outConfig)}>
 *   <div>Animated content</div>
 * </Transition>
 * ```
 */
export declare const Transition: import("@builder.io/qwik").Component<TransitionProps>;
export {};
