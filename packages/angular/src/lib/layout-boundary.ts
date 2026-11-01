import {
  DestroyRef,
  Directive,
  InjectionToken,
  Injector,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  inject,
  type EmbeddedViewRef,
  type OnDestroy,
  type OnInit,
} from "@angular/core";
import { resolveLayoutChain } from "@ssgoi/core/internal";
import type { SsgoiLayoutScope } from "@ssgoi/core/types";

/**
 * Router logic for `[ssgoi]`, passed to `[ssgoiFramework]`. Both members
 * receive the `[ssgoi]` element's `Injector`.
 */
export interface SsgoiFramework {
  /** The current route; `renderedPath`, when set, is used over `pathname`. */
  getRoute: (injector: Injector) => { pathname: string; renderedPath?: string };
  /** Subscribe to committed navigations; return an unsubscribe function. */
  onNavigate: (injector: Injector, callback: () => void) => () => void;
}

type LayoutRoute = { routePath: string; chain: string[] };
type BoundaryState = { id: string; key: string | number };
type BoundaryContext = { $implicit: BoundaryState };

const missingFramework =
  'SSGOI: SsgoiLayoutBoundary requires a framework. Pass it to [ssgoi] with [ssgoiFramework]="framework", where framework = { getRoute: (injector) => ({ pathname }), onNavigate: (injector, callback) => unsubscribe }.';

/**
 * @internal The route `[ssgoi]` resolves once and shares with its boundaries.
 * Starts on first read, so `[ssgoi]` inputs are bound by then.
 */
export class LayoutRouteSource {
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly listeners = new Set<(route: LayoutRoute) => void>();
  private route?: LayoutRoute;

  constructor(
    private readonly framework: () => SsgoiFramework | undefined,
    private readonly layouts: () => readonly SsgoiLayoutScope[] | undefined,
  ) {}

  get(): LayoutRoute {
    if (this.route) return this.route;
    const framework = this.framework();
    if (!framework) throw new Error(missingFramework);

    this.route = this.resolve(framework);
    const stop = framework.onNavigate(this.injector, () => {
      const route = (this.route = this.resolve(framework));
      for (const listener of this.listeners) listener(route);
    });
    this.destroyRef.onDestroy(stop);
    return this.route;
  }

  subscribe(listener: (route: LayoutRoute) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private resolve(framework: SsgoiFramework): LayoutRoute {
    const route = framework.getRoute(this.injector);
    const routePath = route.renderedPath ?? route.pathname;
    return { routePath, chain: resolveLayoutChain(this.layouts(), routePath) };
  }
}

export const SSGOI_LAYOUT_ROUTE = new InjectionToken<LayoutRouteSource>(
  "ssgoi-layout-route",
);

const SSGOI_LAYOUT_DEPTH = new InjectionToken<number>("ssgoi-layout-depth");

/**
 * @internal Renders a boundary's embedded view and keeps it while the key
 * holds. Shared by `SsgoiLayoutBoundary` and the deprecated
 * `SsgoiRouteBoundary`; create it in the directive's injection context.
 */
export class ɵLayoutBoundaryView {
  private readonly template = inject<TemplateRef<BoundaryContext>>(TemplateRef);
  private readonly container = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);
  private view?: EmbeddedViewRef<BoundaryContext>;
  private element?: HTMLElement;
  private key?: string | number;

  constructor(private readonly name: string) {}

  render(boundary: BoundaryState): void {
    if (!this.view || boundary.key !== this.key) {
      this.container.clear();
      this.view = this.container.createEmbeddedView(this.template, {
        $implicit: boundary,
      });
      const roots = this.view.rootNodes.filter((node) => node.nodeType === 1);
      if (roots.length !== 1) {
        this.container.clear();
        this.view = undefined;
        throw new Error(`SSGOI: ${this.name} requires exactly one DOM root.`);
      }
      this.element = roots[0];
      this.key = boundary.key;
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
}

/**
 * Use on a routed layout's or page's single DOM root, e.g.
 * <article *ssgoiLayoutBoundary>, under `[ssgoi]` with `[ssgoiFramework]`.
 *
 * Depth is automatic: a boundary under another one is one level deeper. The
 * key is the depth's scope instance from `config.layouts`, falling back to the
 * route path; the embedded view is recreated when the key changes. It does
 * not replace RouterOutlet or a RouteReuseStrategy.
 */
@Directive({
  selector: "[ssgoiLayoutBoundary]",
  standalone: true,
  providers: [
    {
      provide: SSGOI_LAYOUT_DEPTH,
      useFactory: () =>
        (inject(SSGOI_LAYOUT_DEPTH, { optional: true, skipSelf: true }) ?? -1) +
        1,
    },
  ],
})
export class SsgoiLayoutBoundary implements OnInit, OnDestroy {
  private readonly source = inject(SSGOI_LAYOUT_ROUTE, { optional: true });
  private readonly depth = inject(SSGOI_LAYOUT_DEPTH);
  private readonly view = new ɵLayoutBoundaryView("*ssgoiLayoutBoundary");
  private unsubscribe?: () => void;

  ngOnInit(): void {
    if (!this.source) throw new Error(missingFramework);
    this.render(this.source.get());
    this.unsubscribe = this.source.subscribe((route) => this.render(route));
  }

  ngOnDestroy(): void {
    this.unsubscribe?.();
  }

  private render({ routePath, chain }: LayoutRoute): void {
    this.view.render({ id: routePath, key: chain[this.depth] ?? routePath });
  }

  static ngTemplateContextGuard(
    _directive: SsgoiLayoutBoundary,
    context: unknown,
  ): context is BoundaryContext {
    return true;
  }
}
