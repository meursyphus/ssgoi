import { component$, Slot } from "@builder.io/qwik";
import { useSsgoi } from "./context";
import { transition } from "./transition";

interface SsgoiTransitionProps {
  id: string;
}

export const SsgoiTransition = component$<SsgoiTransitionProps>(({ id }) => {
  const getTransition = useSsgoi();

  return (
    <div 
      ref={transition(getTransition(id))} 
      data-ssgoi-transition={id}
    >
      <Slot />
    </div>
  );
});