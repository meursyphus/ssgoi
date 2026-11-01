// TODO(8.0.0): remove this entry (deprecated in 7.5.0).
import {
  Directive,
  Input,
  inject,
  type OnChanges,
  type OnDestroy,
  type OnInit,
} from "@angular/core";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  createUrlTreeFromSnapshot,
  type ActivatedRouteSnapshot,
} from "@angular/router";
import { ɵLayoutBoundaryView } from "@ssgoi/angular";

/**
 * @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary` from
 * "@ssgoi/angular" instead.
 */
export interface RouteBoundaryState {
  id: string;
  key?: string | number;
}

/**
 * @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary` from
 * "@ssgoi/angular" instead.
 */
export interface AngularRouteLocation {
  pathname: string;
  route: ActivatedRouteSnapshot;
}

type BoundaryContext = { $implicit: RouteBoundaryState };
type ResolveBoundary = (location: AngularRouteLocation) => RouteBoundaryState;

/**
 * @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary`
 * (`*ssgoiLayoutBoundary`) from "@ssgoi/angular" with
 * `[ssgoiFramework]="framework"` on `[ssgoi]` instead.
 *
 * @experimental Angular Router integration. The API may change.
 * Use on a routed page's single DOM root, e.g. <article *ssgoiRouteBoundary>.
 * Recreates the embedded view when its route key changes, including reused
 * parameterized routes. It does not replace RouterOutlet or a RouteReuseStrategy.
 */
@Directive({ selector: "[ssgoiRouteBoundary]", standalone: true })
export class SsgoiRouteBoundary implements OnInit, OnChanges, OnDestroy {
  @Input() ssgoiRouteBoundary?: ResolveBoundary | "";
  @Input() ssgoiRouteBoundaryKey?: string | number;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly view = new ɵLayoutBoundaryView("*ssgoiRouteBoundary");
  private subscription?: { unsubscribe(): void };
  private initialized = false;

  ngOnInit(): void {
    this.initialized = true;
    this.renderBoundary();
    // Read committed snapshots once per successful navigation. Ancestor URL
    // streams may emit separately while the router advances its route tree.
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) this.renderBoundary();
    });
  }

  ngOnChanges(): void {
    if (this.initialized) this.renderBoundary();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private renderBoundary(): void {
    const route = this.route.snapshot;
    const pathname = this.router.serializeUrl(
      createUrlTreeFromSnapshot(route, [], null, null),
    );
    const boundary =
      typeof this.ssgoiRouteBoundary === "function"
        ? this.ssgoiRouteBoundary({ pathname, route })
        : { id: pathname };
    this.view.render({
      id: boundary.id,
      key: this.ssgoiRouteBoundaryKey ?? boundary.key ?? boundary.id,
    });
  }

  static ngTemplateContextGuard(
    _directive: SsgoiRouteBoundary,
    context: unknown,
  ): context is BoundaryContext {
    return true;
  }
}
