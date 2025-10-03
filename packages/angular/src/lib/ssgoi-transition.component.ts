import { Component, input, ChangeDetectionStrategy } from "@angular/core";
import { SsgoiTransitionDirective } from "./transition.directive";

@Component({
  selector: "ssgoi-transition",
  imports: [SsgoiTransitionDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [ssgoiTransition]="id()"
      [attr.data-ssgoi-transition]="id()"
      [class]="className()"
    >
      <ng-content />
    </div>
  `,
})
export class SsgoiTransition {
  id = input.required<string>();
  className = input<string>();
}
