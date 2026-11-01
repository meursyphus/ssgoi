// TODO(8.0.0): remove this entry (deprecated in 7.5.0).
import {
  Directive,
  Input,
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
import { ɵLayoutBoundaryView, type SsgoiFramework } from "@ssgoi/angular";

/**
 * @deprecated Will be removed in 8.0.0. Use the `boundary` input of
 * `SsgoiLayoutBoundary` from "@ssgoi/angular" instead.
 */
export interface RouteBoundaryState {
  id: string;
  key?: string | number;
}

/**
 * @deprecated Will be removed in 8.0.0. Use the route your
 * `SsgoiFramework.getRoute` returns, with `SsgoiLayoutBoundary` from
 * "@ssgoi/angular", instead.
 */
export interface AngularRouteLocation {
  pathname: string;
  route: ActivatedRouteSnapshot;
}

type BoundaryContext = { $implicit: RouteBoundaryState };
type ResolveBoundary = (location: AngularRouteLocation) => RouteBoundaryState;

const framework: SsgoiFramework = {
  getRoute: (injector): AngularRouteLocation => {
    const route = injector.get(ActivatedRoute).snapshot;
    const router = injector.get(Router);
    return {
      pathname: router.serializeUrl(
        createUrlTreeFromSnapshot(route, [], null, null),
      ),
      route,
    };
  },
  // Read committed snapshots once per successful navigation. Ancestor URL
  // streams may emit separately while the router advances its route tree.
  onNavigate: (injector, callback) => {
    const subscription = injector.get(Router).events.subscribe((event) => {
      if (event instanceof NavigationEnd) callback();
    });
    return () => subscription.unsubscribe();
  },
};

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

  // Maps the old resolve/key inputs onto the layout boundary's `boundary`.
  private readonly boundary = new ɵLayoutBoundaryView(
    "*ssgoiRouteBoundary",
    () => (route: AngularRouteLocation) => {
      const boundary =
        typeof this.ssgoiRouteBoundary === "function"
          ? this.ssgoiRouteBoundary(route)
          : { id: route.pathname };
      return {
        id: boundary.id,
        key: this.ssgoiRouteBoundaryKey ?? boundary.key ?? boundary.id,
      };
    },
  );

  ngOnInit(): void {
    this.boundary.start(framework);
  }

  ngOnChanges(): void {
    this.boundary.render();
  }

  ngOnDestroy(): void {
    this.boundary.stop();
  }

  static ngTemplateContextGuard(
    _directive: SsgoiRouteBoundary,
    context: unknown,
  ): context is BoundaryContext {
    return true;
  }
}
