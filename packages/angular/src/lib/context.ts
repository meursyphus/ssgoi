import { InjectionToken, inject } from "@angular/core";
import type { SsgoiContext } from "@ssgoi/core";

export const SSGOI_CONTEXT = new InjectionToken<SsgoiContext | undefined>(
  "ssgoi-context",
);

export function injectSsgoi(): SsgoiContext {
  const context = inject(SSGOI_CONTEXT, { optional: true });
  if (!context) {
    throw new Error("injectSsgoi must be used within Ssgoi");
  }
  return context;
}
