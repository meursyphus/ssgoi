import { component$, Slot } from "@builder.io/qwik";
import { useSsgoi } from "./context";
import { TransitionInternal } from "./transition-component";

type SsgoiTransitionProps = {
  id: string;
  class?: string;
};

/**
 * Page-level transition wrapper that gets transition config from Ssgoi context.
 * Passes context signal directly to TransitionInternal for reactive updates.
 */
export const SsgoiTransition = component$<SsgoiTransitionProps>(
  ({ id, class: className }) => {
    const contextSignal = useSsgoi();

    // Pass context signal directly - TransitionInternal will track it internally
    return (
      <TransitionInternal
        transitionKey={id}
        contextSignal={contextSignal}
        pageId={id}
        class={className}
      >
        <Slot />
      </TransitionInternal>
    );
  },
);
