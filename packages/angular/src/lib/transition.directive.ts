import {
  Directive,
  ElementRef,
  input,
  OnInit,
  OnDestroy,
  inject,
} from "@angular/core";
import { transition } from "@ssgoi/core";
import { injectSsgoi } from "./context";

@Directive({
  selector: "[ssgoiTransition]",
})
export class SsgoiTransitionDirective implements OnInit, OnDestroy {
  ssgoiTransition = input.required<string>();

  private cleanup?: () => void;
  private getTransition = injectSsgoi();
  private el = inject(ElementRef<HTMLElement>);

  ngOnInit() {
    const transitionConfig = this.getTransition(this.ssgoiTransition());
    const cleanupResult = transition(transitionConfig)(this.el.nativeElement);
    if (cleanupResult) {
      this.cleanup = cleanupResult;
    }
  }

  ngOnDestroy() {
    this.cleanup?.();
  }
}
