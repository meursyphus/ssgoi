import { 
  createContextId, 
  useContext,
  useContextProvider,
  useStore,
  noSerialize,
  type NoSerialize
} from "@builder.io/qwik";
import type { SsgoiContext, SsgoiConfig } from "./types";
import { createSggoiTransitionContext } from "@ssgoi/core";
import * as viewTransitions from "./view-transitions";
import * as transitions from "./transitions";

// Serializable config structure
export interface SsgoiSerializableConfig {
  defaultTransition?: {
    type: string;
    options?: Record<string, any>;
  };
  transitions?: Array<{
    from: string;
    to: string;
    transition: {
      type: string;
      options?: Record<string, any>;
    };
    symmetric?: boolean;
  }>;
}

export const SsgoiContextId = createContextId<{ 
  context?: NoSerialize<SsgoiContext>,
  config?: NoSerialize<SsgoiConfig>,
  serializableConfig?: SsgoiSerializableConfig
}>("ssgoi-context");

// Helper to resolve transition functions from type strings
const resolveTransition = (transition: { type: string; options?: any }) => {
  // Check view-transitions first
  const viewTransition = (viewTransitions as any)[transition.type];
  if (viewTransition) {
    return viewTransition(transition.options || {});
  }
  
  // Check regular transitions
  const regularTransition = (transitions as any)[transition.type];
  if (regularTransition) {
    return regularTransition(transition.options || {});
  }
  
  console.warn(`Unknown transition type: ${transition.type}`);
  return undefined;
};

export const useSsgoi = () => {
  const contextStore = useContext(SsgoiContextId);
  
  // Lazy resolution of transitions
  if (!contextStore.context && contextStore.serializableConfig) {
    const config = contextStore.serializableConfig;
    const resolvedConfig: SsgoiConfig = {};
    
    if (config.defaultTransition) {
      resolvedConfig.defaultTransition = resolveTransition(config.defaultTransition);
    }
    
    if (config.transitions) {
      resolvedConfig.transitions = config.transitions.map(t => ({
        from: t.from,
        to: t.to,
        transition: resolveTransition(t.transition),
        symmetric: t.symmetric
      })).filter(t => t.transition);
    }
    
    contextStore.config = noSerialize(resolvedConfig);
    contextStore.context = noSerialize(createSggoiTransitionContext(resolvedConfig));
  }
  
  const context = contextStore.context;
  
  if (!context) {
    throw new Error("useSsgoi must be used within a Ssgoi provider");
  }
  
  return context;
};

export const useSsgoiProvider = (config?: SsgoiSerializableConfig) => {
  const contextStore = useStore<{ 
    context?: NoSerialize<SsgoiContext>,
    config?: NoSerialize<SsgoiConfig>,
    serializableConfig?: SsgoiSerializableConfig
  }>({ serializableConfig: config });
  
  useContextProvider(SsgoiContextId, contextStore);
};