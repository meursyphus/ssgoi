import {
  Directive,
  input,
  OnInit,
  AfterViewInit,
  ElementRef,
  inject,
  PLATFORM_ID,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { injectSsgoi } from "./context";

/**
 * @deprecated Set `data-ssgoi-transition` directly on the page boundary
 * element inside `[ssgoi]` instead.
 */
@Directive({
  selector: "[ssgoiTransition]",
  standalone: true,
})
export class SsgoiTransition implements OnInit, AfterViewInit {
  // The directive attribute value becomes the transition ID
  readonly ssgoiTransition = input.required<string>();

  private readonly ssgoi = injectSsgoi();
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);

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
    this.ssgoi.refFor(this.ssgoiTransition())(targetElement);
  }
}
