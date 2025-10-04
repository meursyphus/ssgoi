import {
  Component,
  input,
  ChangeDetectionStrategy,
  forwardRef,
} from "@angular/core";
import { createSggoiTransitionContext } from "@ssgoi/core";
import type { SsgoiConfig, SsgoiContext } from "@ssgoi/core";
import { SSGOI_CONTEXT } from "./context";

function createSsgoiContext(component: Ssgoi): SsgoiContext {
  return createSggoiTransitionContext(component.config());
}

@Component({
  selector: "ssgoi",
  template: "<ng-content />",
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  readonly config = input.required<SsgoiConfig>();
}
