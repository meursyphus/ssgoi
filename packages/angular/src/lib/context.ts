import { InjectionToken, inject } from "@angular/core";
import type { SsgoiContext } from "@ssgoi/core";

export const SSGOI_CONTEXT = new InjectionToken<SsgoiContext | undefined>(
  "ssgoi-context",
);

export function injectSsgoi(): SsgoiContext {
  const context = inject(SSGOI_CONTEXT, { optional: true });

  if (!context) {
    // During SSR or when not wrapped in <ssgoi>, return a no-op context
    // This prevents errors during server-side rendering
    return () => ({
      key: "",
      in: async () => ({}),
      out: async () => ({}),
    });
  }

  return context;
}
