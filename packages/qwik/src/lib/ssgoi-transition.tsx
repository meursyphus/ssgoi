import { component$, Slot, useVisibleTask$, useSignal } from "@builder.io/qwik";
import { useSsgoi } from "./context";
import { transition as coreTransition } from "@ssgoi/core";

interface SsgoiTransitionProps {
  id: string;
}

export const SsgoiTransition = component$<SsgoiTransitionProps>(({ id }) => {
  const elementRef = useSignal<HTMLDivElement>();

  useVisibleTask$(({ track }) => {
    const element = track(() => elementRef.value);
    if (!element) return;

    try {
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
    } catch (error) {
      // Context not available yet
      console.warn("SsgoiTransition: Context not available yet", error);
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