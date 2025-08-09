import { component$, Slot, useVisibleTask$, useSignal } from "@builder.io/qwik";
import { useSsgoi } from "./context";
import { transition as coreTransition } from "@ssgoi/core";

interface SsgoiTransitionProps {
  id: string;
}

export const SsgoiTransition = component$<SsgoiTransitionProps>(({ id }) => {
  const elementRef = useSignal<HTMLDivElement>();

  useVisibleTask$(() => {
    // No need to track - the ref value won't change after mount
    const element = elementRef.value;
    if (!element) return;

    const getTransition = useSsgoi();
    const transitionConfig = getTransition(id);
    
    if (transitionConfig) {
      const transitionFn = coreTransition({
        key: transitionConfig.key,
        in: transitionConfig.in,
        out: transitionConfig.out,
      });
      transitionFn(element);
    }
  });

  return (
    <div 
      ref={elementRef}
      data-ssgoi-transition={id}
    >
      <Slot />
    </div>
  );
});