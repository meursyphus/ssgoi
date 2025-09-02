import { inject, provide, type InjectionKey } from "vue";
import type { SsgoiContext } from "./types";

const SsgoiContextKey: InjectionKey<SsgoiContext> = Symbol("ssgoi-context");

export const provideSsgoi = (context: SsgoiContext) => {
  provide(SsgoiContextKey, context);
};

export const useSsgoi = () => {
  const context = inject(SsgoiContextKey);
  if (!context) {
    throw new Error("useSsgoi must be used within Ssgoi component");
  }
  return context;
};
