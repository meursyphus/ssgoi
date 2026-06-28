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
  options: UseSsgoiOptions = {},
) => {
  const configQrl = options.config$;
  const hostQrl = options.host$;

  useVisibleTask$(
    async ({ cleanup, track }) => {
      const element = track(() => root.value);
      if (!element) return;

      const configFactory = configQrl ? await configQrl.resolve() : undefined;
      const hostFactory = hostQrl ? await hostQrl.resolve() : undefined;
      const config = configFactory ? await configFactory() : {};
      const host = hostFactory ? await hostFactory() : undefined;
      const ssgoi = createSggoiTransitionContext(config, { host });
      const stopObserving = observeSsgoiTransitions(element, ssgoi);

      cleanup(stopObserving);
    },
    { strategy: "document-ready" },
  );
};
