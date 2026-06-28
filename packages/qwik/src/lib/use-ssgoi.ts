import { type Signal, useVisibleTask$ } from "@builder.io/qwik";
import {
  createSggoiTransitionContext,
  observeSsgoiTransitions,
} from "@ssgoi/core/internal";
import type { SsgoiConfigQrl, SsgoiHostQrl } from "./types";

export interface UseSsgoiOptions {
  config$?: SsgoiConfigQrl;
  host$?: SsgoiHostQrl;
}

export const useSsgoi = (
  root: Signal<HTMLElement | undefined>,
  { config$, host$ }: UseSsgoiOptions = {},
) => {
  useVisibleTask$(
    async ({ cleanup, track }) => {
      const element = track(() => root.value);
      if (!element) return;

      const config = config$ ? await config$() : {};
      const host = host$ ? await host$() : undefined;
      const ssgoi = createSggoiTransitionContext(config, { host });
      const stopObserving = observeSsgoiTransitions(element, ssgoi);

      cleanup(stopObserving);
    },
    { strategy: "document-ready" },
  );
};
