import {
  type Signal,
  useContextProvider,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";
import {
  createSggoiTransitionContext,
  observeSsgoiTransitions,
} from "@ssgoi/core/internal";
import type { SsgoiConfigQrl, SsgoiHostQrl } from "./types";
import { SsgoiTransitionContextId, type SsgoiTransitionStore } from "./context";

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

  const transition = useStore<SsgoiTransitionStore>({
    status: "idle",
    from: null,
    to: null,
    direction: null,
  });
  useContextProvider(SsgoiTransitionContextId, transition);

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
      const stopListening = ssgoi.subscribe((state) => {
        transition.status = state.status;
        transition.from = state.from;
        transition.to = state.to;
        transition.direction = state.direction;
      });

      cleanup(() => {
        stopListening();
        stopObserving();
      });
    },
    { strategy: "document-ready" },
  );
};
