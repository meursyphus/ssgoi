import { 
  createContextId, 
  useContext,
  type Signal
} from "@builder.io/qwik";
import type { SsgoiContext } from "./types";

export const SsgoiContextId = createContextId<Signal<SsgoiContext | undefined>>("ssgoi-context");

export const useSsgoi = () => {
  const contextSignal = useContext(SsgoiContextId);
  const context = contextSignal.value;
  
  if (!context) {
    throw new Error("useSsgoi must be used within a Ssgoi component");
  }
  
  return context;
};

export const SsgoiProvider = SsgoiContextId;