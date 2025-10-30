import {
  Directive,
  input,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  inject,
  PLATFORM_ID,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { transition } from "@ssgoi/core";
import { injectSsgoi } from "./context";

@Directive({
  selector: "[ssgoiTransition]",
  standalone: true,
})
export class SsgoiTransition implements OnInit, OnDestroy, AfterViewInit {
  // The directive attribute value becomes the transition ID
  readonly ssgoiTransition = input.required<string>();

  private readonly getTransition = injectSsgoi();
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private cleanup?: () => void;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Set data attribute on host element
    this.el.nativeElement.setAttribute(
      "data-ssgoi-transition",
      this.ssgoiTransition(),
    );
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Use the host element itself as the transition target
    const targetElement = this.el.nativeElement;

    const transitionConfig = this.getTransition(this.ssgoiTransition());
    const cleanupResult = transition(transitionConfig)(targetElement);

    if (cleanupResult) {
      this.cleanup = cleanupResult;
    }
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}
