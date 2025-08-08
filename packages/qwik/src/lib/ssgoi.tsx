import { 
  component$, 
  Slot, 
  useSignal, 
  useContextProvider,
  useTask$
} from "@builder.io/qwik";
import type { SsgoiConfig, SsgoiContext as SsgoiContextType } from "./types";
import { SsgoiContextId } from "./context";
import { createSggoiTransitionContext } from "@ssgoi/core";

interface SsgoiProps {
  config: SsgoiConfig;
}

export const Ssgoi = component$<SsgoiProps>(({ config }) => {
  const contextSignal = useSignal<SsgoiContextType | undefined>();

  useTask$(() => {
    contextSignal.value = createSggoiTransitionContext(config);
  });

  useContextProvider(SsgoiContextId, contextSignal);

  return <Slot />;
});