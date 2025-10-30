import {
  Directive,
  input,
  forwardRef,
  PLATFORM_ID,
  inject,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { createSggoiTransitionContext } from "@ssgoi/core";
import type { SsgoiConfig, SsgoiContext } from "@ssgoi/core";
import { SSGOI_CONTEXT } from "./context";

function createSsgoiContext(component: Ssgoi): SsgoiContext | undefined {
  const platformId = inject(PLATFORM_ID);

  // Only create context in browser environment
  if (!isPlatformBrowser(platformId)) {
    // Return a no-op context for SSR
    return undefined;
  }
  return createSggoiTransitionContext(component.config());
}

@Directive({
  selector: "[ssgoi]",
  standalone: true,
  providers: [
    {
      provide: SSGOI_CONTEXT,
      useFactory: createSsgoiContext,
      deps: [forwardRef(() => Ssgoi)],
    },
  ],
})
export class Ssgoi {
  readonly config = input<SsgoiConfig>({});
}
