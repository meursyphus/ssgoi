import { inject, provide, type ComputedRef, type InjectionKey } from "vue";
import type { SsgoiContext } from "./types";

type SsgoiContextRef = ComputedRef<SsgoiContext>;

const SsgoiContextKey: InjectionKey<SsgoiContextRef> = Symbol("ssgoi-context");

export const provideSsgoi = (context: SsgoiContextRef) => {
  provide(SsgoiContextKey, context);
};

export const useSsgoi = (): SsgoiContextRef => {
  const context = inject(SsgoiContextKey);
  if (!context) {
    throw new Error("useSsgoi must be used within Ssgoi component");
  }
  return context;
};
