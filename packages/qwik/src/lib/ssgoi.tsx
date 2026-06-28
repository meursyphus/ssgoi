import { Slot, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import {
  createSggoiTransitionContext,
  observeSsgoiTransitions,
} from "@ssgoi/core/internal";
import type { SsgoiConfigQrl, SsgoiHostQrl } from "./types";

export interface SsgoiProps {
  config$?: SsgoiConfigQrl;
  host$?: SsgoiHostQrl;
}

export const Ssgoi = component$<SsgoiProps>(({ config$, host$ }) => {
  const root = useSignal<HTMLElement>();

  useVisibleTask$(
    async ({ cleanup }) => {
      const element = root.value;
      if (!element) return;

      const config = config$ ? await config$() : {};
      const host = host$ ? await host$() : undefined;
      const ssgoi = createSggoiTransitionContext(config, { host });
      const stopObserving = observeSsgoiTransitions(element, ssgoi);

      cleanup(stopObserving);
    },
    { strategy: "document-ready" },
  );

  return (
    <div ref={root} data-ssgoi-root="" style={{ display: "contents" }}>
      <Slot />
    </div>
  );
});
