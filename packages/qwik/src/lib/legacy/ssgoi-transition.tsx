// TODO(8.0.0): remove this entry (deprecated in 7.5.0).
import { Slot, component$ } from "@builder.io/qwik";

/** @deprecated Will be removed in 8.0.0. */
export interface SsgoiTransitionProps {
  id: string;
  class?: string;
}

/**
 * Marks a subtree as a Ssgoi page boundary.
 *
 * @deprecated Will be removed in 8.0.0.
 */
export const SsgoiTransition = component$<SsgoiTransitionProps>(
  ({ id, class: className }) => {
    return (
      <div data-ssgoi-transition={id} class={className}>
        <Slot />
      </div>
    );
  },
);
