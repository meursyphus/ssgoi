import { Slot, component$ } from "@builder.io/qwik";

export interface SsgoiTransitionProps {
  id: string;
  class?: string;
}

/**
 * Marks a subtree as a Ssgoi page boundary.
 *
 * @deprecated Set `data-ssgoi-transition` directly on the page boundary
 * element inside `<Ssgoi>` instead.
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
