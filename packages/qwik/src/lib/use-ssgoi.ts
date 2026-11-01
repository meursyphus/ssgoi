import {
  type Signal,
  useComputed$,
  useContextProvider,
  useSignal,
  useStore,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import {
  createSggoiTransitionContext,
  observeSsgoiTransitions,
  resolveLayoutChain,
} from "@ssgoi/core/internal";
import type { SsgoiConfigQrl, SsgoiHostQrl, SsgoiLayoutScope } from "./types";
import { SsgoiTransitionContextId, type SsgoiTransitionStore } from "./context";
import { SsgoiRouteContextId, type SsgoiFramework } from "./layout-boundary";

export interface UseSsgoiOptions {
  config$?: SsgoiConfigQrl;
  host$?: SsgoiHostQrl;
  framework?: SsgoiFramework;
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

  // Only the serialisable layout tree is kept from the config. The task runs
  // before children render, so boundaries see the chain on the server too.
  const location = options.framework?.location;
  const layouts = useSignal<readonly SsgoiLayoutScope[]>();
  useTask$(async () => {
    if (!location || !configQrl) return;
    const config = await (await configQrl.resolve())();
    layouts.value = config.layouts;
  });
  const route = useComputed$(() => {
    const routePath = location?.url.pathname ?? "";
    return { routePath, chain: resolveLayoutChain(layouts.value, routePath) };
  });
  useContextProvider(SsgoiRouteContextId, location ? route : null);

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
