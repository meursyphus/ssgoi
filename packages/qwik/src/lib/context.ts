import { createContextId, useContext } from "@builder.io/qwik";
import type { SsgoiContext } from "./types";

export const SsgoiContextId = createContextId<SsgoiContext>("ssgoi-context");

export const useSsgoi = () => {
  const context = useContext(SsgoiContextId);
  if (!context) {
    throw new Error("useSsgoi must be used within Ssgoi component");
  }
  return context;
};
