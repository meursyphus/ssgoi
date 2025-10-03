import {
  Component,
  input,
  ChangeDetectionStrategy,
  forwardRef,
} from "@angular/core";
import { createSggoiTransitionContext } from "@ssgoi/core";
import type { SsgoiConfig } from "@ssgoi/core";
import { SSGOI_CONTEXT } from "./context";

@Component({
  selector: "ssgoi",
  template: "<ng-content />",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [
    {
      provide: SSGOI_CONTEXT,
      useFactory: (component: Ssgoi) =>
        createSggoiTransitionContext(component.config()),
      deps: [forwardRef(() => Ssgoi)],
    },
  ],
})
export class Ssgoi {
  config = input.required<SsgoiConfig>();
}
