import { Component, input, ChangeDetectionStrategy } from "@angular/core";
import { SsgoiTransitionDirective } from "./transition.directive";

@Component({
  selector: "ssgoi-transition",
  imports: [SsgoiTransitionDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
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
  readonly id = input.required<string>();
  readonly className = input<string>();
}
