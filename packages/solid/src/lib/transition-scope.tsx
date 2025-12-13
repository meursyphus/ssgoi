import { onMount, type JSX } from "solid-js";
import { createTransitionScope } from "@ssgoi/core";

type TransitionScopeProps = {
  children: JSX.Element;
};

/**
 * TransitionScope creates a boundary for local-scoped transitions.
 *
 * Child elements with `scope: 'local'` will:
 * - Skip IN animation when mounted simultaneously with the scope
 * - Skip OUT animation when unmounted simultaneously with the scope
 *
 * This is useful for:
 * - Page transitions where child elements shouldn't animate individually
 * - Modal/dialog content that appears/disappears with the container
 * - List items that shouldn't animate when the entire list mounts/unmounts
 *
 * @example
 * ```tsx
 * <TransitionScope>
 *   <div ref={transition(fadeIn(), { scope: 'local' })}>
 *     This will only animate when added/removed independently,
 *     not when the entire scope mounts/unmounts.
 *   </div>
 * </TransitionScope>
 * ```
 */
export function TransitionScope(props: TransitionScopeProps) {
  let container!: HTMLDivElement;

  onMount(() => {
    createTransitionScope()(container);
  });

  return (
    <div ref={container} style={{ display: "contents" }}>
      {props.children}
    </div>
  );
}
