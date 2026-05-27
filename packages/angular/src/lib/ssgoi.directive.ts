import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  input,
  forwardRef,
  PLATFORM_ID,
  inject,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import {
  createSggoiTransitionContext,
  observeSsgoiTransitions,
} from "@ssgoi/core/internal";
import type { HostAnimation } from "@ssgoi/core/internal";
import type { SsgoiConfig, SsgoiContext } from "@ssgoi/core/types";
import { SSGOI_CONTEXT } from "./context";

function createSsgoiContext(component: Ssgoi): SsgoiContext | undefined {
  return component.getContext();
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
export class Ssgoi implements AfterViewInit, OnDestroy {
  readonly config = input<SsgoiConfig>({});
  readonly host = input<HostAnimation | undefined>(undefined);

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private contextValue?: SsgoiContext;
  private stopObserving?: () => void;

  getContext(): SsgoiContext | undefined {
    if (!isPlatformBrowser(this.platformId)) {
      return undefined;
    }

    this.contextValue ??= createSggoiTransitionContext(this.config(), {
      host: this.host(),
    });
    return this.contextValue;
  }

  ngAfterViewInit(): void {
    const ssgoi = this.getContext();
    if (!ssgoi) return;

    this.stopObserving = observeSsgoiTransitions(this.el.nativeElement, ssgoi);
  }

  ngOnDestroy(): void {
    this.stopObserving?.();
  }
}
