import { getContext, setContext } from "svelte";
import type { SsgoiContext } from "./types.js";

const SSGOI_CONTEXT_KEY = Symbol("ssgoi");

export function setSsgoiContext(context: SsgoiContext) {
  setContext(SSGOI_CONTEXT_KEY, context);
}

export function getSsgoiContext(): SsgoiContext {
  const context = getContext<SsgoiContext>(SSGOI_CONTEXT_KEY);
  if (!context) {
    throw new Error("getSsgoiContext must be called within Ssgoi component");
  }
  return context;
}
