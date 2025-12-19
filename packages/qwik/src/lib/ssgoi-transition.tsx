import { component$, Slot, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { useSsgoi } from "./context";
import { transition as _transition, watchUnmount } from "@ssgoi/core";

type SsgoiTransitionProps = {
  id: string;
  class?: string;
};

export const SsgoiTransition = component$<SsgoiTransitionProps>(
  ({ id, class: className }) => {
    const contextSignal = useSsgoi();
    const elementRef = useSignal<HTMLElement>();

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ cleanup }) => {
      const element = elementRef.value;
      const context = contextSignal.value;

      if (!element || !context) return;

      const transitionOptions = context(id);
      const callback = _transition(transitionOptions);
      const cleanupFn = callback(element);

      if (cleanupFn) {
        watchUnmount(element, cleanupFn);
      }

      cleanup(() => {
        cleanupFn?.();
      });
    });

    return (
      <div ref={elementRef} data-ssgoi-transition={id} class={className}>
        <Slot />
      </div>
    );
  },
);
