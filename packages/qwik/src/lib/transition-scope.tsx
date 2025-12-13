import { component$, Slot } from "@builder.io/qwik";
import { createTransitionScope } from "@ssgoi/core";

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
export const TransitionScope = component$(() => {
  return (
    <div ref={createTransitionScope()} style={{ display: "contents" }}>
      <Slot />
    </div>
  );
});
