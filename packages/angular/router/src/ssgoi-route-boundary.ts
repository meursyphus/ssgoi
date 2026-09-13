import {
  Directive,
  Input,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  inject,
  type EmbeddedViewRef,
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

export interface RouteBoundaryState {
  id: string;
  key?: string | number;
}

export interface AngularRouteLocation {
  pathname: string;
  route: ActivatedRouteSnapshot;
}

type BoundaryContext = { $implicit: RouteBoundaryState };
type ResolveBoundary = (location: AngularRouteLocation) => RouteBoundaryState;

/**
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
  private readonly template = inject<TemplateRef<BoundaryContext>>(TemplateRef);
  private readonly container = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);
  private view?: EmbeddedViewRef<BoundaryContext>;
  private element?: HTMLElement;
  private key?: string | number;
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
    const key = this.ssgoiRouteBoundaryKey ?? boundary.key ?? boundary.id;

    if (!this.view || key !== this.key) {
      this.container.clear();
      this.view = this.container.createEmbeddedView(this.template, {
        $implicit: boundary,
      });
      const roots = this.view.rootNodes.filter((node) => node.nodeType === 1);
      if (roots.length !== 1) {
        this.container.clear();
        this.view = undefined;
        throw new Error(
          "SSGOI: *ssgoiRouteBoundary requires exactly one DOM root.",
        );
      }
      this.element = roots[0];
      this.key = key;
    } else {
      this.view.context.$implicit = boundary;
    }
    this.renderer.setAttribute(
      this.element,
      "data-ssgoi-transition",
      boundary.id,
    );
    this.view.markForCheck();
  }

  static ngTemplateContextGuard(
    _directive: SsgoiRouteBoundary,
    context: unknown,
  ): context is BoundaryContext {
    return true;
  }
}
