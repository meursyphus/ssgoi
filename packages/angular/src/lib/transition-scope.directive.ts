import {
  Directive,
  ElementRef,
  OnInit,
  OnDestroy,
  inject,
  PLATFORM_ID,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { createTransitionScope } from "@ssgoi/core";

/**
 * TransitionScope creates a boundary for local-scoped transitions.
 *
 * Child elements with `scope: 'local'` will:
 * - Skip IN animation when mounted simultaneously with the scope
 * - Skip OUT animation when unmounted simultaneously with the scope
 *
 * @example
 * ```html
 * <div transitionScope>
 *   <div [transition]="{ scope: 'local', in: ..., out: ... }">
 *     Content
 *   </div>
 * </div>
 * ```
 */
@Directive({
  selector: "[transitionScope]",
  host: {
    style: "display: contents",
  },
})
export class TransitionScopeDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private cleanup?: () => void;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const cleanupResult = createTransitionScope()(this.el.nativeElement);

    if (cleanupResult) {
      this.cleanup = cleanupResult;
    }
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}
