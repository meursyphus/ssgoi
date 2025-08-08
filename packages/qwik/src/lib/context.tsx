import { 
  createContextId, 
  useContext
} from "@builder.io/qwik";
import type { SsgoiContext, SsgoiConfig } from "./types";

export const SsgoiContextId = createContextId<{ 
  context?: SsgoiContext,
  config?: SsgoiConfig 
}>("ssgoi-context");

export const useSsgoi = () => {
  const contextStore = useContext(SsgoiContextId);
  const context = contextStore.context;
  
  if (!context) {
    throw new Error("useSsgoi must be used within a Ssgoi component");
  }
  
  return context;
};

export const SsgoiProvider = SsgoiContextId;