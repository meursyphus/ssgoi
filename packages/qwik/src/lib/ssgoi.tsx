import {
  component$,
  Slot,
  useContextProvider,
  useComputed$,
} from "@builder.io/qwik";
import type { SsgoiConfig, SsgoiContext } from "./types";
import { SsgoiContextId } from "./context";
import { createSggoiTransitionContext } from "@ssgoi/core";

interface SsgoiProps {
  config: SsgoiConfig;
}

export const Ssgoi = component$<SsgoiProps>(({ config }) => {
  const contextValue = useComputed$<SsgoiContext>(() =>
    createSggoiTransitionContext(config, {
      // Qwik uses MutationObserver for unmount detection,
      // so OUT and IN can arrive in any order
      outFirst: false,
    }),
  );

  useContextProvider(SsgoiContextId, contextValue.value);

  return <Slot />;
});
