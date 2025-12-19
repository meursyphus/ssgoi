import {
  component$,
  Slot,
  useContextProvider,
  useSignal,
  useVisibleTask$,
  noSerialize,
  type NoSerialize,
} from "@builder.io/qwik";
import type { SsgoiConfig, SsgoiContext } from "./types";
import { SsgoiContextId } from "./context";
import { createSggoiTransitionContext } from "@ssgoi/core";

interface SsgoiProps {
  config: NoSerialize<SsgoiConfig>;
}

export const Ssgoi = component$<SsgoiProps>(({ config }) => {
  const contextValue = useSignal<NoSerialize<SsgoiContext> | null>(null);

  useContextProvider(SsgoiContextId, contextValue);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(
    () => {
      if (config) {
        contextValue.value = noSerialize(
          createSggoiTransitionContext(config, {
            // Qwik uses MutationObserver for unmount detection,
            // so OUT and IN can arrive in any order
            outFirst: false,
          }),
        );
      }
    },
    { strategy: "document-ready" },
  );

  return <Slot />;
});
