import { 
  component$, 
  Slot, 
  useStore, 
  useContextProvider,
  useVisibleTask$,
  noSerialize,
  type NoSerialize
} from "@builder.io/qwik";
import type { SsgoiConfig, SsgoiContext as SsgoiContextType } from "./types";
import { SsgoiContextId } from "./context";
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

interface SsgoiProps {
  config?: SsgoiSerializableConfig;
}

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

export const Ssgoi = component$<SsgoiProps>(({ config }) => {
  const contextStore = useStore<{ 
    context?: NoSerialize<SsgoiContextType>,
    config?: NoSerialize<SsgoiConfig>
  }>({});

  useVisibleTask$(() => {
    // Convert serializable config to real config with functions
    const resolvedConfig: SsgoiConfig = {};
    
    if (config) {
      if (config.defaultTransition) {
        resolvedConfig.defaultTransition = resolveTransition(config.defaultTransition);
      }
      
      if (config.transitions) {
        resolvedConfig.transitions = config.transitions.map(t => ({
          from: t.from,
          to: t.to,
          transition: resolveTransition(t.transition),
          symmetric: t.symmetric
        })).filter(t => t.transition); // Filter out transitions that couldn't be resolved
      }
    }
    
    // Store config wrapped in noSerialize to prevent serialization
    contextStore.config = noSerialize(resolvedConfig);
    
    // Create context on the client side only
    const context = createSggoiTransitionContext(resolvedConfig);
    // Wrap in noSerialize to prevent serialization issues
    contextStore.context = noSerialize(context);
  });

  useContextProvider(SsgoiContextId, contextStore);

  return <Slot />;
});