import { component$, Slot } from "@builder.io/qwik";
import { transition } from "./transition";
import { useSsgoi } from "./context";

type SsgoiTransitionProps = {
  id: string;
  class?: string;
};

export const SsgoiTransition = component$<SsgoiTransitionProps>(
  ({ id, class: className }) => {
    const getTransition = useSsgoi();

    return (
      <div
        ref={transition(getTransition(id))}
        data-ssgoi-transition={id}
        class={className}
      >
        <Slot />
      </div>
    );
  },
);
