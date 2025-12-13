import { component$, Slot, noSerialize, useComputed$ } from "@builder.io/qwik";
import { useSsgoi } from "./context";
import { Transition } from "./transition-component";

type SsgoiTransitionProps = {
  id: string;
  class?: string;
};

/**
 * Page-level transition wrapper that gets transition config from Ssgoi context.
 * Uses Transition component internally with noSerialize functions.
 */
export const SsgoiTransition = component$<SsgoiTransitionProps>(
  ({ id, class: className }) => {
    const contextSignal = useSsgoi();

    // Compute transition functions from context
    const transitionFns = useComputed$(() => {
      const context = contextSignal.value;
      if (!context) return { inFn: undefined, outFn: undefined };

      const options = context(id);
      return {
        inFn: options.in ? noSerialize(options.in) : undefined,
        outFn: options.out ? noSerialize(options.out) : undefined,
      };
    });

    return (
      <Transition
        transitionKey={id}
        inFn={transitionFns.value.inFn}
        outFn={transitionFns.value.outFn}
        class={className}
      >
        <Slot />
      </Transition>
    );
  },
);
